import Common "common";

module {
  /// Niveau du domaine : standard ou VIP (certificat premium géré manuellement)
  public type DomainTier = { #standard; #vip };

  /// Domaine de formation catégorisé par l'admin
  public type Domain = {
    id : Nat;
    name : Text;
    tier : DomainTier;
    description : Text;
    requiresManualApproval : Bool;
    createdAt : Common.Timestamp;
    createdBy : Common.UserId;
  };
};
