import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import CertLib "../lib/certificates";
import CertTypes "../types/certificates";
import GenTypes "../types/generation";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
) {
  /// Récupère tous les certificats de l'utilisateur connecté
  public query ({ caller }) func getMyCertificates() : async [CertTypes.Certificate] {
    if (caller.isAnonymous()) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    CertLib.listByLearner(certificates, caller);
  };

  /// Récupère un certificat par son identifiant
  public query func getCertificate(certId : Common.CertificateId) : async ?CertTypes.Certificate {
    certificates.get(certId);
  };

  /// Vérifie un certificat via son payload QR (requête publique)
  public query func verifyCertificateQR(qrPayload : Text) : async ?GenTypes.CertificateVerification {
    // Cherche le certificat dont le qrCodePayload correspond
    switch (certificates.values().find(func(c) { c.qrCodePayload == qrPayload })) {
      case (?cert) {
        ?{
          courseTitle = cert.courseTitle;
          issueDate = cert.issuedAt;
          ministryApproved = cert.isMinistryApproved;
          isValid = true;
        };
      };
      case null {
        // Essaie aussi en cherchant l'ID encodé dans le payload (format "EDUCERT-<id>")
        let prefix = "EDUCERT-";
        if (qrPayload.startsWith(#text prefix)) {
          let certId = qrPayload.replace(#text prefix, "");
          switch (certificates.get(certId)) {
            case (?cert) {
              ?{
                courseTitle = cert.courseTitle;
                issueDate = cert.issuedAt;
                ministryApproved = cert.isMinistryApproved;
                isValid = true;
              };
            };
            case null { null };
          };
        } else { null };
      };
    };
  };
};
