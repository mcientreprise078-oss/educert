import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import DomainTypes "../types/domains";
import Common "../types/common";

module {
  /// Crée un nouveau domaine et l'ajoute à la map
  public func create(
    domains : Map.Map<Nat, DomainTypes.Domain>,
    nextId : { var value : Nat },
    name : Text,
    tier : DomainTypes.DomainTier,
    description : Text,
    requiresManualApproval : Bool,
    createdBy : Common.UserId,
  ) : DomainTypes.Domain {
    let id = nextId.value;
    nextId.value += 1;
    let domain : DomainTypes.Domain = {
      id;
      name;
      tier;
      description;
      requiresManualApproval;
      createdAt = Time.now();
      createdBy;
    };
    domains.add(id, domain);
    domain;
  };

  public func getById(
    domains : Map.Map<Nat, DomainTypes.Domain>,
    id : Nat,
  ) : ?DomainTypes.Domain {
    domains.get(id);
  };

  public func list(domains : Map.Map<Nat, DomainTypes.Domain>) : [DomainTypes.Domain] {
    domains.values().toArray();
  };

  /// Met à jour le tier et requiresManualApproval d'un domaine existant
  public func update(
    domains : Map.Map<Nat, DomainTypes.Domain>,
    id : Nat,
    tier : DomainTypes.DomainTier,
    requiresManualApproval : Bool,
  ) : { #ok : DomainTypes.Domain; #err : Text } {
    switch (domains.get(id)) {
      case (?existing) {
        let updated : DomainTypes.Domain = { existing with tier; requiresManualApproval };
        domains.add(id, updated);
        #ok(updated);
      };
      case null { #err("Domaine introuvable") };
    };
  };

  /// Supprime un domaine par son identifiant
  public func delete(
    domains : Map.Map<Nat, DomainTypes.Domain>,
    id : Nat,
  ) : { #ok : (); #err : Text } {
    switch (domains.get(id)) {
      case (?_) {
        domains.remove(id);
        #ok(());
      };
      case null { #err("Domaine introuvable") };
    };
  };

  /// Vérifie si une catégorie de cours correspond à un domaine VIP
  public func isVIP(
    domains : Map.Map<Nat, DomainTypes.Domain>,
    domainName : Text,
  ) : Bool {
    let lower = domainName.toLower();
    switch (
      domains.values().find(func(d) {
        d.name.toLower() == lower and d.tier == #vip
      })
    ) {
      case (?_) { true };
      case null { false };
    };
  };
};
