import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ResourceLib "../lib/resources";
import ResourceTypes "../types/resources";
import Common "../types/common";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  resources : Map.Map<Nat, ResourceTypes.Resource>,
  nextResourceId : { var value : Nat },
  externalCourses : Map.Map<Text, ResourceTypes.ExternalCourse>,
  nextExternalCourseId : { var value : Nat },
) {
  // ── Clé API Google Docs / Drive ──
  let GOOGLE_DOCS_API_KEY = "AIzaSyBPCJvRree9Ff0aBYrZNtXtQu9Rd1x8G2w";

  // ── Transformation canonique IC pour les outcalls ──
  public query func transformResourcesHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ── Extrait le texte d'un document Google Docs via l'API REST ──
  // docUrl doit être au format : https://docs.google.com/document/d/{docId}/
  func extractGoogleDocId(docUrl : Text) : ?Text {
    // Format attendu : .../document/d/{docId}/...
    let marker = "/document/d/";
    let parts = docUrl.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?rest) {
        // Le docId se termine au prochain '/' ou à la fin
        var id = "";
        var done = false;
        for (c in rest.toIter()) {
          if (done) {}
          else if (c == '/') { done := true }
          else { id #= Text.fromChar(c) };
        };
        if (id.size() > 0) { ?id } else { null };
      };
    };
  };

  // ── Extrait le texte brut du corps JSON d'un document Google Docs ──
  func extractGoogleDocText(json : Text) : Text {
    // Parcourt le tableau body.content et concatène les paragraphes
    var text = "";
    let marker = "\"content\":\"";
    var parts = json.split(#text marker);
    ignore parts.next();
    label extractLoop loop {
      switch (parts.next()) {
        case null { break extractLoop };
        case (?chunk) {
          var segment = "";
          var done = false;
          var escape = false;
          for (c in chunk.toIter()) {
            if (done) {}
            else if (escape) {
              if (c == 'n') { segment #= "\n" }
              else { segment #= Text.fromChar(c) };
              escape := false;
            } else if (c == '\\') {
              escape := true;
            } else if (c == '\"') {
              done := true;
            } else {
              segment #= Text.fromChar(c);
            };
          };
          if (segment.size() > 0) { text #= segment # " " };
        };
      };
    };
    text;
  };

  /// Importe un document Google Docs par son URL et retourne le texte extrait
  func importGoogleDoc(docUrl : Text) : async Text {
    let docId = switch (extractGoogleDocId(docUrl)) {
      case null { Runtime.trap("URL Google Docs invalide. Format attendu : https://docs.google.com/document/d/{docId}/") };
      case (?id) { id };
    };
    let apiUrl = "https://docs.googleapis.com/v1/documents/" # docId # "?key=" # GOOGLE_DOCS_API_KEY;
    let response = try {
      await Outcall.httpGetRequest(apiUrl, [], transformResourcesHttpResponse);
    } catch (e) {
      Runtime.trap("Erreur lors de l'importation du document Google Docs : " # e.message());
    };
    if (response.size() == 0) {
      Runtime.trap("Réponse vide de l'API Google Docs. Vérifiez que le document est accessible publiquement.");
    };
    let extracted = extractGoogleDocText(response);
    if (extracted.size() == 0) {
      Runtime.trap("Aucun contenu textuel trouvé dans le document Google Docs.");
    };
    extracted;
  };
  /// Upload d'une nouvelle ressource (admin uniquement) — sans limite de nombre
  public shared ({ caller }) func uploadResource(
    title : Text,
    description : Text,
    resourceType : ResourceTypes.ResourceType,
    fileUrl : ?Text,
    externalUrl : ?Text,
    keywords : ?[Text],
  ) : async ResourceTypes.ResourcePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    if (title.size() == 0) {
      Runtime.trap("Le titre de la ressource est requis");
    };
    let now = Time.now();
    let id = nextResourceId.value;
    nextResourceId.value += 1;
    let resource = ResourceLib.create(id, title, description, resourceType, fileUrl, externalUrl, keywords, caller, now);
    resources.add(id, resource);
    resource.toPublic();
  };

  /// Mise à jour des métadonnées d'une ressource (admin uniquement)
  public shared ({ caller }) func updateResourceMetadata(
    id : Nat,
    title : Text,
    description : Text,
    keywords : ?[Text],
    subjects : ?[Text],
  ) : async ResourceTypes.ResourcePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    switch (ResourceLib.updateMetadata(resources, id, title, description, keywords, subjects)) {
      case (?pub) { pub };
      case null { Runtime.trap("Ressource introuvable") };
    };
  };

  /// Suppression d'une ressource (admin uniquement)
  public shared ({ caller }) func deleteResource(
    id : Nat,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    if (not ResourceLib.delete(resources, id)) {
      Runtime.trap("Ressource introuvable");
    };
  };

  /// Liste des ressources avec filtres optionnels (utilisateurs authentifiés)
  public query ({ caller }) func listResources(
    resourceType : ?ResourceTypes.ResourceType,
    search : ?Text,
  ) : async [ResourceTypes.ResourcePublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    ResourceLib.listAll(resources, resourceType, search);
  };

  /// Récupère une ressource par son identifiant (utilisateurs authentifiés)
  public query ({ caller }) func getResource(
    id : Nat,
  ) : async ?ResourceTypes.ResourcePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    ResourceLib.getById(resources, id);
  };

  /// Enregistre le texte extrait d'une ressource et la marque comme indexée (admin uniquement)
  public shared ({ caller }) func indexResourceText(
    id : Nat,
    extractedText : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    if (not ResourceLib.setExtractedText(resources, id, extractedText)) {
      Runtime.trap("Ressource introuvable");
    };
  };

  /// Ajoute un cours externe depuis une autre plateforme (admin uniquement)
  public shared ({ caller }) func addExternalCourse(
    url : Text,
    title : Text,
    description : Text,
    platform : Text,
    thumbnailUrl : ?Text,
  ) : async { #ok : ResourceTypes.ExternalCoursePublic; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Non autorisé : rôle administrateur requis");
    };
    if (url.size() == 0) {
      return #err("L'URL du cours est requise");
    };
    if (title.size() == 0) {
      return #err("Le titre du cours est requis");
    };
    // Infer platform from URL domain if not provided
    let resolvedPlatform = if (platform.size() > 0) {
      platform
    } else if (url.contains(#text "youtube.com") or url.contains(#text "youtu.be")) {
      "YouTube"
    } else if (url.contains(#text "coursera.org")) {
      "Coursera"
    } else if (url.contains(#text "udemy.com")) {
      "Udemy"
    } else if (url.contains(#text "skillshare.com")) {
      "Skillshare"
    } else {
      "Autre"
    };
    let now = Time.now();
    let id = nextExternalCourseId.value.toText();
    nextExternalCourseId.value += 1;
    let course = ResourceLib.createExternalCourse(id, url, title, description, resolvedPlatform, thumbnailUrl, caller, now);
    externalCourses.add(id, course);
    #ok(course.externalCourseToPublic());
  };

  /// Liste tous les cours externes enregistrés (utilisateurs authentifiés)
  public query ({ caller }) func listExternalCourses() : async [ResourceTypes.ExternalCoursePublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    // Sort by addedAt descending
    externalCourses.values()
      .map<ResourceTypes.ExternalCourse, ResourceTypes.ExternalCoursePublic>(func(c) {
        c.externalCourseToPublic()
      })
      .toArray()
      .sort(func(a, b) {
        if (a.addedAt > b.addedAt) { #less }
        else if (a.addedAt < b.addedAt) { #greater }
        else { #equal }
      });
  };

  /// Supprime un cours externe par son identifiant (admin uniquement)
  public shared ({ caller }) func deleteExternalCourse(
    id : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Non autorisé : rôle administrateur requis");
    };
    if (ResourceLib.deleteExternalCourse(externalCourses, id)) {
      #ok
    } else {
      #err("Cours externe introuvable")
    };
  };

  /// Importe un document Google Docs et crée une ressource (admin uniquement)
  /// docUrl : URL du document (ex: https://docs.google.com/document/d/{docId}/edit)
  public shared ({ caller }) func importGoogleDocResource(
    docUrl : Text,
    title : Text,
    adminId : Principal,
  ) : async { #ok : Nat; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Non autorisé : rôle administrateur requis");
    };
    if (docUrl.size() == 0) {
      return #err("L'URL du document Google Docs est requise");
    };
    if (title.size() == 0) {
      return #err("Le titre du document est requis");
    };
    let extractedText = try {
      await importGoogleDoc(docUrl);
    } catch (e) {
      return #err("Erreur lors de l'importation du document Google Docs : " # e.message());
    };
    let now = Time.now();
    let id = nextResourceId.value;
    nextResourceId.value += 1;
    let resource = ResourceLib.create(
      id,
      title,
      "Document importé depuis Google Docs : " # docUrl,
      #weblink,
      null,
      ?docUrl,
      null,
      adminId,
      now,
    );
    resource.extractedText := ?extractedText;
    resource.status := #indexed;
    resources.add(id, resource);
    #ok(id);
  };

  /// Incrémente le compteur de vues d'un cours externe (utilisateurs authentifiés)
  public shared ({ caller }) func trackExternalCourseView(
    id : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    ignore ResourceLib.incrementViewCount(externalCourses, id);
  };
};
