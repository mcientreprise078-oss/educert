import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import ProgressTypes "../types/progress";
import LessonTypes "../types/lessons";
import Common "../types/common";

module {
  // Custom compare for tuple key (UserId, CourseId)
  public func enrollmentKeyCompare(
    a : (Common.UserId, Common.CourseId),
    b : (Common.UserId, Common.CourseId),
  ) : Order.Order {
    let pc = Principal.compare(a.0, b.0);
    if (not pc.isEqual()) { return pc };
    Nat.compare(a.1, b.1);
  };

  public func newEnrollment(
    learnerId : Common.UserId,
    courseId : Common.CourseId,
  ) : ProgressTypes.Enrollment {
    {
      learnerId;
      courseId;
      enrolledAt = Time.now();
      var lastLessonId = null;
      var lessonProgress = [];
      var completedAt = null;
    };
  };

  public func toPublicEnrollment(
    self : ProgressTypes.Enrollment,
    totalLessons : Nat,
  ) : ProgressTypes.EnrollmentPublic {
    let completedCount = self.lessonProgress.filter(
      func(lp) { lp.completed },
    ).size();
    let percent = if (totalLessons == 0) { 0 } else {
      completedCount * 100 / totalLessons;
    };
    let publicProgress = self.lessonProgress.map(
      func(lp) {
        {
          lessonId = lp.lessonId;
          completed = lp.completed;
          lastViewedAt = lp.lastViewedAt;
          quizAttempts = lp.quizAttempts;
        };
      },
    );
    {
      learnerId = self.learnerId;
      courseId = self.courseId;
      enrolledAt = self.enrolledAt;
      lastLessonId = self.lastLessonId;
      lessonProgress = publicProgress;
      completedAt = self.completedAt;
      completionPercent = percent;
    };
  };

  public func markLessonComplete(
    enrollment : ProgressTypes.Enrollment,
    lessonId : Common.LessonId,
  ) : () {
    let existing = enrollment.lessonProgress.find(
      func(lp) { lp.lessonId == lessonId },
    );
    switch (existing) {
      case (?lp) {
        lp.completed := true;
        lp.lastViewedAt := Time.now();
      };
      case null {
        let newLp : ProgressTypes.LessonProgress = {
          lessonId;
          var completed = true;
          var lastViewedAt = Time.now();
          var quizAttempts = [];
        };
        enrollment.lessonProgress := enrollment.lessonProgress.concat([newLp]);
      };
    };
  };

  public func saveLastViewedLesson(
    enrollment : ProgressTypes.Enrollment,
    lessonId : Common.LessonId,
  ) : () {
    enrollment.lastLessonId := ?lessonId;
    let existing = enrollment.lessonProgress.find(
      func(lp) { lp.lessonId == lessonId },
    );
    switch (existing) {
      case (?lp) {
        lp.lastViewedAt := Time.now();
      };
      case null {
        let newLp : ProgressTypes.LessonProgress = {
          lessonId;
          var completed = false;
          var lastViewedAt = Time.now();
          var quizAttempts = [];
        };
        enrollment.lessonProgress := enrollment.lessonProgress.concat([newLp]);
      };
    };
  };

  public func recordQuizAttempt(
    enrollment : ProgressTypes.Enrollment,
    lessonId : Common.LessonId,
    answers : [Nat],
    quiz : LessonTypes.Quiz,
  ) : ProgressTypes.QuizResult {
    let questions = quiz.questions;
    let total = questions.size();
    var correct = 0;
    var i = 0;
    while (i < total and i < answers.size()) {
      if (questions[i].correctOptionIndex == answers[i]) {
        correct += 1;
      };
      i += 1;
    };
    let score = if (total == 0) { 0 } else { correct * 100 / total };
    let passed = score >= quiz.passingScore;
    let attempt : ProgressTypes.QuizAttempt = {
      attemptedAt = Time.now();
      answers;
      score;
      passed;
    };
    // Record attempt in lesson progress
    let existing = enrollment.lessonProgress.find(
      func(lp) { lp.lessonId == lessonId },
    );
    switch (existing) {
      case (?lp) {
        lp.quizAttempts := lp.quizAttempts.concat([attempt]);
      };
      case null {
        let newLp : ProgressTypes.LessonProgress = {
          lessonId;
          var completed = false;
          var lastViewedAt = Time.now();
          var quizAttempts = [attempt];
        };
        enrollment.lessonProgress := enrollment.lessonProgress.concat([newLp]);
      };
    };
    {
      score;
      passed;
      correctAnswers = correct;
      totalQuestions = total;
    };
  };

  public func isCourseCompleted(
    enrollment : ProgressTypes.Enrollment,
    totalLessons : Nat,
    finalQuizPassed : Bool,
  ) : Bool {
    let completedCount = enrollment.lessonProgress.filter(
      func(lp) { lp.completed },
    ).size();
    completedCount >= totalLessons and finalQuizPassed;
  };

  public func getEnrollment(
    enrollments : Map.Map<(Common.UserId, Common.CourseId), ProgressTypes.Enrollment>,
    learnerId : Common.UserId,
    courseId : Common.CourseId,
  ) : ?ProgressTypes.Enrollment {
    enrollments.get(enrollmentKeyCompare, (learnerId, courseId));
  };
};
