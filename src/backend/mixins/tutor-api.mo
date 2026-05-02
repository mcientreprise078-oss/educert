import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import TutorLib "../lib/tutor";
import TutorTypes "../types/tutor";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tutorMessages : List.List<TutorTypes.TutorMessage>,
  nextTutorMessageId : { var value : Nat },
) {
  // NOTE: La clé fournie est partiellement masquée. Remplacez 'sk-ef855d58e' par votre clé réelle complète.
  let TUTOR_OPENROUTER_API_KEY = "sk-ef855d58e";
  let TUTOR_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
  let TUTOR_MODEL = "qwen/qwen-2.5-72b-instruct";

  // ── Transformation canonique IC ──
  public query func transformTutorHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ── Échappement JSON minimal ──
  func escapeJsonT(s : Text) : Text {
    s
      .replace(#text "\\", "\\\\")
      .replace(#text "\"", "\\\"")
      .replace(#text "\n", "\\n")
      .replace(#text "\r", "\\r");
  };

  // ── Extraction de la réponse IA dans le JSON OpenRouter ──
  func extractContentT(json : Text) : Text {
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

  // ── Construit le corps JSON pour OpenRouter ──
  func buildTutorBody(history : [TutorTypes.TutorMessage], newQuestion : Text, lessonContext : Text) : Text {
    var msgs = "";
    // Prompt système
    let sysPrompt = "Tu es un tuteur académique expert. Réponds en français comme un professeur d'université. Sois précis, pédagogique et bienveillant.";
    msgs #= "{\"role\":\"system\",\"content\":\"" # escapeJsonT(sysPrompt) # "\"}";
    // Contexte de la leçon si fourni
    if (lessonContext.size() > 0) {
      msgs #= ",{\"role\":\"system\",\"content\":\"Contexte de la leçon en cours : " # escapeJsonT(lessonContext) # "\"}";
    };
    // Historique (max 10 derniers messages pour garder le contexte sans dépasser les limites)
    let recentHistory = if (history.size() > 10) {
      history.sliceToArray(history.size().toInt() - 10, history.size().toInt())
    } else { history };
    for (m in recentHistory.values()) {
      let roleStr = switch (m.role) { case (#user) { "user" }; case (#assistant) { "assistant" } };
      msgs #= ",{\"role\":\"" # roleStr # "\",\"content\":\"" # escapeJsonT(m.content) # "\"}";
    };
    // Nouvelle question
    msgs #= ",{\"role\":\"user\",\"content\":\"" # escapeJsonT(newQuestion) # "\"}";
    "{\"model\":\"" # TUTOR_MODEL # "\",\"messages\":[" # msgs # "]}";
  };

  /// Pose une question au tuteur IA pendant une leçon
  public shared ({ caller }) func askTutor({
    courseId : Common.CourseId;
    lessonId : Common.LessonId;
    question : Text;
    lessonContext : Text;
  }) : async { #ok : TutorTypes.TutorMessage; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    if (question.size() == 0) {
      return #err("La question ne peut pas être vide");
    };
    // Enregistre la question de l'utilisateur
    ignore TutorLib.addMessage(
      tutorMessages, nextTutorMessageId,
      caller, courseId, lessonId, #user, question,
    );
    // Récupère l'historique pour donner le contexte à l'IA
    let history = TutorLib.getHistory(tutorMessages, caller, courseId);
    let body = buildTutorBody(history, question, lessonContext);
    let headers = [
      { name = "Authorization"; value = "Bearer " # TUTOR_OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    let rawResponse = try {
      await Outcall.httpPostRequest(TUTOR_OPENROUTER_URL, headers, body, transformTutorHttpResponse);
    } catch (e) {
      return #err("Erreur de communication avec le tuteur IA (OpenRouter/Qwen) : " # e.message() # ". Veuillez réessayer dans quelques instants.");
    };
    let aiContent = extractContentT(rawResponse);
    if (aiContent.size() == 0) {
      return #err("Réponse vide du tuteur IA");
    };
    // Enregistre la réponse de l'assistant
    let assistantMsg = TutorLib.addMessage(
      tutorMessages, nextTutorMessageId,
      caller, courseId, lessonId, #assistant, aiContent,
    );
    #ok(assistantMsg);
  };

  /// Consulte l'historique de conversation avec le tuteur pour un cours
  public query ({ caller }) func queryTutorHistory({
    courseId : Common.CourseId;
  }) : async [TutorTypes.TutorMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    TutorLib.getHistory(tutorMessages, caller, courseId);
  };

  /// Efface l'historique de conversation pour un cours
  public shared ({ caller }) func clearTutorHistory({
    courseId : Common.CourseId;
  }) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    TutorLib.clearHistory(tutorMessages, caller, courseId);
    #ok;
  };
};
