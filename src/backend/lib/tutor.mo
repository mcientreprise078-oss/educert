import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import TutorTypes "../types/tutor";
import Principal "mo:core/Principal";

module {
  /// Ajoute un message dans l'historique d'un cours pour un utilisateur
  public func addMessage(
    messages : List.List<TutorTypes.TutorMessage>,
    nextId : { var value : Nat },
    userId : Common.UserId,
    courseId : Common.CourseId,
    lessonId : Common.LessonId,
    role : TutorTypes.TutorMessageRole,
    content : Text,
  ) : TutorTypes.TutorMessage {
    let id = nextId.value;
    nextId.value += 1;
    let msg : TutorTypes.TutorMessage = {
      id;
      courseId;
      lessonId;
      userId;
      role;
      content;
      createdAt = Time.now();
    };
    messages.add(msg);
    msg;
  };

  /// Retourne l'historique de conversation d'un utilisateur pour un cours
  public func getHistory(
    messages : List.List<TutorTypes.TutorMessage>,
    userId : Common.UserId,
    courseId : Common.CourseId,
  ) : [TutorTypes.TutorMessage] {
    messages
      .filter(func(m) {
        Principal.equal(m.userId, userId) and m.courseId == courseId
      })
      .toArray();
  };

  /// Supprime l'historique de conversation d'un utilisateur pour un cours
  public func clearHistory(
    messages : List.List<TutorTypes.TutorMessage>,
    userId : Common.UserId,
    courseId : Common.CourseId,
  ) {
    let toKeep = messages.filter(func(m) {
      not (Principal.equal(m.userId, userId) and m.courseId == courseId)
    });
    messages.clear();
    messages.append(toKeep);
  };
};
