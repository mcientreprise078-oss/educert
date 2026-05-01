import Map "mo:core/Map";

/// Migration module — upgrades stable state from previous canister version
module {
  // ── Old types (inlined from .old/src/backend/types/) ──────────────────────

  type OldTimestamp = Int;
  type OldUserId = Principal;
  type OldCourseId = Nat;

  type OldGenerationStatus = {
    #queued;
    #step1_deepseek;
    #step2_qwen;
    #step3_gpt4o;
    #approved;
    #rejected;
    #revision_needed;
  };

  type OldAIStep = {
    step : Nat;
    model : Text;
    completedAt : ?OldTimestamp;
    output : ?Text;
  };

  /// Old CourseGeneration — no aiModelConfig, no libraryResultsCount
  type OldCourseGeneration = {
    id : Nat;
    requestDescription : Text;
    requestedBy : OldUserId;
    var status : OldGenerationStatus;
    var steps : [OldAIStep];
    resourceIds : [Nat];
    var generatedCourseId : ?OldCourseId;
    var errorMessage : ?Text;
    createdAt : OldTimestamp;
    var updatedAt : OldTimestamp;
  };

  /// Old ResourceType — no #external_course, no #library_book
  type OldResourceType = {
    #pdf;
    #word;
    #excel;
    #html;
    #video;
    #youtube;
    #weblink;
  };

  type OldResourceStatus = { #pending; #indexed; #error };

  type OldResource = {
    id : Nat;
    var title : Text;
    var description : Text;
    resourceType : OldResourceType;
    var status : OldResourceStatus;
    fileUrl : ?Text;
    externalUrl : ?Text;
    var keywords : ?[Text];
    var subjects : ?[Text];
    var extractedText : ?Text;
    uploadedBy : OldUserId;
    uploadedAt : OldTimestamp;
  };

  // ── New types (imported via new type modules) ──────────────────────────────

  type NewGenerationStatus = {
    #queued;
    #step1_deepseek;
    #step2_qwen;
    #step3_gpt4o;
    #approved;
    #rejected;
    #revision_needed;
  };

  type NewAIStep = {
    step : Nat;
    model : Text;
    completedAt : ?OldTimestamp;
    output : ?Text;
  };

  type NewAIModelConfig = {
    structureModel : Text;
    contentModel : Text;
    validationModel : Text;
  };

  type NewCourseGeneration = {
    id : Nat;
    requestDescription : Text;
    requestedBy : OldUserId;
    var status : NewGenerationStatus;
    var steps : [NewAIStep];
    resourceIds : [Nat];
    var libraryResultsCount : Nat;
    var aiModelConfig : NewAIModelConfig;
    var generatedCourseId : ?OldCourseId;
    var errorMessage : ?Text;
    createdAt : OldTimestamp;
    var updatedAt : OldTimestamp;
  };

  type NewResourceType = {
    #pdf;
    #word;
    #excel;
    #html;
    #video;
    #youtube;
    #weblink;
    #external_course;
    #library_book;
  };

  type NewResource = {
    id : Nat;
    var title : Text;
    var description : Text;
    resourceType : NewResourceType;
    var status : OldResourceStatus;
    fileUrl : ?Text;
    externalUrl : ?Text;
    var keywords : ?[Text];
    var subjects : ?[Text];
    var extractedText : ?Text;
    uploadedBy : OldUserId;
    uploadedAt : OldTimestamp;
  };

  // ── Actor state shapes ─────────────────────────────────────────────────────

  type OldActor = {
    generations : Map.Map<Nat, OldCourseGeneration>;
    resources : Map.Map<Nat, OldResource>;
  };

  type NewActor = {
    generations : Map.Map<Nat, NewCourseGeneration>;
    resources : Map.Map<Nat, NewResource>;
  };

  // ── Default AI model config applied to all existing generations ────────────

  let defaultModelConfig : NewAIModelConfig = {
    structureModel = "deepseek/deepseek-r1";
    contentModel = "qwen/qwen-2.5-72b-instruct";
    validationModel = "openai/gpt-4o";
  };

  // ── Upgrade old ResourceType variant to new (all old cases remain valid) ──

  func upgradeResourceType(old : OldResourceType) : NewResourceType {
    switch old {
      case (#pdf) { #pdf };
      case (#word) { #word };
      case (#excel) { #excel };
      case (#html) { #html };
      case (#video) { #video };
      case (#youtube) { #youtube };
      case (#weblink) { #weblink };
    };
  };

  // ── Public migration entry point ───────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate generations: add aiModelConfig + libraryResultsCount with defaults
    let generations = old.generations.map<Nat, OldCourseGeneration, NewCourseGeneration>(
      func(_id, g) {
        {
          id = g.id;
          requestDescription = g.requestDescription;
          requestedBy = g.requestedBy;
          var status = g.status;
          var steps = g.steps;
          resourceIds = g.resourceIds;
          var libraryResultsCount = 0;
          var aiModelConfig = defaultModelConfig;
          var generatedCourseId = g.generatedCourseId;
          var errorMessage = g.errorMessage;
          createdAt = g.createdAt;
          var updatedAt = g.updatedAt;
        };
      }
    );

    // Migrate resources: upgrade ResourceType variant, enumerate all fields
    let resources = old.resources.map<Nat, OldResource, NewResource>(
      func(_id, r) {
        {
          id = r.id;
          var title = r.title;
          var description = r.description;
          resourceType = upgradeResourceType(r.resourceType);
          var status = r.status;
          fileUrl = r.fileUrl;
          externalUrl = r.externalUrl;
          var keywords = r.keywords;
          var subjects = r.subjects;
          var extractedText = r.extractedText;
          uploadedBy = r.uploadedBy;
          uploadedAt = r.uploadedAt;
        };
      }
    );

    { generations; resources };
  };
};
