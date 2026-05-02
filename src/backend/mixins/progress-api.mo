import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProgressLib "../lib/progress";
import LessonLib "../lib/lessons";
import CertLib "../lib/certificates";
import ProgressTypes "../types/progress";
import LessonTypes "../types/lessons";
import CourseTypes "../types/courses";
import UserTypes "../types/users";
import CertTypes "../types/certificates";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  courses : Map.Map<Common.CourseId, CourseTypes.Course>,
  lessons : Map.Map<Common.LessonId, LessonTypes.Lesson>,
  quizzes : Map.Map<Common.QuizId, LessonTypes.Quiz>,
  enrollments : Map.Map<(Common.UserId, Common.CourseId), ProgressTypes.Enrollment>,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
) {
  /// Enroll the caller in a course
  public shared ({ caller }) func enrollCourse(courseId : Common.CourseId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case null { Runtime.trap("Course not found") };
      case (?course) {
        if (not course.isPublished) { Runtime.trap("Course is not published") };
      };
    };
    // Prevent duplicate enrollment
    switch (ProgressLib.getEnrollment(enrollments, caller, courseId)) {
      case (?_) { Runtime.trap("Already enrolled in this course") };
      case null {};
    };
    let enrollment = ProgressLib.newEnrollment(caller, courseId);
    enrollments.add(ProgressLib.enrollmentKeyCompare, (caller, courseId), enrollment);
  };

  /// Unenroll the caller from a course
  public shared ({ caller }) func unenrollCourse(courseId : Common.CourseId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (ProgressLib.getEnrollment(enrollments, caller, courseId)) {
      case null { Runtime.trap("Not enrolled in this course") };
      case (?_) {};
    };
    enrollments.remove(ProgressLib.enrollmentKeyCompare, (caller, courseId));
  };

  /// Get caller's enrolled courses with progress
  public query ({ caller }) func getMyEnrollments() : async [ProgressTypes.EnrollmentPublic] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required");
    };
    let result = enrollments.values()
      .filter(func(e) { e.learnerId == caller })
      .map(func(e) {
        let totalLessons = LessonLib.getLessonsForCourse(lessons, e.courseId).size();
        e.toPublicEnrollment(totalLessons);
      });
    result.toArray();
  };

  /// Get enrolled learners and their progress for a course (instructor only)
  public query ({ caller }) func getCourseEnrollments(courseId : Common.CourseId) : async [ProgressTypes.EnrollmentPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case null { Runtime.trap("Course not found") };
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course instructor can view enrollments");
        };
      };
    };
    let totalLessons = LessonLib.getLessonsForCourse(lessons, courseId).size();
    let result = enrollments.values()
      .filter(func(e) { e.courseId == courseId })
      .map(func(e) {
        e.toPublicEnrollment(totalLessons);
      });
    result.toArray();
  };

  /// Mark a lesson as complete; auto-generates certificate if all lessons done and final quiz passed
  public shared ({ caller }) func markLessonComplete(
    courseId : Common.CourseId,
    lessonId : Common.LessonId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let enrollment = switch (ProgressLib.getEnrollment(enrollments, caller, courseId)) {
      case (?e) { e };
      case null { Runtime.trap("Not enrolled in this course") };
    };
    switch (lessons.get(lessonId)) {
      case null { Runtime.trap("Lesson not found") };
      case (?lesson) {
        if (lesson.courseId != courseId) { Runtime.trap("Lesson does not belong to this course") };
      };
    };
    ProgressLib.markLessonComplete(enrollment, lessonId);
    checkAndIssueCertificate(caller, courseId, enrollment);
  };

  /// Save last-viewed lesson
  public shared ({ caller }) func saveLastViewedLesson(
    courseId : Common.CourseId,
    lessonId : Common.LessonId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let enrollment = switch (ProgressLib.getEnrollment(enrollments, caller, courseId)) {
      case (?e) { e };
      case null { Runtime.trap("Not enrolled in this course") };
    };
    ProgressLib.saveLastViewedLesson(enrollment, lessonId);
  };

  /// Submit quiz answers and get result; triggers certificate if course completed
  public shared ({ caller }) func submitQuiz(
    courseId : Common.CourseId,
    submission : ProgressTypes.QuizSubmission,
  ) : async ProgressTypes.QuizResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    let enrollment = switch (ProgressLib.getEnrollment(enrollments, caller, courseId)) {
      case (?e) { e };
      case null { Runtime.trap("Not enrolled in this course") };
    };
    let quiz = switch (quizzes.get(submission.quizId)) {
      case (?q) { q };
      case null { Runtime.trap("Quiz not found") };
    };
    if (quiz.courseId != courseId) { Runtime.trap("Quiz does not belong to this course") };
    let result = ProgressLib.recordQuizAttempt(enrollment, quiz.lessonId, submission.answers, quiz);
    if (result.passed) {
      checkAndIssueCertificate(caller, courseId, enrollment);
    };
    result;
  };

  // Internal helper: issue certificate if all lessons completed and final quiz passed
  private func checkAndIssueCertificate(
    learnerId : Common.UserId,
    courseId : Common.CourseId,
    enrollment : ProgressTypes.Enrollment,
  ) {
    // Skip if already has certificate
    if (CertLib.hasCertificate(certificates, learnerId, courseId)) { return };
    let courseLessons = LessonLib.getLessonsForCourse(lessons, courseId);
    let totalLessons = courseLessons.size();
    if (totalLessons == 0) { return };
    // Check all lessons completed
    let completedCount = enrollment.lessonProgress.filter(
      func(lp) { lp.completed },
    ).size();
    if (completedCount < totalLessons) { return };
    // Check final quiz passed: look for any passed quiz attempt in all lessons
    let allQuizzesPassed = enrollment.lessonProgress.all(
      func(lp) {
        // If lesson has a quiz, must have a passed attempt
        switch (LessonLib.getQuizForLesson(quizzes, lp.lessonId)) {
          case (?_) {
            lp.quizAttempts.any<ProgressTypes.QuizAttempt>(func(a) { a.passed });
          };
          case null { true }; // No quiz for this lesson — OK
        };
      },
    );
    if (not allQuizzesPassed) { return };
    // Issue certificate
    let course = switch (courses.get(courseId)) {
      case (?c) { c };
      case null { return };
    };
    let learnerName = switch (userProfiles.get(learnerId)) {
      case (?p) { p.name };
      case null { learnerId.toText() };
    };
    let instructorName = switch (userProfiles.get(course.instructorId)) {
      case (?p) { p.name };
      case null { course.instructorId.toText() };
    };
    let cert = CertLib.generate(learnerId, courseId, learnerName, course.title, instructorName, null);
    certificates.add(cert.id, cert);
    enrollment.completedAt := ?cert.issuedAt;
  };
};
