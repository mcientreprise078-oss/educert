import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import NotifLib "../lib/notifications";
import NotifTypes "../types/notifications";
import ProgressTypes "../types/progress";
import Common "../types/common";
import Principal "mo:core/Principal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifications : Map.Map<Nat, NotifTypes.Notification>,
  nextNotifId : { var value : Nat },
  enrollments : Map.Map<(Common.UserId, Common.CourseId), ProgressTypes.Enrollment>,
) {
  let NOTIF_OPENROUTER_API_KEY = "sk-or-replace-with-env-key";
  let NOTIF_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
  let INACTIVITY_MODEL = "qwen/qwen-2.5-72b-instruct";

  // ── Transformation canonique IC ──
  public query func transformNotifHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ── Échappement JSON minimal ──
  func escapeJsonN(s : Text) : Text {
    s
      .replace(#text "\\", "\\\\")
      .replace(#text "\"", "\\\"")
      .replace(#text "\n", "\\n")
      .replace(#text "\r", "\\r");
  };

  // ── Extraction de la réponse IA ──
  func extractContentN(json : Text) : Text {
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

  // ── Génère un rappel personnalisé via IA ──
  func generateInactivityMessage(courseId : Common.CourseId) : async Text {
    let sysPrompt = "Tu es un assistant pédagogique motivant de la plateforme EDUCERT. Génère un court message de rappel en français (2-3 phrases max) pour encourager un apprenant inactif depuis plus de 24h à reprendre sa formation. Le message doit être chaleureux, encourageant et personnalisé.";
    let userPrompt = "L'apprenant n'a pas progressé dans le cours #" # courseId.toText() # " depuis plus de 24 heures. Génère un message de rappel motivant en français.";
    let body = "{\"model\":\"" # INACTIVITY_MODEL # "\",\"messages\":[" #
      "{\"role\":\"system\",\"content\":\"" # escapeJsonN(sysPrompt) # "\"}," #
      "{\"role\":\"user\",\"content\":\"" # escapeJsonN(userPrompt) # "\"}" #
      "]}";
    let headers = [
      { name = "Authorization"; value = "Bearer " # NOTIF_OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    let raw = try {
      await Outcall.httpPostRequest(NOTIF_OPENROUTER_URL, headers, body, transformNotifHttpResponse);
    } catch (_) {
      "Votre formation vous attend ! Reprenez votre cours dès maintenant pour continuer votre progression.";
    };
    let content = extractContentN(raw);
    if (content.size() == 0) {
      "Votre formation vous attend ! Reprenez votre cours dès maintenant pour continuer votre progression.";
    } else { content };
  };

  /// Retourne les notifications de l'utilisateur connecté
  public query ({ caller }) func getMyNotifications({
    unreadOnly : Bool;
  }) : async [NotifTypes.NotificationPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    NotifLib.getUserNotifications(notifications, caller, unreadOnly);
  };

  /// Marque une notification comme lue
  public shared ({ caller }) func markNotificationRead({
    notifId : Nat;
  }) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    NotifLib.markRead(notifications, notifId, caller);
  };

  /// Marque toutes les notifications de l'utilisateur comme lues
  public shared ({ caller }) func markAllNotificationsRead() : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    NotifLib.markAllRead(notifications, caller);
  };

  /// Supprime toutes les notifications de l'utilisateur
  public shared ({ caller }) func clearMyNotifications() : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Non autorisé : connexion requise");
    };
    NotifLib.clearAll(notifications, caller);
  };

  /// (Admin) Génère des notifications d'inactivité pour tous les apprenants inactifs > 24h
  public shared ({ caller }) func generateInactivityNotifications() : async { #ok : Nat; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Non autorisé : rôle administrateur requis");
    };
    // Construit la liste (userId, courseId, lastActivity) depuis les inscriptions
    let enrollmentList = enrollments.values()
      .map(func(e) {
        // Dernière activité = max(enrolledAt, dernière progression)
        let lastActivity = switch (e.lessonProgress.find(func(lp) { lp.completed })) {
          case (?lp) { lp.lastViewedAt };
          case null  { e.enrolledAt };
        };
        (e.learnerId, e.courseId, lastActivity);
      })
      .toArray();

    let inactiveUsers = NotifLib.checkInactiveUsers(enrollmentList);
    var count = 0;

    // Génère une notification personnalisée pour chaque paire (userId, courseId) inactive
    for ((userId, courseId, _) in enrollmentList.values()) {
      if (inactiveUsers.find(func(uid) { Principal.equal(uid, userId) }) != null) {
        let msg = await generateInactivityMessage(courseId);
        ignore NotifLib.create(
          notifications, nextNotifId,
          userId, #inactivity_reminder,
          "Reprenez votre formation !",
          msg,
          ?courseId,
        );
        count += 1;
      };
    };
    #ok(count);
  };
};
