import Common "common";

module {
  /// Étapes séquentielles d'un travail de recherche scientifique
  public type ResearchStep = {
    #sujet;
    #problematique;
    #hypotheses;
    #methodologie;
    #plan;
    #redaction;
  };

  /// Statut global d'un projet de recherche
  public type ResearchStatus = {
    #draft;
    #in_progress;
    #completed;
  };

  /// Données d'une étape spécifique du projet
  public type ResearchStepData = {
    step : ResearchStep;
    var content : Text;
    var aiResponse : Text;
    var validated : Bool;
    var validatedAt : ?Common.Timestamp;
    var resources : [Text];
  };

  /// Projet de recherche complet (TFC, mémoire, thèse)
  public type ResearchProject = {
    id : Nat;
    userId : Common.UserId;
    var title : Text;
    var steps : [(ResearchStep, ResearchStepData)];
    var currentStep : ResearchStep;
    var status : ResearchStatus;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
    var resourceCitations : [Text];
  };

  /// Version partageable pour l'API (sans champs mutables)
  public type ResearchProjectPublic = {
    id : Nat;
    userId : Common.UserId;
    title : Text;
    steps : [(ResearchStep, ResearchStepDataPublic)];
    currentStep : ResearchStep;
    status : ResearchStatus;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    resourceCitations : [Text];
  };

  public type ResearchStepDataPublic = {
    step : ResearchStep;
    content : Text;
    aiResponse : Text;
    validated : Bool;
    validatedAt : ?Common.Timestamp;
    resources : [Text];
  };
};
