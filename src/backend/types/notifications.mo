import Common "common";

module {
  /// Type de notification in-app
  public type NotificationType = {
    #inactivity_reminder;
    #course_update;
    #quiz_ready;
    #certificate_issued;
    #research_feedback;
  };

  /// Notification in-app (email désactivé)
  public type Notification = {
    id : Nat;
    userId : Common.UserId;
    notificationType : NotificationType;
    var title : Text;
    var message : Text;
    courseId : ?Common.CourseId;
    var isRead : Bool;
    createdAt : Common.Timestamp;
  };

  /// Version partageable pour l'API
  public type NotificationPublic = {
    id : Nat;
    userId : Common.UserId;
    notificationType : NotificationType;
    title : Text;
    message : Text;
    courseId : ?Common.CourseId;
    isRead : Bool;
    createdAt : Common.Timestamp;
  };
};
