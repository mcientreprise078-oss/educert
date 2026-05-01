import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Difficulty = { #beginner; #intermediate; #advanced };

  public type Course = {
    id : Common.CourseId;
    instructorId : Common.UserId;
    var title : Text;
    var description : Text;
    var category : Text;
    var difficulty : Difficulty;
    var learningOutcomes : [Text];
    var thumbnail : ?Storage.ExternalBlob;
    var isPublished : Bool;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (API boundary) — no var fields, no mutable blobs
  public type CoursePublic = {
    id : Common.CourseId;
    instructorId : Common.UserId;
    title : Text;
    description : Text;
    category : Text;
    difficulty : Difficulty;
    learningOutcomes : [Text];
    thumbnail : ?Storage.ExternalBlob;
    isPublished : Bool;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CourseInput = {
    title : Text;
    description : Text;
    category : Text;
    difficulty : Difficulty;
    learningOutcomes : [Text];
    thumbnail : ?Storage.ExternalBlob;
  };
};
