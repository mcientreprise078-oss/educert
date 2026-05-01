import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserTypes "types/users";
import CourseTypes "types/courses";
import LessonTypes "types/lessons";
import ProgressTypes "types/progress";
import CertTypes "types/certificates";
import GenTypes "types/generation";
import ResourceTypes "types/resources";
import Common "types/common";
import UsersMixin "mixins/users-api";
import CoursesMixin "mixins/courses-api";
import LessonsMixin "mixins/lessons-api";
import ProgressMixin "mixins/progress-api";
import CertsMixin "mixins/certificates-api";
import ResourcesMixin "mixins/resources-api";
import GenerationMixin "mixins/generation-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Object Storage ---
  include MixinObjectStorage();

  // --- User profiles ---
  let userProfiles = Map.empty<Common.UserId, UserTypes.UserProfile>();
  include UsersMixin(accessControlState, userProfiles);

  // --- Courses ---
  let courses = Map.empty<Common.CourseId, CourseTypes.Course>();
  let nextCourseId = { var value : Common.CourseId = 0 };
  include CoursesMixin(accessControlState, userProfiles, courses, nextCourseId);

  // --- Lessons & Quizzes ---
  let lessons = Map.empty<Common.LessonId, LessonTypes.Lesson>();
  let quizzes = Map.empty<Common.QuizId, LessonTypes.Quiz>();
  let nextLessonId = { var value : Common.LessonId = 0 };
  let nextQuizId = { var value : Common.QuizId = 0 };
  include LessonsMixin(accessControlState, courses, lessons, quizzes, nextLessonId, nextQuizId);

  // --- Enrollments & Progress ---
  let enrollments = Map.empty<(Common.UserId, Common.CourseId), ProgressTypes.Enrollment>();

  // --- Certificates ---
  let certificates = Map.empty<Common.CertificateId, CertTypes.Certificate>();

  include ProgressMixin(accessControlState, courses, lessons, quizzes, enrollments, userProfiles, certificates);
  include CertsMixin(accessControlState, userProfiles, certificates);

  // --- Resources (admin uploads) — sans limite de nombre ---
  let resources = Map.empty<Nat, ResourceTypes.Resource>();
  let nextResourceId = { var value : Nat = 0 };
  let externalCourses = Map.empty<Text, ResourceTypes.ExternalCourse>();
  let nextExternalCourseId = { var value : Nat = 0 };
  include ResourcesMixin(accessControlState, resources, nextResourceId, externalCourses, nextExternalCourseId);

  // --- AI Course Generation ---
  let generations = Map.empty<Nat, GenTypes.CourseGeneration>();
  let nextGenerationId = { var value : Nat = 0 };
  let adminModelConfig = { var value : GenTypes.AIModelConfig = {
    structureModel = "deepseek/deepseek-r1";
    contentModel = "qwen/qwen-2.5-72b-instruct";
    validationModel = "openai/gpt-4o";
  }};
  include GenerationMixin(accessControlState, generations, nextGenerationId, resources, courses, nextCourseId, adminModelConfig);
};
