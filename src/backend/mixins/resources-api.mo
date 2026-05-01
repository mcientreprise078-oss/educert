import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ResourceLib "../lib/resources";
import ResourceTypes "../types/resources";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  resources : Map.Map<Nat, ResourceTypes.Resource>,
  nextResourceId : { var value : Nat },
  externalCourses : Map.Map<Text, ResourceTypes.ExternalCourse>,
  nextExternalCourseId : { var value : Nat },
) {
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
