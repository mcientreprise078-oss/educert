import Map "mo:core/Map";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Common "../types/common";
import ResourceTypes "../types/resources";

module {
  /// Crée une nouvelle ressource à partir des paramètres fournis
  public func create(
    id : Nat,
    title : Text,
    description : Text,
    resourceType : ResourceTypes.ResourceType,
    fileUrl : ?Text,
    externalUrl : ?Text,
    keywords : ?[Text],
    uploadedBy : Common.UserId,
    uploadedAt : Common.Timestamp,
  ) : ResourceTypes.Resource {
    {
      id;
      var title = title;
      var description = description;
      resourceType;
      var status = #pending;
      fileUrl;
      externalUrl;
      var keywords = keywords;
      var subjects = null;
      var extractedText = null;
      uploadedBy;
      uploadedAt;
    };
  };

  /// Convertit une ressource interne en version publique partageable
  public func toPublic(self : ResourceTypes.Resource) : ResourceTypes.ResourcePublic {
    {
      id = self.id;
      title = self.title;
      description = self.description;
      resourceType = self.resourceType;
      status = self.status;
      fileUrl = self.fileUrl;
      externalUrl = self.externalUrl;
      keywords = self.keywords;
      subjects = self.subjects;
      extractedText = self.extractedText;
      uploadedBy = self.uploadedBy;
      uploadedAt = self.uploadedAt;
    };
  };

  /// Convertit un cours externe interne en version publique partageable
  public func externalCourseToPublic(self : ResourceTypes.ExternalCourse) : ResourceTypes.ExternalCoursePublic {
    {
      id = self.id;
      url = self.url;
      title = self.title;
      description = self.description;
      platform = self.platform;
      thumbnailUrl = self.thumbnailUrl;
      addedBy = self.addedBy;
      addedAt = self.addedAt;
      viewCount = self.viewCount;
    };
  };

  /// Liste toutes les ressources, avec filtre optionnel par type et recherche textuelle
  public func listAll(
    resources : Map.Map<Nat, ResourceTypes.Resource>,
    resourceType : ?ResourceTypes.ResourceType,
    search : ?Text,
  ) : [ResourceTypes.ResourcePublic] {
    let lower = switch (search) {
      case (?s) { s.toLower() };
      case null { "" };
    };
    resources.values()
      .filter(func(r) {
        let matchesType = switch (resourceType) {
          case (?rt) { r.resourceType == rt };
          case null { true };
        };
        let matchesSearch = lower.size() == 0
          or r.title.toLower().contains(#text lower)
          or r.description.toLower().contains(#text lower)
          or (switch (r.keywords) {
            case (?kws) {
              kws.any(func(k) { k.toLower().contains(#text lower) })
            };
            case null { false };
          });
        matchesType and matchesSearch;
      })
      .map<ResourceTypes.Resource, ResourceTypes.ResourcePublic>(func(r) { toPublic(r) })
      .toArray();
  };

  /// Récupère une ressource par son identifiant
  public func getById(
    resources : Map.Map<Nat, ResourceTypes.Resource>,
    id : Nat,
  ) : ?ResourceTypes.ResourcePublic {
    switch (resources.get(id)) {
      case (?r) { ?toPublic(r) };
      case null { null };
    };
  };

  /// Met à jour les métadonnées d'une ressource existante
  public func updateMetadata(
    resources : Map.Map<Nat, ResourceTypes.Resource>,
    id : Nat,
    title : Text,
    description : Text,
    keywords : ?[Text],
    subjects : ?[Text],
  ) : ?ResourceTypes.ResourcePublic {
    switch (resources.get(id)) {
      case (?r) {
        r.title := title;
        r.description := description;
        r.keywords := keywords;
        r.subjects := subjects;
        ?toPublic(r);
      };
      case null { null };
    };
  };

  /// Enregistre le texte extrait d'une ressource et marque comme indexée
  public func setExtractedText(
    resources : Map.Map<Nat, ResourceTypes.Resource>,
    id : Nat,
    extractedText : Text,
  ) : Bool {
    switch (resources.get(id)) {
      case (?r) {
        r.extractedText := ?extractedText;
        r.status := #indexed;
        true;
      };
      case null { false };
    };
  };

  /// Supprime une ressource par son identifiant, retourne true si elle existait
  public func delete(
    resources : Map.Map<Nat, ResourceTypes.Resource>,
    id : Nat,
  ) : Bool {
    switch (resources.get(id)) {
      case (?_) {
        resources.remove(id);
        true;
      };
      case null { false };
    };
  };

  /// Crée un nouveau cours externe
  public func createExternalCourse(
    id : Text,
    url : Text,
    title : Text,
    description : Text,
    platform : Text,
    thumbnailUrl : ?Text,
    addedBy : Common.UserId,
    addedAt : Common.Timestamp,
  ) : ResourceTypes.ExternalCourse {
    {
      id;
      url;
      var title = title;
      var description = description;
      platform;
      var thumbnailUrl = thumbnailUrl;
      addedBy;
      addedAt;
      var viewCount = 0;
    };
  };

  /// Incrémente le compteur de vues d'un cours externe
  public func incrementViewCount(
    externalCourses : Map.Map<Text, ResourceTypes.ExternalCourse>,
    id : Text,
  ) : Bool {
    switch (externalCourses.get(id)) {
      case (?c) {
        c.viewCount += 1;
        true;
      };
      case null { false };
    };
  };

  /// Supprime un cours externe par son identifiant
  public func deleteExternalCourse(
    externalCourses : Map.Map<Text, ResourceTypes.ExternalCourse>,
    id : Text,
  ) : Bool {
    switch (externalCourses.get(id)) {
      case (?_) {
        externalCourses.remove(id);
        true;
      };
      case null { false };
    };
  };
};
