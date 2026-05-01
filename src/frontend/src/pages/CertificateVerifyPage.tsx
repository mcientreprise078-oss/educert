import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVerifyCertificateQR } from "@/lib/queries";
import { useParams } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
  QrCode,
  Shield,
  XCircle,
} from "lucide-react";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MinistryHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          🇨🇩
        </span>
        <div>
          <p className="text-xs font-bold text-primary tracking-widest uppercase leading-none">
            République Démocratique du Congo
          </p>
          <p className="text-[11px] text-muted-foreground tracking-wider uppercase leading-none mt-0.5">
            Ministère de la Formation Professionnelle — EDUCERT
          </p>
        </div>
        <div className="ml-auto">
          <Shield className="size-6 text-primary/50" />
        </div>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <div
      className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4"
      data-ocid="certificate_verify.loading_state"
    >
      <Loader2 className="size-10 text-primary animate-spin" />
      <div>
        <p className="font-semibold text-foreground">
          Vérification en cours...
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Interrogation du registre officiel EDUCERT
        </p>
      </div>
      <div className="w-full space-y-2 mt-2">
        <Skeleton className="h-3 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    </div>
  );
}

function InvalidResult({
  qrCode,
  errorMessage,
}: { qrCode: string; errorMessage?: string }) {
  return (
    <div
      className="bg-card border-2 border-destructive/30 rounded-2xl overflow-hidden"
      data-ocid="certificate_verify.invalid_result"
    >
      <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5 flex items-center gap-4">
        <div className="rounded-full bg-destructive/15 p-3 shrink-0">
          <XCircle className="size-8 text-destructive" />
        </div>
        <div>
          <p className="text-xs font-bold text-destructive tracking-widest uppercase">
            CERTIFICAT NON TROUVÉ
          </p>
          <p className="text-lg font-display font-bold text-foreground mt-0.5">
            Vérification échouée
          </p>
        </div>
      </div>
      <div className="px-6 py-6 space-y-4">
        <p className="text-foreground font-medium">
          {errorMessage ??
            "Ce certificat ne peut pas être vérifié ou n'existe pas."}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ce code QR ne correspond à aucun certificat enregistré dans le système
          officiel EDUCERT du Ministère de la Formation Professionnelle de la
          République Démocratique du Congo.
        </p>
        <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
          <QrCode className="size-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground font-mono break-all">
            {qrCode}
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground">En cas de doute :</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Vérifiez que le code QR est intact et lisible</li>
            <li>Contactez l'établissement qui a délivré ce certificat</li>
            <li>
              Signalez toute fraude au Ministère de la Formation Professionnelle
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface ValidCert {
  id: string;
  courseTitle: string;
  learnerName: string;
  issuedAt: number;
  instructor?: string;
  isMinistryApproved: boolean;
  ministryReviewerName?: string;
  approvedAt?: number;
  resourceCitations: string[];
}

function ValidResult({ certificate }: { certificate: ValidCert }) {
  return (
    <div
      className="bg-card border-2 border-primary/30 rounded-2xl overflow-hidden watermark-pattern"
      data-ocid="certificate_verify.valid_result"
    >
      <div className="gradient-ministry px-6 py-5 flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-3 shrink-0">
          <CheckCircle2 className="size-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-bold tracking-widest uppercase leading-none">
            CERTIFICAT VALIDE
          </p>
          <p className="text-white text-lg font-display font-bold mt-0.5 leading-tight">
            Authentifié par EDUCERT
          </p>
        </div>
        <Badge className="bg-white/20 text-white border-0 text-xs font-bold tracking-wide shrink-0">
          ✓ OFFICIEL
        </Badge>
      </div>

      <div className="bg-muted/40 border-b border-border px-6 py-3 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">
          🇨🇩
        </span>
        <div>
          <p className="text-xs font-bold text-foreground leading-none">
            République Démocratique du Congo
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mt-0.5">
            Ministère de la Formation Professionnelle
          </p>
        </div>
        <Award className="size-5 text-accent ml-auto" />
      </div>

      <div className="px-6 py-6 space-y-5">
        <div className="text-center py-4 border border-dashed border-border rounded-xl bg-background/60">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Apprenant vérifié
          </p>
          <p className="font-display font-bold text-2xl text-foreground">
            {certificate.learnerName}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            a complété avec succès
          </p>
          <p className="font-semibold text-foreground text-base mt-2 px-4 leading-tight">
            {certificate.courseTitle}
          </p>
          {certificate.instructor && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Formateur : {certificate.instructor}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wide mb-1">
              <Calendar className="size-3" />
              Date d'émission
            </div>
            <p className="font-semibold text-foreground text-sm">
              {formatDate(certificate.issuedAt)}
            </p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wide mb-1">
              <QrCode className="size-3" />
              Identifiant
            </div>
            <p className="font-mono text-xs text-foreground break-all leading-tight">
              {certificate.id}
            </p>
          </div>
        </div>

        {certificate.isMinistryApproved && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-800/40">
            <Shield className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                Approuvé par le Ministère
              </p>
              {certificate.ministryReviewerName && (
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">
                  Réviseur : {certificate.ministryReviewerName}
                </p>
              )}
              {certificate.approvedAt && (
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 mt-0.5">
                  Date d'approbation : {formatDate(certificate.approvedAt)}
                </p>
              )}
            </div>
          </div>
        )}

        {certificate.resourceCitations.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BookOpen className="size-3" />
              Ressources académiques citées
            </p>
            <ul className="space-y-1.5 pl-1">
              {certificate.resourceCitations.map((citation) => (
                <li
                  key={citation}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-accent font-bold mt-0.5 shrink-0">
                    •
                  </span>
                  <span>{citation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Ce certificat a été émis par la plateforme EDUCERT et validé par le{" "}
            <span className="font-semibold text-foreground">
              Ministère de la Formation Professionnelle de la RDC
            </span>
            . Il atteste la complétion réussie de la formation indiquée et est
            opposable à tout tiers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CertificateVerifyPage() {
  const { qrCode } = useParams({ from: "/verify/$qrCode" });
  const { data, isLoading, isError } = useVerifyCertificateQR(qrCode ?? "");

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="certificate_verify.page"
    >
      <MinistryHeader />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-ministry mb-2 shadow-elevated">
              <Shield className="size-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Vérification de certificat
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Système officiel de vérification EDUCERT — Ministère de la
              Formation Professionnelle, République Démocratique du Congo
            </p>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <div
              className="bg-card border border-destructive/30 rounded-2xl p-8 flex flex-col items-center text-center gap-3"
              data-ocid="certificate_verify.error_state"
            >
              <XCircle className="size-10 text-destructive" />
              <p className="font-semibold text-foreground">
                Erreur de vérification
              </p>
              <p className="text-sm text-muted-foreground">
                Impossible de vérifier ce certificat. Veuillez réessayer.
              </p>
            </div>
          ) : data?.isValid && data.certificate ? (
            <ValidResult certificate={data.certificate} />
          ) : (
            <InvalidResult
              qrCode={qrCode ?? ""}
              errorMessage={data?.errorMessage}
            />
          )}

          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" className="text-muted-foreground gap-1.5">
                <ExternalLink className="size-3.5" />
                Accueil EDUCERT
              </a>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EDUCERT — Ministère de la Formation
          Professionnelle, RDC.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
