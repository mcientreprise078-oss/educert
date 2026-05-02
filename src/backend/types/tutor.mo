import Common "common";

module {
  /// Rôle d'un message dans la conversation avec le tuteur IA
  public type TutorMessageRole = {
    #user;
    #assistant;
  };

  /// Message échangé avec le tuteur IA pendant une leçon
  public type TutorMessage = {
    id : Nat;
    courseId : Common.CourseId;
    lessonId : Common.LessonId;
    userId : Common.UserId;
    role : TutorMessageRole;
    content : Text;
    createdAt : Common.Timestamp;
  };

  /// Historique de conversation pour un utilisateur dans un cours
  public type TutorChatHistory = {
    userId : Common.UserId;
    courseId : Common.CourseId;
    messages : [TutorMessage];
  };
};
