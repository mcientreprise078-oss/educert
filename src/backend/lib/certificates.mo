import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import CertTypes "../types/certificates";
import Common "../types/common";

module {
  /// Génère un certificat EDUCERT avec payload QR et citations de ressources
  public func generate(
    learnerId : Common.UserId,
    courseId : Common.CourseId,
    learnerName : Text,
    courseTitle : Text,
    instructorName : Text,
    portfolioPhotoUrl : ?Text,
  ) : CertTypes.Certificate {
    let now = Time.now();
    // Identifiant unique : timestamp + principal + courseId
    let id = now.toText() # "-" # learnerId.toText() # "-" # courseId.toText();
    // Payload QR : encodage JSON compact vérifiable via verifyCertificateQR
    let qrPayload = "EDUCERT-" # id;
    {
      id;
      learnerId;
      courseId;
      learnerName;
      courseTitle;
      instructorName;
      issuedAt = now;
      ministryReviewerName = null;
      resourceCitations = [];
      qrCodePayload = qrPayload;
      isMinistryApproved = false;
      approvedAt = null;
      portfolioPhotoUrl;
    };
  };

  /// Génère un certificat enrichi avec citations de ressources (depuis une génération IA)
  public func generateWithCitations(
    learnerId : Common.UserId,
    courseId : Common.CourseId,
    learnerName : Text,
    courseTitle : Text,
    instructorName : Text,
    resourceCitations : [Text],
    portfolioPhotoUrl : ?Text,
  ) : CertTypes.Certificate {
    let base = generate(learnerId, courseId, learnerName, courseTitle, instructorName, portfolioPhotoUrl);
    { base with resourceCitations };
  };

  /// Approuve un certificat par le ministère (marque isMinistryApproved = true)
  public func approveByMinistry(
    certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
    certId : Common.CertificateId,
    reviewerName : Text,
    approvedAt : Common.Timestamp,
  ) : Bool {
    // Certificats sont immuables — on les remplace dans la map
    switch (certificates.get(certId)) {
      case (?cert) {
        let updated : CertTypes.Certificate = {
          cert with
          isMinistryApproved = true;
          ministryReviewerName = ?reviewerName;
          approvedAt = ?approvedAt;
        };
        certificates.add(certId, updated);
        true;
      };
      case null { false };
    };
  };

  /// Approuve tous les certificats liés à un cours (lors de l'approbation d'une génération)
  public func approveAllForCourse(
    certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
    courseId : Common.CourseId,
    reviewerName : Text,
    approvedAt : Common.Timestamp,
  ) {
    let toUpdate = certificates.entries()
      .filter(func((_, c)) { c.courseId == courseId and not c.isMinistryApproved })
      .toArray();
    for ((certId, cert) in toUpdate.values()) {
      let updated : CertTypes.Certificate = {
        cert with
        isMinistryApproved = true;
        ministryReviewerName = ?reviewerName;
        approvedAt = ?approvedAt;
      };
      certificates.add(certId, updated);
    };
  };

  public func listByLearner(
    certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
    learnerId : Common.UserId,
  ) : [CertTypes.Certificate] {
    certificates.values().filter(func(c) { c.learnerId == learnerId }).toArray();
  };

  public func hasCertificate(
    certificates : Map.Map<Common.CertificateId, CertTypes.Certificate>,
    learnerId : Common.UserId,
    courseId : Common.CourseId,
  ) : Bool {
    switch (certificates.values().find(func(c) { c.learnerId == learnerId and c.courseId == courseId })) {
      case (?_) { true };
      case null { false };
    };
  };
};
