import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/courses";
import Common "../types/common";

module {
  public func newCourse(
    id : Common.CourseId,
    instructorId : Common.UserId,
    input : Types.CourseInput,
  ) : Types.Course {
    let now = Time.now();
    {
      id;
      instructorId;
      var title = input.title;
      var description = input.description;
      var category = input.category;
      var difficulty = input.difficulty;
      var learningOutcomes = input.learningOutcomes;
      var thumbnail = input.thumbnail;
      var isPublished = false;
      createdAt = now;
      var updatedAt = now;
    };
  };

  public func toPublic(self : Types.Course) : Types.CoursePublic {
    {
      id = self.id;
      instructorId = self.instructorId;
      title = self.title;
      description = self.description;
      category = self.category;
      difficulty = self.difficulty;
      learningOutcomes = self.learningOutcomes;
      thumbnail = self.thumbnail;
      isPublished = self.isPublished;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  public func getCourse(
    courses : Map.Map<Common.CourseId, Types.Course>,
    courseId : Common.CourseId,
  ) : ?Types.Course {
    courses.get(courseId);
  };

  public func listPublished(
    courses : Map.Map<Common.CourseId, Types.Course>,
  ) : [Types.CoursePublic] {
    courses.values().filter(func(c) { c.isPublished }).map<Types.Course, Types.CoursePublic>(func(c) { toPublic(c) }).toArray(
      
    );
  };

  public func searchCourses(
    courses : Map.Map<Common.CourseId, Types.Course>,
    searchTerm : Text,
    category : ?Text,
  ) : [Types.CoursePublic] {
    let lower = searchTerm.toLower();
    courses.values()
      .filter(func(c) {
        if (not c.isPublished) { return false };
        let matchesSearch = lower.size() == 0
          or c.title.toLower().contains(#text lower)
          or c.category.toLower().contains(#text lower);
        let matchesCategory = switch (category) {
          case (?cat) { c.category.toLower() == cat.toLower() };
          case null { true };
        };
        matchesSearch and matchesCategory;
      })
      .map<Types.Course, Types.CoursePublic>(func(c) { toPublic(c) })
      .toArray();
  };

  public func listByInstructor(
    courses : Map.Map<Common.CourseId, Types.Course>,
    instructorId : Common.UserId,
  ) : [Types.CoursePublic] {
    courses.values()
      .filter(func(c) { c.instructorId == instructorId })
      .map<Types.Course, Types.CoursePublic>(func(c) { toPublic(c) })
      .toArray();
  };
};
