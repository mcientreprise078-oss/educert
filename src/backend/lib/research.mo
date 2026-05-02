import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ResearchTypes "../types/research";
import Principal "mo:core/Principal";

module {
  /// Ordre séquentiel des étapes de recherche
  func stepIndex(step : ResearchTypes.ResearchStep) : Nat {
    switch step {
      case (#sujet)        { 0 };
      case (#problematique){ 1 };
      case (#hypotheses)   { 2 };
      case (#methodologie) { 3 };
      case (#plan)         { 4 };
      case (#redaction)    { 5 };
    };
  };

  /// Étape suivante dans la séquence (null si dernière)
  func nextStep(step : ResearchTypes.ResearchStep) : ?ResearchTypes.ResearchStep {
    switch step {
      case (#sujet)        { ?#problematique };
      case (#problematique){ ?#hypotheses };
      case (#hypotheses)   { ?#methodologie };
      case (#methodologie) { ?#plan };
      case (#plan)         { ?#redaction };
      case (#redaction)    { null };
    };
  };

  /// Construit les données initiales pour toutes les étapes
  func initSteps() : [(ResearchTypes.ResearchStep, ResearchTypes.ResearchStepData)] {
    let steps : [ResearchTypes.ResearchStep] = [
      #sujet, #problematique, #hypotheses, #methodologie, #plan, #redaction,
    ];
    steps.map<ResearchTypes.ResearchStep, (ResearchTypes.ResearchStep, ResearchTypes.ResearchStepData)>(func(s) {
      (s, {
        step = s;
        var content = "";
        var aiResponse = "";
        var validated = false;
        var validatedAt = null;
        var resources = [];
      });
    });
  };

  /// Crée un nouveau projet de recherche
  public func createProject(
    projects : Map.Map<Nat, ResearchTypes.ResearchProject>,
    nextId : { var value : Nat },
    userId : Common.UserId,
    title : Text,
  ) : ResearchTypes.ResearchProject {
    if (title.size() == 0) {
      Runtime.trap("Le titre du projet est requis");
    };
    let id = nextId.value;
    nextId.value += 1;
    let now = Time.now();
    let project : ResearchTypes.ResearchProject = {
      id;
      userId;
      var title;
      var steps = initSteps();
      var currentStep = #sujet;
      var status = #draft;
      createdAt = now;
      var updatedAt = now;
      var resourceCitations = [];
    };
    projects.add(id, project);
    project;
  };

  /// Retourne un projet par son identifiant
  public func getProject(
    projects : Map.Map<Nat, ResearchTypes.ResearchProject>,
    projectId : Nat,
  ) : ?ResearchTypes.ResearchProject {
    projects.get(projectId);
  };

  /// Liste tous les projets d'un utilisateur
  public func listUserProjects(
    projects : Map.Map<Nat, ResearchTypes.ResearchProject>,
    userId : Common.UserId,
  ) : [ResearchTypes.ResearchProjectPublic] {
    projects.values()
      .filter(func(p) { Principal.equal(p.userId, userId) })
      .map<ResearchTypes.ResearchProject, ResearchTypes.ResearchProjectPublic>(toPublic)
      .toArray();
  };

  /// Met à jour le contenu et la réponse IA d'une étape
  public func updateStep(
    projects : Map.Map<Nat, ResearchTypes.ResearchProject>,
    projectId : Nat,
    step : ResearchTypes.ResearchStep,
    content : Text,
    aiResponse : Text,
  ) : { #ok; #err : Text } {
    switch (projects.get(projectId)) {
      case null { #err("Projet introuvable") };
      case (?project) {
        let stepIdx = stepIndex(step);
        let currentIdx = stepIndex(project.currentStep);
        if (stepIdx > currentIdx) {
          return #err("Étape non encore débloquée — validez l'étape précédente d'abord");
        };
        // Mutate the step data directly instead of rebuilding the tuple
        switch (project.steps.find(func((s, _)) { s == step })) {
          case null {};
          case (?(_, d)) {
            d.content := content;
            d.aiResponse := aiResponse;
          };
        };
        project.updatedAt := Time.now();
        if (project.status == #draft) { project.status := #in_progress };
        #ok;
      };
    };
  };

  /// Valide l'étape courante et déverrouille la suivante
  public func validateStep(
    projects : Map.Map<Nat, ResearchTypes.ResearchProject>,
    projectId : Nat,
    step : ResearchTypes.ResearchStep,
  ) : { #ok : ResearchTypes.ResearchProjectPublic; #err : Text } {
    switch (projects.get(projectId)) {
      case null { #err("Projet introuvable") };
      case (?project) {
        if (project.currentStep != step) {
          return #err("Seule l'étape courante peut être validée");
        };
        // Vérifie que l'étape a du contenu
        let stepData = project.steps.find(
          func((s, _)) { s == step },
        );
        switch stepData {
          case null { return #err("Données de l'étape introuvables") };
          case (?(_, d)) {
            if (d.content.size() == 0) {
              return #err("L'étape doit avoir du contenu avant d'être validée");
            };
            d.validated := true;
            d.validatedAt := ?Time.now();
          };
        };
        let now = Time.now();
        project.updatedAt := now;
        // Débloque l'étape suivante ou marque comme terminé
        switch (nextStep(step)) {
          case (?ns) { project.currentStep := ns };
          case null  { project.status := #completed };
        };
        #ok(toPublic(project));
      };
    };
  };

  /// Convertit un projet interne en version partageable
  public func toPublic(project : ResearchTypes.ResearchProject) : ResearchTypes.ResearchProjectPublic {
    {
      id = project.id;
      userId = project.userId;
      title = project.title;
      steps = project.steps.map<
        (ResearchTypes.ResearchStep, ResearchTypes.ResearchStepData),
        (ResearchTypes.ResearchStep, ResearchTypes.ResearchStepDataPublic)
      >(func((s, d)) {
        (s, {
          step = d.step;
          content = d.content;
          aiResponse = d.aiResponse;
          validated = d.validated;
          validatedAt = d.validatedAt;
          resources = d.resources;
        });
      });
      currentStep = project.currentStep;
      status = project.status;
      createdAt = project.createdAt;
      updatedAt = project.updatedAt;
      resourceCitations = project.resourceCitations;
    };
  };
};
