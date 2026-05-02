import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import DomainsLib "../lib/domains";
import DomainTypes "../types/domains";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  domains : Map.Map<Nat, DomainTypes.Domain>,
  nextDomainId : { var value : Nat },
) {
  /// Liste tous les domaines de la plateforme (tout utilisateur connecté)
  public query ({ caller }) func listDomains() : async [DomainTypes.Domain] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    DomainsLib.list(domains);
  };

  /// Crée un nouveau domaine (admin uniquement)
  public shared ({ caller }) func createDomain(
    name : Text,
    tier : DomainTypes.DomainTier,
    description : Text,
    requiresManualApproval : Bool,
  ) : async { #ok : DomainTypes.Domain; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    if (name.size() == 0) {
      return #err("Le nom du domaine est requis");
    };
    let domain = DomainsLib.create(domains, nextDomainId, name, tier, description, requiresManualApproval, caller);
    #ok(domain);
  };

  /// Met à jour le tier et l'approbation manuelle d'un domaine (admin uniquement)
  public shared ({ caller }) func updateDomain(
    id : Nat,
    tier : DomainTypes.DomainTier,
    requiresManualApproval : Bool,
  ) : async { #ok : DomainTypes.Domain; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    DomainsLib.update(domains, id, tier, requiresManualApproval);
  };

  /// Supprime un domaine (admin uniquement)
  public shared ({ caller }) func deleteDomain(
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    DomainsLib.delete(domains, id);
  };
};
