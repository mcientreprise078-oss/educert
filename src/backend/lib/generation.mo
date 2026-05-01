import Map "mo:core/Map";
import Array "mo:core/Array";
import Debug "mo:core/Debug";
import Common "../types/common";
import GenTypes "../types/generation";

module {
  /// Configuration IA par défaut (DeepSeek → Qwen → GPT-4o)
  public let defaultModelConfig : GenTypes.AIModelConfig = {
    structureModel = "deepseek/deepseek-r1";
    contentModel = "qwen/qwen-2.5-72b-instruct";
    validationModel = "openai/gpt-4o";
  };

  /// Résout une configuration depuis un preset admin
  public func resolvePreset(preset : GenTypes.AIModelPreset) : GenTypes.AIModelConfig {
    switch (preset) {
      case (#default) { defaultModelConfig };
      case (#claudeValidation) {
        { defaultModelConfig with validationModel = "anthropic/claude-3.5-sonnet" };
      };
      case (#gpt5Validation) {
        { defaultModelConfig with validationModel = "openai/gpt-4o" };
      };
      case (#fullClaude) {
        {
          structureModel = "anthropic/claude-3.5-sonnet";
          contentModel = "anthropic/claude-3.5-sonnet";
          validationModel = "anthropic/claude-3.5-sonnet";
        };
      };
    };
  };

  /// Crée une nouvelle demande de génération de cours en file d'attente
  public func create(
    id : Nat,
    description : Text,
    requestedBy : Common.UserId,
    resourceIds : [Nat],
    modelConfig : GenTypes.AIModelConfig,
    createdAt : Common.Timestamp,
  ) : GenTypes.CourseGeneration {
    {
      id;
      requestDescription = description;
      requestedBy;
      var status = #queued;
      var steps = [];
      resourceIds;
      var libraryResultsCount = 0;
      var aiModelConfig = modelConfig;
      var generatedCourseId = null;
      var errorMessage = null;
      createdAt;
      var updatedAt = createdAt;
    };
  };

  /// Convertit une génération interne en version publique partageable
  public func toPublic(self : GenTypes.CourseGeneration) : GenTypes.CourseGenerationPublic {
    {
      id = self.id;
      requestDescription = self.requestDescription;
      requestedBy = self.requestedBy;
      status = self.status;
      steps = self.steps;
      resourceIds = self.resourceIds;
      libraryResultsCount = self.libraryResultsCount;
      aiModelConfig = self.aiModelConfig;
      generatedCourseId = self.generatedCourseId;
      errorMessage = self.errorMessage;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  /// Liste toutes les générations d'un utilisateur donné
  public func listByUser(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    userId : Common.UserId,
  ) : [GenTypes.CourseGenerationPublic] {
    generations.values()
      .filter(func(g) { g.requestedBy == userId })
      .map<GenTypes.CourseGeneration, GenTypes.CourseGenerationPublic>(func(g) { toPublic(g) })
      .toArray();
  };

  /// Liste toutes les générations (admin/reviewer)
  public func listAll(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
  ) : [GenTypes.CourseGenerationPublic] {
    generations.values()
      .map<GenTypes.CourseGeneration, GenTypes.CourseGenerationPublic>(func(g) { toPublic(g) })
      .toArray();
  };

  /// Récupère une génération par son identifiant
  public func getById(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
  ) : ?GenTypes.CourseGenerationPublic {
    switch (generations.get(id)) {
      case (?g) { ?toPublic(g) };
      case null { null };
    };
  };

  /// Met à jour le statut d'une génération
  public func updateStatus(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
    status : GenTypes.GenerationStatus,
    updatedAt : Common.Timestamp,
  ) : Bool {
    switch (generations.get(id)) {
      case (?g) {
        g.status := status;
        g.updatedAt := updatedAt;
        true;
      };
      case null { false };
    };
  };

  /// Enregistre la sortie d'une étape IA dans la génération
  public func recordStepOutput(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
    step : Nat,
    model : Text,
    output : Text,
    completedAt : Common.Timestamp,
  ) : Bool {
    switch (generations.get(id)) {
      case (?g) {
        let newStep : GenTypes.AIStep = {
          step;
          model;
          completedAt = ?completedAt;
          output = ?output;
        };
        let existing = g.steps.findIndex(func(s) { s.step == step });
        switch (existing) {
          case (?idx) {
            let oldSteps = g.steps;
            g.steps := Array.tabulate<GenTypes.AIStep>(
              oldSteps.size(),
              func(i) { if (i == idx) newStep else oldSteps[i] }
            );
          };
          case null {
            g.steps := g.steps.concat([newStep]);
          };
        };
        g.updatedAt := completedAt;
        true;
      };
      case null { false };
    };
  };

  /// Met à jour le nombre de résultats trouvés via bibliothèques mondiales
  public func setLibraryResultsCount(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
    count : Nat,
  ) : Bool {
    switch (generations.get(id)) {
      case (?g) {
        g.libraryResultsCount := count;
        true;
      };
      case null { false };
    };
  };

  /// Approuve une génération et y associe un cours généré
  public func approve(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
    courseId : Common.CourseId,
    updatedAt : Common.Timestamp,
  ) : ?GenTypes.CourseGenerationPublic {
    switch (generations.get(id)) {
      case (?g) {
        g.status := #approved;
        g.generatedCourseId := ?courseId;
        g.updatedAt := updatedAt;
        ?toPublic(g);
      };
      case null { null };
    };
  };

  /// Rejette une génération avec un motif
  public func reject(
    generations : Map.Map<Nat, GenTypes.CourseGeneration>,
    id : Nat,
    reason : Text,
    updatedAt : Common.Timestamp,
  ) : ?GenTypes.CourseGenerationPublic {
    switch (generations.get(id)) {
      case (?g) {
        g.status := #rejected;
        g.errorMessage := ?reason;
        g.updatedAt := updatedAt;
        ?toPublic(g);
      };
      case null { null };
    };
  };
};
