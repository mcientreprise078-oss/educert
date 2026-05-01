import Common "common";

module {
  public type UserRole = { #learner; #instructor; #admin; #ministryReviewer };

  public type UserProfile = {
    id : Common.UserId;
    var name : Text;
    var bio : Text;
    var role : UserRole;
    createdAt : Common.Timestamp;
  };

  // Shared (API boundary) — no var fields
  public type UserProfilePublic = {
    id : Common.UserId;
    name : Text;
    bio : Text;
    role : UserRole;
    createdAt : Common.Timestamp;
  };
};
