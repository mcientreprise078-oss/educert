import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import CourseLib "../lib/courses";
import CourseTypes "../types/courses";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  courses : Map.Map<Common.CourseId, CourseTypes.Course>,
  nextCourseId : { var value : Common.CourseId },
) {
  /// Create a new course (instructor only)
  public shared ({ caller }) func createCourse(input : CourseTypes.CourseInput) : async Common.CourseId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#instructor) {};
          case (#learner) { Runtime.trap("Unauthorized: Only instructors can create courses") };
          case (#admin or #ministryReviewer) {};
        };
      };
      case null { Runtime.trap("Unauthorized: Profile not found") };
    };
    let id = nextCourseId.value;
    nextCourseId.value += 1;
    let course = CourseLib.newCourse(id, caller, input);
    courses.add(id, course);
    id;
  };

  /// Update an existing course (owning instructor only)
  public shared ({ caller }) func updateCourse(
    courseId : Common.CourseId,
    input : CourseTypes.CourseInput,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can update it");
        };
        course.title := input.title;
        course.description := input.description;
        course.category := input.category;
        course.difficulty := input.difficulty;
        course.learningOutcomes := input.learningOutcomes;
        course.thumbnail := input.thumbnail;
        course.updatedAt := Time.now();
      };
      case null { Runtime.trap("Course not found") };
    };
  };

  /// Delete a course (owning instructor only)
  public shared ({ caller }) func deleteCourse(courseId : Common.CourseId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can delete it");
        };
        courses.remove(courseId);
      };
      case null { Runtime.trap("Course not found") };
    };
  };

  /// Publish or unpublish a course (owning instructor only)
  public shared ({ caller }) func setCoursePublished(
    courseId : Common.CourseId,
    published : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    switch (courses.get(courseId)) {
      case (?course) {
        if (course.instructorId != caller) {
          Runtime.trap("Unauthorized: Only the course owner can publish/unpublish it");
        };
        course.isPublished := published;
        course.updatedAt := Time.now();
      };
      case null { Runtime.trap("Course not found") };
    };
  };

  /// List all published courses (optionally filtered by category)
  public query func listCourses(category : ?Text) : async [CourseTypes.CoursePublic] {
    switch (category) {
      case (?cat) { CourseLib.searchCourses(courses, "", ?cat) };
      case null { CourseLib.listPublished(courses) };
    };
  };

  /// Search published courses by title or category
  public query func searchCourses(searchTerm : Text, category : ?Text) : async [CourseTypes.CoursePublic] {
    CourseLib.searchCourses(courses, searchTerm, category);
  };

  /// Get a single course by ID
  public query func getCourse(courseId : Common.CourseId) : async ?CourseTypes.CoursePublic {
    switch (CourseLib.getCourse(courses, courseId)) {
      case (?c) { ?c.toPublic() };
      case null { null };
    };
  };

  /// Get the instructor's own courses
  public query ({ caller }) func getInstructorCourses() : async [CourseTypes.CoursePublic] {
    CourseLib.listByInstructor(courses, caller);
  };
};
