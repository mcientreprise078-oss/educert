import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type LessonType = { #text; #video };

  public type QuizQuestion = {
    id : Nat;
    question : Text;
    options : [Text];
    correctOptionIndex : Nat;
  };

  public type Quiz = {
    id : Common.QuizId;
    lessonId : Common.LessonId;
    courseId : Common.CourseId;
    var questions : [QuizQuestion];
    var passingScore : Nat; // percentage 0-100
  };

  public type QuizPublic = {
    id : Common.QuizId;
    lessonId : Common.LessonId;
    courseId : Common.CourseId;
    questions : [QuizQuestion];
    passingScore : Nat;
  };

  public type Lesson = {
    id : Common.LessonId;
    courseId : Common.CourseId;
    var title : Text;
    var lessonType : LessonType;
    var content : Text; // text content or description
    var videoBlob : ?Storage.ExternalBlob;
    var order : Nat;
    createdAt : Common.Timestamp;
  };

  public type LessonPublic = {
    id : Common.LessonId;
    courseId : Common.CourseId;
    title : Text;
    lessonType : LessonType;
    content : Text;
    videoBlob : ?Storage.ExternalBlob;
    order : Nat;
    createdAt : Common.Timestamp;
    hasQuiz : Bool;
  };

  public type LessonInput = {
    title : Text;
    lessonType : LessonType;
    content : Text;
    videoBlob : ?Storage.ExternalBlob;
  };
};
