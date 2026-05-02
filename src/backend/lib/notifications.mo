import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import NotifTypes "../types/notifications";
import Principal "mo:core/Principal";

module {
  /// Crée une nouvelle notification in-app
  public func create(
    notifications : Map.Map<Nat, NotifTypes.Notification>,
    nextId : { var value : Nat },
    userId : Common.UserId,
    notificationType : NotifTypes.NotificationType,
    title : Text,
    message : Text,
    courseId : ?Common.CourseId,
  ) : NotifTypes.Notification {
    let id = nextId.value;
    nextId.value += 1;
    let notif : NotifTypes.Notification = {
      id;
      userId;
      notificationType;
      var title;
      var message;
      courseId;
      var isRead = false;
      createdAt = Time.now();
    };
    notifications.add(id, notif);
    notif;
  };

  /// Marque une notification comme lue
  public func markRead(
    notifications : Map.Map<Nat, NotifTypes.Notification>,
    notifId : Nat,
    userId : Common.UserId,
  ) : { #ok; #err : Text } {
    switch (notifications.get(notifId)) {
      case null { #err("Notification introuvable") };
      case (?notif) {
        if (not Principal.equal(notif.userId, userId)) {
          return #err("Non autorisé");
        };
        notif.isRead := true;
        #ok;
      };
    };
  };

  /// Marque toutes les notifications d'un utilisateur comme lues
  public func markAllRead(
    notifications : Map.Map<Nat, NotifTypes.Notification>,
    userId : Common.UserId,
  ) : { #ok; #err : Text } {
    notifications.values()
      .filter(func(n) { Principal.equal(n.userId, userId) and not n.isRead })
      .forEach(func(n) { n.isRead := true });
    #ok;
  };

  /// Retourne les notifications d'un utilisateur
  public func getUserNotifications(
    notifications : Map.Map<Nat, NotifTypes.Notification>,
    userId : Common.UserId,
    unreadOnly : Bool,
  ) : [NotifTypes.NotificationPublic] {
    notifications.values()
      .filter(func(n) {
        Principal.equal(n.userId, userId) and (if (unreadOnly) { not n.isRead } else { true })
      })
      .map(func(n : NotifTypes.Notification) : NotifTypes.NotificationPublic { toPublic(n) })
      .toArray();
  };

  /// Supprime toutes les notifications d'un utilisateur
  public func clearAll(
    notifications : Map.Map<Nat, NotifTypes.Notification>,
    userId : Common.UserId,
  ) : { #ok; #err : Text } {
    let toRemove = notifications.values()
      .filter(func(n) { Principal.equal(n.userId, userId) })
      .map(func(n : NotifTypes.Notification) : Nat { n.id })
      .toArray();
    toRemove.forEach(func(id : Nat) { notifications.remove(id) });
    #ok;
  };

  /// Retourne les userId dont la dernière activité dépasse 86400 secondes (24h)
  /// `enrollments` est une liste de (userId, courseId, lastActivityTimestamp)
  public func checkInactiveUsers(
    enrollments : [(Common.UserId, Common.CourseId, Common.Timestamp)]
  ) : [Common.UserId] {
    let threshold : Common.Timestamp = 86_400_000_000_000; // 24h en nanosecondes
    let now = Time.now();
    enrollments
      .filter(func((_, _, lastActivity)) {
        (now - lastActivity) > threshold
      })
      .map(func((uid, _, _) : (Common.UserId, Common.CourseId, Common.Timestamp)) : Common.UserId { uid });
  };

  /// Convertit une notification interne en version partageable
  public func toPublic(n : NotifTypes.Notification) : NotifTypes.NotificationPublic {
    {
      id = n.id;
      userId = n.userId;
      notificationType = n.notificationType;
      title = n.title;
      message = n.message;
      courseId = n.courseId;
      isRead = n.isRead;
      createdAt = n.createdAt;
    };
  };
};
