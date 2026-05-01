import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import LessonLib "../lib/lessons";
import LessonTypes "../types/lessons";
import CourseTypes "../types/courses";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  courses : Map.Map<Common.CourseId, CourseTypes.Course>,
  lessons : Map.Map<Common.LessonId, LessonTypes.Lesson>,
  quizzes : Map.Map<Common.QuizId, LessonTypes.Quiz>,
  nextLessonId : { var value : Common.LessonId },
  nextQuizId : { var value : Common.QuizId },
) {
  /// Add a lesson to a course (owning instructor only)
  public shared ({ caller }) func addLesson(
    courseId : Common.CourseId,
    input : LessonTypes.LessonInput,
  ) : async Common.LessonId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can add lessons");
        };
      };
      case null { Runtime.trap("Course not found") };
    };
    let courseLessons = LessonLib.getLessonsForCourse(lessons, courseId);
    let order = courseLessons.size();
    let id = nextLessonId.value;
    nextLessonId.value += 1;
    let lesson = LessonLib.newLesson(id, courseId, input, order);
    lessons.add(id, lesson);
    id;
  };

  /// Update a lesson (owning instructor only)
  public shared ({ caller }) func updateLesson(
    lessonId : Common.LessonId,
    input : LessonTypes.LessonInput,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (lessons.get(lessonId)) {
      case (?lesson) {
        switch (courses.get(lesson.courseId)) {
          case (?course) {
            if (course.instructorId != caller) {
              Runtime.trap("Unauthorized: Only the course owner can update lessons");
            };
          };
          case null { Runtime.trap("Course not found") };
        };
        lesson.title := input.title;
        lesson.lessonType := input.lessonType;
        lesson.content := input.content;
        lesson.videoBlob := input.videoBlob;
      };
      case null { Runtime.trap("Lesson not found") };
    };
  };

  /// Delete a lesson and its quiz (owning instructor only)
  public shared ({ caller }) func deleteLesson(lessonId : Common.LessonId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (lessons.get(lessonId)) {
      case (?lesson) {
        switch (courses.get(lesson.courseId)) {
          case (?course) {
            if (course.instructorId != caller) {
              Runtime.trap("Unauthorized: Only the course owner can delete lessons");
            };
          };
          case null { Runtime.trap("Course not found") };
        };
        lessons.remove(lessonId);
        // Remove associated quiz if any
        switch (LessonLib.getQuizForLesson(quizzes, lessonId)) {
          case (?q) { quizzes.remove(q.id) };
          case null {};
        };
      };
      case null { Runtime.trap("Lesson not found") };
    };
  };

  /// Reorder a lesson within a course (owning instructor only)
  public shared ({ caller }) func reorderLesson(
    lessonId : Common.LessonId,
    newOrder : Nat,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (lessons.get(lessonId)) {
      case (?lesson) {
        switch (courses.get(lesson.courseId)) {
          case (?course) {
            if (course.instructorId != caller) {
              Runtime.trap("Unauthorized: Only the course owner can reorder lessons");
            };
          };
          case null { Runtime.trap("Course not found") };
        };
        lesson.order := newOrder;
      };
      case null { Runtime.trap("Lesson not found") };
    };
  };

  /// Get all lessons for a course (ordered)
  public query func getLessons(courseId : Common.CourseId) : async [LessonTypes.LessonPublic] {
    let courseLessons = LessonLib.getLessonsForCourse(lessons, courseId);
    courseLessons.map<LessonTypes.Lesson, LessonTypes.LessonPublic>(
      func(l) {
        let hasQuiz = switch (LessonLib.getQuizForLesson(quizzes, l.id)) {
          case (?_) { true };
          case null { false };
        };
        l.toPublic(hasQuiz);
      },
    );
  };

  /// Add or replace a quiz on a lesson (owning instructor only)
  public shared ({ caller }) func setQuiz(
    lessonId : Common.LessonId,
    questions : [LessonTypes.QuizQuestion],
    passingScore : Nat,
  ) : async Common.QuizId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let lesson = switch (lessons.get(lessonId)) {
      case (?l) { l };
      case null { Runtime.trap("Lesson not found") };
    };
    switch (courses.get(lesson.courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can set quizzes");
        };
      };
      case null { Runtime.trap("Course not found") };
    };
    // Remove existing quiz for this lesson if any
    switch (LessonLib.getQuizForLesson(quizzes, lessonId)) {
      case (?existing) { quizzes.remove(existing.id) };
      case null {};
    };
    let id = nextQuizId.value;
    nextQuizId.value += 1;
    let quiz = LessonLib.newQuiz(id, lessonId, lesson.courseId, questions, passingScore);
    quizzes.add(id, quiz);
    id;
  };

  /// Get the quiz for a lesson
  public query func getQuiz(lessonId : Common.LessonId) : async ?LessonTypes.QuizPublic {
    switch (LessonLib.getQuizForLesson(quizzes, lessonId)) {
      case (?q) { ?q.quizToPublic() };
      case null { null };
    };
  };

  /// Delete a quiz from a lesson (owning instructor only)
  public shared ({ caller }) func deleteQuiz(lessonId : Common.LessonId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let lesson = switch (lessons.get(lessonId)) {
      case (?l) { l };
      case null { Runtime.trap("Lesson not found") };
    };
    switch (courses.get(lesson.courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can delete quizzes");
        };
      };
      case null { Runtime.trap("Course not found") };
    };
    switch (LessonLib.getQuizForLesson(quizzes, lessonId)) {
      case (?q) { quizzes.remove(q.id) };
      case null {};
    };
  };
};
