import Common "common";

module {
  public type Certificate = {
    id : Common.CertificateId;
    learnerId : Common.UserId;
    courseId : Common.CourseId;
    learnerName : Text;
    courseTitle : Text;
    instructorName : Text;
    issuedAt : Common.Timestamp;
    // Champs EDUCERT — ministère et vérification
    ministryReviewerName : ?Text;
    resourceCitations : [Text];
    qrCodePayload : Text;
    isMinistryApproved : Bool;
    approvedAt : ?Common.Timestamp;
  };
};
