import Common "common";

module {
  /// Type de ressource uploadée par l'admin
  public type ResourceType = {
    #pdf;
    #word;
    #excel;
    #html;
    #video;
    #youtube;
    #weblink;
    #external_course;  // Cours externe intégré (Coursera, Udemy, YouTube, etc.)
    #library_book;     // Livre trouvé via les APIs de bibliothèques mondiales
  };

  /// Statut d'indexation de la ressource
  public type ResourceStatus = {
    #pending;
    #indexed;
    #error;
  };

  /// Ressource interne (état canister — champs mutables)
  public type Resource = {
    id : Nat;
    var title : Text;
    var description : Text;
    resourceType : ResourceType;
    var status : ResourceStatus;
    fileUrl : ?Text;
    externalUrl : ?Text;
    var keywords : ?[Text];
    var subjects : ?[Text];
    var extractedText : ?Text;
    uploadedBy : Common.UserId;
    uploadedAt : Common.Timestamp;
  };

  /// Version immuable pour l'API (boundary partageable)
  public type ResourcePublic = {
    id : Nat;
    title : Text;
    description : Text;
    resourceType : ResourceType;
    status : ResourceStatus;
    fileUrl : ?Text;
    externalUrl : ?Text;
    keywords : ?[Text];
    subjects : ?[Text];
    extractedText : ?Text;
    uploadedBy : Common.UserId;
    uploadedAt : Common.Timestamp;
  };

  /// Cours externe embarqué depuis une autre plateforme de formation
  public type ExternalCourse = {
    id : Text;
    url : Text;
    var title : Text;
    var description : Text;
    platform : Text;
    var thumbnailUrl : ?Text;
    addedBy : Common.UserId;
    addedAt : Common.Timestamp;
    var viewCount : Nat;
  };

  /// Version immuable d'un cours externe pour l'API
  public type ExternalCoursePublic = {
    id : Text;
    url : Text;
    title : Text;
    description : Text;
    platform : Text;
    thumbnailUrl : ?Text;
    addedBy : Common.UserId;
    addedAt : Common.Timestamp;
    viewCount : Nat;
  };

  /// Résultat de recherche retourné par une API de bibliothèque mondiale
  public type LibrarySearchResult = {
    id : Text;
    title : Text;
    author : Text;
    year : ?Text;
    source : Text;
    description : Text;
    url : Text;
    previewUrl : ?Text;
    coverUrl : ?Text;
    videoId : ?Text;  // Identifiant YouTube pour l'intégration vidéo
    sourceType : ?Text;  // Type de source (ex: "youtube", "book", etc.)
  };

  /// Type d'API de bibliothèque mondiale disponible
  public type LibraryApiType = {
    #openLibrary;
    #gutenberg;
    #internetArchive;
    #europeana;
    #googleBooks;
    #doaj;
    #youtube;  // YouTube Data API
  };

  /// Requête de recherche dans les bibliothèques mondiales
  public type LibrarySearchQuery = {
    searchTerm : Text;
    domain : ?Text;
    profession : ?Text;
    maxResults : Nat;
  };
};
