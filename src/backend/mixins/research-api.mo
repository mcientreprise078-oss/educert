import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import ResearchLib "../lib/research";
import ResearchTypes "../types/research";
import ResourceTypes "../types/resources";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  researchProjects : Map.Map<Nat, ResearchTypes.ResearchProject>,
  nextResearchId : { var value : Nat },
  resources : Map.Map<Nat, ResourceTypes.Resource>,
) {
  // NOTE: La clé fournie est partiellement masquée. Remplacez 'sk-ef855d58e' par votre clé réelle complète.
  let RESEARCH_OPENROUTER_API_KEY = "sk-ef855d58e";
  let RESEARCH_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
  let RESEARCH_MODEL = "qwen/qwen-2.5-72b-instruct";

  // ── Transformation canonique IC ──
  public query func transformResearchHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ── Échappement JSON minimal ──
  func escapeJsonR(s : Text) : Text {
    s
      .replace(#text "\\", "\\\\")
      .replace(#text "\"", "\\\"")
      .replace(#text "\n", "\\n")
      .replace(#text "\r", "\\r");
  };

  // ── Extraction de la réponse IA ──
  func extractContentR(json : Text) : Text {
    let marker = "\"content\":\"";
    var parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { json };
      case (?after) {
        var result = "";
        var escape = false;
        var done = false;
        for (c in after.toIter()) {
          if (done) {}
          else if (escape) {
            result #= Text.fromChar(c);
            escape := false;
          } else if (c == '\\') {
            result #= "\\";
            escape := true;
          } else if (c == '\"') {
            done := true;
          } else {
            result #= Text.fromChar(c);
          };
        };
        result;
      };
    };
  };

  // ── Libellé français de chaque étape ──
  func stepLabel(step : ResearchTypes.ResearchStep) : Text {
    switch step {
      case (#sujet)         { "Sujet de recherche" };
      case (#problematique) { "Problématique" };
      case (#hypotheses)    { "Hypothèses de recherche" };
      case (#methodologie)  { "Méthodologie" };
      case (#plan)          { "Plan de travail" };
      case (#redaction)    { "Rédaction" };
    };
  };

  // ── Extrait les ressources pertinentes pour le RAG ──
  func buildResearchContext(projectTitle : Text) : Text {
    let lower = projectTitle.toLower();
    let terms = lower.split(#char ' ').filter(func(t) { t.size() > 3 }).toArray();
    resources.values()
      .filter(func(r) { r.status == #indexed })
      .filter(func(r) {
        if (terms.size() == 0) { return true };
        let hay = r.title.toLower() # " " # r.description.toLower()
          # (switch (r.extractedText) { case (?t) { " " # t.toLower() }; case null { "" } });
        terms.find(func(t) { hay.contains(#text t) }) != null;
      })
      .take(5)
      .foldLeft("", func(acc, r) {
        let excerpt = switch (r.extractedText) {
          case (?t) { if (t.size() > 300) { t.split(#char ' ').take(50).toArray().foldLeft("", func(a, w) { a # " " # w }) } else { t } };
          case null { r.description };
        };
        acc # "\n---\n" # r.title # "\n" # excerpt;
      });
  };

  // ── Construit le prompt directeur de recherche ──
  func buildResearchPrompt(
    projectTitle : Text,
    step : ResearchTypes.ResearchStep,
    userInput : Text,
    ragContext : Text,
    previousStepsContext : Text,
  ) : Text {
    let sysPrompt = "Tu es un Directeur de Recherche scientifique expert, spécialisé dans l'encadrement de TFC, mémoires et thèses en République Démocratique du Congo. " #
      "Tu guides l'étudiant étape par étape sans jamais rédiger à sa place. " #
      "Tu poses des questions pertinentes, valides les concepts, corriges les erreurs méthodologiques et cites les sources disponibles. " #
      "Réponds TOUJOURS en français académique.";
    let stepCtx = "Étape actuelle : " # stepLabel(step);
    let resourceCtx = if (ragContext.size() > 0) {
      "\n\nRessources scientifiques disponibles dans la bibliothèque :\n" # ragContext
    } else { "" };
    let prevCtx = if (previousStepsContext.size() > 0) {
      "\n\nContexte des étapes précédentes :\n" # previousStepsContext
    } else { "" };
    let body = "{\"model\":\"" # RESEARCH_MODEL # "\",\"messages\":[" #
      "{\"role\":\"system\",\"content\":\"" # escapeJsonR(sysPrompt) # "\"}," #
      "{\"role\":\"system\",\"content\":\"" # escapeJsonR(stepCtx # resourceCtx # prevCtx) # "\"}," #
      "{\"role\":\"user\",\"content\":\"Titre du projet : " # escapeJsonR(projectTitle) # "\\n" # escapeJsonR(userInput) # "\"}" #
      "]}";
    body;
  };

  // ── Contexte des étapes précédentes déjà validées ──
  func buildPreviousStepsContext(steps : [(ResearchTypes.ResearchStep, ResearchTypes.ResearchStepDataPublic)]) : Text {
    steps
      .filter(func((_, d)) { d.validated and d.content.size() > 0 })
      .foldLeft("", func(acc, (_, d)) {
        acc # stepLabel(d.step) # " : " # d.content # "\n";
      });
  };

  /// Crée un nouveau projet de recherche (TFC, mémoire, thèse)
  public shared ({ caller }) func createResearchProject({
    title : Text;
  }) : async { #ok : ResearchTypes.ResearchProjectPublic; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    if (title.size() == 0) {
      return #err("Le titre du projet est requis");
    };
    let project = ResearchLib.createProject(researchProjects, nextResearchId, caller, title);
    #ok(ResearchLib.toPublic(project));
  };

  /// Envoie un message à l'IA directeur de recherche pour une étape donnée
  public shared ({ caller }) func sendResearchMessage({
    projectId : Nat;
    step : ResearchTypes.ResearchStep;
    userInput : Text;
  }) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    let project = switch (ResearchLib.getProject(researchProjects, projectId)) {
      case null { return #err("Projet introuvable") };
      case (?p) {
        if (not Principal.equal(p.userId, caller)) {
          return #err("Non autorisé : ce projet ne vous appartient pas");
        };
        p;
      };
    };
    if (userInput.size() == 0) {
      return #err("Le message ne peut pas être vide");
    };
    let ragContext = buildResearchContext(project.title);
    let pub = ResearchLib.toPublic(project);
    let prevContext = buildPreviousStepsContext(pub.steps);
    let body = buildResearchPrompt(project.title, step, userInput, ragContext, prevContext);
    let headers = [
      { name = "Authorization"; value = "Bearer " # RESEARCH_OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    let rawResponse = try {
      await Outcall.httpPostRequest(RESEARCH_OPENROUTER_URL, headers, body, transformResearchHttpResponse);
    } catch (e) {
      return #err("Erreur de communication avec le directeur de recherche IA (OpenRouter/Qwen) : " # e.message() # ". Vérifiez votre connexion et réessayez.");
    };
    let aiContent = extractContentR(rawResponse);
    if (aiContent.size() == 0) {
      return #err("Réponse vide du directeur de recherche IA");
    };
    // Enregistre les échanges dans l'étape
    ignore ResearchLib.updateStep(researchProjects, projectId, step, userInput, aiContent);
    #ok(aiContent);
  };

  /// Valide l'étape courante et déverrouille la suivante
  public shared ({ caller }) func validateResearchStep({
    projectId : Nat;
    step : ResearchTypes.ResearchStep;
  }) : async { #ok : ResearchTypes.ResearchProjectPublic; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    switch (ResearchLib.getProject(researchProjects, projectId)) {
      case null { return #err("Projet introuvable") };
      case (?p) {
        if (not Principal.equal(p.userId, caller)) {
          return #err("Non autorisé : ce projet ne vous appartient pas");
        };
      };
    };
    ResearchLib.validateStep(researchProjects, projectId, step);
  };

  /// Liste tous les projets de recherche de l'utilisateur connecté
  public query ({ caller }) func listMyResearchProjects() : async [ResearchTypes.ResearchProjectPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    ResearchLib.listUserProjects(researchProjects, caller);
  };

  /// Retourne un projet de recherche par son identifiant
  public query ({ caller }) func getResearchProject({
    projectId : Nat;
  }) : async { #ok : ResearchTypes.ResearchProjectPublic; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    switch (ResearchLib.getProject(researchProjects, projectId)) {
      case null { #err("Projet introuvable") };
      case (?p) {
        if (not Principal.equal(p.userId, caller)) {
          return #err("Non autorisé : ce projet ne vous appartient pas");
        };
        #ok(ResearchLib.toPublic(p));
      };
    };
  };
};
