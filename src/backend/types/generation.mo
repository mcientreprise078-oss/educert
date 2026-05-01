import Common "common";

module {
  /// Statut du pipeline de génération IA séquentiel
  public type GenerationStatus = {
    #queued;
    #step1_deepseek;
    #step2_qwen;
    #step3_gpt4o;
    #approved;
    #rejected;
    #revision_needed;
  };

  /// Étape IA individuelle dans le pipeline séquentiel
  public type AIStep = {
    step : Nat;
    model : Text;
    completedAt : ?Common.Timestamp;
    output : ?Text;
  };

  /// Configuration des modèles IA utilisés pour la génération
  public type AIModelConfig = {
    structureModel : Text;   // ex: "deepseek/deepseek-r1"
    contentModel : Text;     // ex: "qwen/qwen-2.5-72b-instruct"
    validationModel : Text;  // ex: "openai/gpt-4o"
  };

  /// Preset de modèles IA prédéfini sélectionnable par l'admin
  public type AIModelPreset = {
    #default;
    #claudeValidation;
    #gpt5Validation;
    #fullClaude;
  };

  /// Demande de génération de cours (état interne — champs mutables)
  public type CourseGeneration = {
    id : Nat;
    requestDescription : Text;
    requestedBy : Common.UserId;
    var status : GenerationStatus;
    var steps : [AIStep];
    resourceIds : [Nat];
    var libraryResultsCount : Nat;       // Nombre de ressources trouvées via bibliothèques mondiales
    var aiModelConfig : AIModelConfig;   // Modèles IA effectivement utilisés
    var generatedCourseId : ?Common.CourseId;
    var errorMessage : ?Text;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  /// Version immuable pour l'API (boundary partageable)
  public type CourseGenerationPublic = {
    id : Nat;
    requestDescription : Text;
    requestedBy : Common.UserId;
    status : GenerationStatus;
    steps : [AIStep];
    resourceIds : [Nat];
    libraryResultsCount : Nat;
    aiModelConfig : AIModelConfig;
    generatedCourseId : ?Common.CourseId;
    errorMessage : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  /// Résultat de vérification d'un certificat via QR
  public type CertificateVerification = {
    courseTitle : Text;
    issueDate : Common.Timestamp;
    ministryApproved : Bool;
    isValid : Bool;
  };
};
