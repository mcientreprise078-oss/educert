import Common "common";

module {
  public type QuizAttempt = {
    attemptedAt : Common.Timestamp;
    answers : [Nat]; // index of selected options
    score : Nat; // percentage
    passed : Bool;
  };

  public type LessonProgress = {
    lessonId : Common.LessonId;
    var completed : Bool;
    var lastViewedAt : Common.Timestamp;
    var quizAttempts : [QuizAttempt];
  };

  public type Enrollment = {
    learnerId : Common.UserId;
    courseId : Common.CourseId;
    enrolledAt : Common.Timestamp;
    var lastLessonId : ?Common.LessonId;
    var lessonProgress : [LessonProgress];
    var completedAt : ?Common.Timestamp;
  };

  // Shared API boundary types
  public type LessonProgressPublic = {
    lessonId : Common.LessonId;
    completed : Bool;
    lastViewedAt : Common.Timestamp;
    quizAttempts : [QuizAttempt];
  };

  public type EnrollmentPublic = {
    learnerId : Common.UserId;
    courseId : Common.CourseId;
    enrolledAt : Common.Timestamp;
    lastLessonId : ?Common.LessonId;
    lessonProgress : [LessonProgressPublic];
    completedAt : ?Common.Timestamp;
    completionPercent : Nat;
  };

  public type QuizSubmission = {
    quizId : Common.QuizId;
    answers : [Nat];
  };

  public type QuizResult = {
    score : Nat;
    passed : Bool;
    correctAnswers : Nat;
    totalQuestions : Nat;
  };
};
