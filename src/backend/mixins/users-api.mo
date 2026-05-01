import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import UsersLib "../lib/users";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
) {
  /// Returns caller's own profile (null if first login)
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required");
    };
    UsersLib.getProfile(userProfiles, caller);
  };

  /// Saves or updates the caller's own profile (sets role on first call)
  public shared ({ caller }) func saveCallerUserProfile(
    name : Text,
    bio : Text,
    role : UserTypes.UserRole,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Login required");
    };
    UsersLib.saveProfile(userProfiles, caller, name, bio, role);
  };

  /// Fetch any user's profile by principal
  public query func getUserProfile(userId : Common.UserId) : async ?UserTypes.UserProfilePublic {
    UsersLib.getProfile(userProfiles, userId);
  };
};
