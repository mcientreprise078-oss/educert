import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/users";
import Common "../types/common";

module {
  public func newProfile(
    id : Common.UserId,
    name : Text,
    bio : Text,
    role : Types.UserRole,
  ) : Types.UserProfile {
    {
      id;
      var name;
      var bio;
      var role;
      var avatarUrl = null;
      createdAt = Time.now();
    };
  };

  public func toPublic(self : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = self.id;
      name = self.name;
      bio = self.bio;
      role = self.role;
      avatarUrl = self.avatarUrl;
      createdAt = self.createdAt;
    };
  };

  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfilePublic {
    switch (profiles.get(userId)) {
      case (?p) { ?toPublic(p) };
      case null { null };
    };
  };

  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    id : Common.UserId,
    name : Text,
    bio : Text,
    role : Types.UserRole,
    avatarUrl : ?Text,
  ) : () {
    switch (profiles.get(id)) {
      case (?existing) {
        existing.name := name;
        existing.bio := bio;
        existing.role := role;
        existing.avatarUrl := avatarUrl;
      };
      case null {
        let p = newProfile(id, name, bio, role);
        p.avatarUrl := avatarUrl;
        profiles.add(id, p);
      };
    };
  };
};
