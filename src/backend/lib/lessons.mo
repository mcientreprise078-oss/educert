import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/lessons";
import Common "../types/common";

module {
  public func newLesson(
    id : Common.LessonId,
    courseId : Common.CourseId,
    input : Types.LessonInput,
    order : Nat,
  ) : Types.Lesson {
    {
      id;
      courseId;
      var title = input.title;
      var lessonType = input.lessonType;
      var content = input.content;
      var videoBlob = input.videoBlob;
      var order;
      createdAt = Time.now();
    };
  };

  public func toPublic(self : Types.Lesson, hasQuiz : Bool) : Types.LessonPublic {
    {
      id = self.id;
      courseId = self.courseId;
      title = self.title;
      lessonType = self.lessonType;
      content = self.content;
      videoBlob = self.videoBlob;
      order = self.order;
      createdAt = self.createdAt;
      hasQuiz;
    };
  };

  public func getLessonsForCourse(
    lessons : Map.Map<Common.LessonId, Types.Lesson>,
    courseId : Common.CourseId,
  ) : [Types.Lesson] {
    let filtered = lessons.values().filter(func(l) { l.courseId == courseId }).toArray(
      
    );
    filtered.sort<Types.Lesson>(func(a, b) { Nat.compare(a.order, b.order) });
  };

  public func newQuiz(
    id : Common.QuizId,
    lessonId : Common.LessonId,
    courseId : Common.CourseId,
    questions : [Types.QuizQuestion],
    passingScore : Nat,
  ) : Types.Quiz {
    {
      id;
      lessonId;
      courseId;
      var questions;
      var passingScore;
    };
  };

  public func quizToPublic(self : Types.Quiz) : Types.QuizPublic {
    {
      id = self.id;
      lessonId = self.lessonId;
      courseId = self.courseId;
      questions = self.questions;
      passingScore = self.passingScore;
    };
  };

  public func getQuizForLesson(
    quizzes : Map.Map<Common.QuizId, Types.Quiz>,
    lessonId : Common.LessonId,
  ) : ?Types.Quiz {
    quizzes.values().find(func(q) { q.lessonId == lessonId });
  };
};
