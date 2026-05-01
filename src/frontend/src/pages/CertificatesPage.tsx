import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCertificates } from "@/lib/queries";
import type { Certificate } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  ExternalLink,
  QrCode,
  Share2,
  Shield,
  Trophy,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** SVG QR code placeholder — renders a recognizable pattern from the payload hash */
function QRCodeVisual({
  payload,
  size = 80,
}: { payload: string; size?: number }) {
  // Deterministic 7x7 "pixel" grid from payload chars
  const cells = 7;
  const cell = size / cells;
  const grid: boolean[][] = [];
  for (let r = 0; r < cells; r++) {
    grid[r] = [];
    for (let c = 0; c < cells; c++) {
      const idx = (r * cells + c) % payload.length;
      grid[r][c] = payload.charCodeAt(idx) % 2 === 0;
    }
  }
  // Force corners (finder pattern)
  const corners = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
    [1, 2],
    [2, 1],
    [2, 2],
    [0, cells - 1],
    [0, cells - 2],
    [0, cells - 3],
    [1, cells - 1],
    [2, cells - 1],
    [1, cells - 3],
    [2, cells - 2],
    [2, cells - 3],
    [cells - 1, 0],
    [cells - 2, 0],
    [cells - 3, 0],
    [cells - 1, 2],
    [cells - 2, 1],
    [cells - 3, 2],
    [cells - 3, 1],
    [cells - 1, 1],
  ];
  for (const [r, c] of corners) {
    if (r < cells && c < cells) grid[r][c] = true;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-sm"
      aria-label="QR Code de vérification"
      role="img"
    >
      <rect width={size} height={size} fill="white" />
      {grid
        .flatMap((row, r) =>
          row
            .map((filled, c) => (filled ? { r, c } : null))
            .filter((v): v is { r: number; c: number } => v !== null),
        )
        .map(({ r, c }) => (
          <rect
            key={`cell-r${r}-c${c}`}
            x={c * cell + 0.5}
            y={r * cell + 0.5}
            width={cell - 1}
            height={cell - 1}
            fill="#1a237e"
          />
        ))}
    </svg>
  );
}

function generateMinistryPDF(cert: Certificate): void {
  const certUrl = `${window.location.origin}/verify/${encodeURIComponent(cert.qrCodePayload)}`;
  const citationsHtml =
    cert.resourceCitations.length > 0
      ? `<div class="citations"><p class="label">Ressources académiques utilisées :</p><ul>${cert.resourceCitations.map((c) => `<li>${c}</li>`).join("")}</ul></div>`
      : "";
  const ministryApprovedHtml = cert.isMinistryApproved
    ? `<div class="ministry-seal">
        <p class="seal-title">✓ APPROUVÉ PAR LE MINISTÈRE</p>
        ${cert.ministryReviewerName ? `<p class="seal-reviewer">Réviseur : ${cert.ministryReviewerName}</p>` : ""}
        ${cert.approvedAt ? `<p class="seal-date">Date d'approbation : ${formatDate(cert.approvedAt)}</p>` : ""}
      </div>`
    : `<div class="ministry-pending"><p>En attente d'approbation ministérielle</p></div>`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Certificat EDUCERT — ${cert.courseTitle}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { font-family: Georgia, "Times New Roman", serif; background: #fff; color: #1a1a3e; margin: 0; padding: 0; }
  .page { width: 277mm; min-height: 190mm; padding: 14mm 18mm; box-sizing: border-box; border: 6px solid #1a237e; position: relative; }
  .page::before { content: "EDUCERT"; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 100px; color: rgba(26,35,126,0.04); font-weight: bold; pointer-events: none; white-space: nowrap; font-family: sans-serif; }
  .header { text-align: center; border-bottom: 2px solid #c8a14a; padding-bottom: 8mm; margin-bottom: 8mm; }
  .flag { font-size: 28px; margin-bottom: 3mm; }
  .ministry { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #1a237e; font-family: sans-serif; font-weight: 600; margin-bottom: 2mm; }
  .republic { font-size: 10px; color: #555; font-family: sans-serif; margin-bottom: 3mm; }
  h1 { font-size: 32px; color: #1a237e; margin: 0 0 1mm; letter-spacing: 4px; text-transform: uppercase; }
  .underline { width: 80mm; height: 2px; background: linear-gradient(to right, #1a237e, #c8a14a); margin: 3mm auto; }
  .body { text-align: center; }
  .presented-to { font-size: 13px; color: #666; font-style: italic; margin-bottom: 2mm; }
  .learner { font-size: 28px; font-weight: bold; color: #1a237e; margin: 3mm 0; border-bottom: 2px dotted #c8a14a; display: inline-block; padding-bottom: 2mm; }
  .completion { font-size: 13px; color: #444; margin-bottom: 2mm; }
  .course { font-size: 18px; font-style: italic; color: #1a237e; margin: 3mm 0; max-width: 160mm; margin-left: auto; margin-right: auto; font-weight: 600; }
  .instructor { font-size: 12px; color: #555; margin-bottom: 5mm; }
  .meta { display: flex; justify-content: space-around; margin-top: 8mm; padding-top: 4mm; border-top: 1px solid #e5e5e5; }
  .meta-item { text-align: center; }
  .meta-item label { display: block; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #c8a14a; margin-bottom: 1mm; font-family: sans-serif; }
  .meta-item span { font-size: 11px; color: #333; }
  .ministry-seal { background: #e8f5e9; border: 1px solid #2e7d32; border-radius: 4px; padding: 3mm 5mm; margin-top: 4mm; text-align: center; }
  .seal-title { font-size: 11px; font-weight: bold; color: #1b5e20; margin: 0 0 1mm; font-family: sans-serif; }
  .seal-reviewer, .seal-date { font-size: 10px; color: #388e3c; margin: 0; font-family: sans-serif; }
  .ministry-pending { background: #fff3e0; border: 1px solid #e65100; border-radius: 4px; padding: 2mm 4mm; margin-top: 4mm; }
  .ministry-pending p { font-size: 10px; color: #e65100; margin: 0; font-family: sans-serif; }
  .citations { margin-top: 4mm; text-align: left; }
  .citations .label { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #1a237e; font-family: sans-serif; margin-bottom: 1mm; }
  .citations ul { list-style: none; padding: 0; margin: 0; }
  .citations li { font-size: 9px; color: #555; padding: 0.5mm 0; }
  .citations li::before { content: "• "; color: #c8a14a; }
  .verify { font-size: 9px; color: #aaa; text-align: center; margin-top: 5mm; font-family: sans-serif; }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="flag">🇨🇩</div>
      <div class="republic">République Démocratique du Congo</div>
      <div class="ministry">Ministère de la Formation Professionnelle</div>
      <h1>Certificat de Réussite</h1>
      <div class="underline"></div>
    </div>
    <div class="body">
      <p class="presented-to">Ce certificat est décerné à</p>
      <div class="learner">${cert.learnerName}</div>
      <p class="completion">pour avoir complété avec succès la formation</p>
      <p class="course">${cert.courseTitle}</p>
      ${cert.instructor ? `<p class="instructor">Formateur : <strong>${cert.instructor}</strong></p>` : ""}
      ${ministryApprovedHtml}
      ${citationsHtml}
      <div class="meta">
        <div class="meta-item"><label>Date d'obtention</label><span>${formatDate(cert.issuedAt)}</span></div>
        <div class="meta-item"><label>Identifiant</label><span>${cert.id.toUpperCase()}</span></div>
        <div class="meta-item"><label>Plateforme</label><span>EDUCERT</span></div>
      </div>
      <div class="verify">Vérification : ${certUrl}</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificat-educert-${cert.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function CertificateCard({
  cert,
  index,
}: { cert: Certificate; index: number }) {
  const [citationsOpen, setCitationsOpen] = useState(false);

  function handleDownload() {
    generateMinistryPDF(cert);
    toast.success("Génération du certificat en cours…");
  }

  function handleShare() {
    const link = `${window.location.origin}/verify/${encodeURIComponent(cert.qrCodePayload)}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Lien de vérification copié !");
    });
  }

  function handleVerify() {
    window.open(`/verify/${encodeURIComponent(cert.qrCodePayload)}`, "_blank");
  }

  return (
    <article
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col"
      data-ocid={`certificates.item.${index}`}
    >
      {/* Ministry header strip */}
      <div className="gradient-ministry px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🇨🇩
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-[10px] font-semibold tracking-widest uppercase leading-none">
              Ministère de la Formation Professionnelle
            </p>
            <p className="text-white/70 text-[9px] tracking-wide leading-none mt-0.5">
              République Démocratique du Congo — EDUCERT
            </p>
          </div>
          {cert.isMinistryApproved ? (
            <Badge
              className="bg-white/20 text-white border-0 text-[10px] shrink-0 gap-1"
              data-ocid={`certificates.approved_badge.${index}`}
            >
              <CheckCircle2 className="size-3" />
              Approuvé
            </Badge>
          ) : (
            <Badge
              className="bg-amber-500/30 text-amber-100 border-0 text-[10px] shrink-0 gap-1"
              data-ocid={`certificates.pending_badge.${index}`}
            >
              <Clock className="size-3" />
              En attente
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Title section */}
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 shrink-0">
            <Award className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-display font-bold text-foreground text-base leading-tight line-clamp-2"
              title={cert.courseTitle}
            >
              {cert.courseTitle}
            </h3>
            {cert.instructor && (
              <p className="text-xs text-muted-foreground mt-1">
                Formateur : {cert.instructor}
              </p>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="bg-muted/40 rounded-xl p-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <UserCheck className="size-3.5" />
              Apprenant
            </span>
            <span className="font-medium text-foreground">
              {cert.learnerName}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5" />
              Date d'obtention
            </span>
            <span className="font-medium text-foreground">
              {formatDate(cert.issuedAt)}
            </span>
          </div>
          {cert.isMinistryApproved && cert.ministryReviewerName && (
            <>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="size-3.5" />
                  Réviseur ministériel
                </span>
                <span className="font-medium text-foreground text-right max-w-[140px] truncate">
                  {cert.ministryReviewerName}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Ministry approval banner */}
        {cert.isMinistryApproved ? (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-primary/8 border border-primary/20 rounded-lg">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary">
                Approuvé par le Ministère
              </p>
              {cert.approvedAt && (
                <p className="text-[10px] text-primary/70">
                  le {formatDate(cert.approvedAt)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-accent/8 border border-accent/20 rounded-lg">
            <Clock className="size-4 text-accent shrink-0" />
            <p className="text-xs font-semibold text-accent">
              En attente d'approbation ministérielle
            </p>
          </div>
        )}

        {/* Collapsible resource citations */}
        {cert.resourceCitations.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setCitationsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-foreground bg-muted/30 hover:bg-muted/60 transition-colors"
              aria-expanded={citationsOpen}
              data-ocid={`certificates.citations_toggle.${index}`}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                Ressources utilisées ({cert.resourceCitations.length})
              </span>
              {citationsOpen ? (
                <ChevronUp className="size-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-3.5 text-muted-foreground" />
              )}
            </button>
            {citationsOpen && (
              <ul className="px-3 py-2 space-y-1.5 bg-muted/10">
                {cert.resourceCitations.map((citation) => (
                  <li
                    key={citation}
                    className="text-[11px] text-muted-foreground flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{citation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* QR code preview */}
        <div className="flex items-center gap-3 px-3 py-3 bg-muted/30 rounded-xl border border-dashed border-border">
          <div className="border-2 border-border rounded-md overflow-hidden shrink-0">
            <QRCodeVisual payload={cert.qrCodePayload} size={68} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <QrCode className="size-3" />
              Code de vérification
            </p>
            <p className="text-[10px] font-mono text-foreground break-all mt-0.5 leading-tight">
              {cert.qrCodePayload}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <Button
            size="sm"
            className="flex-1 text-xs gap-1.5"
            onClick={handleDownload}
            data-ocid={`certificates.download_button.${index}`}
          >
            <Download className="size-3.5" />
            Télécharger PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleShare}
            data-ocid={`certificates.share_button.${index}`}
          >
            <Share2 className="size-3.5" />
            Partager
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleVerify}
            aria-label="Vérifier ce certificat"
            data-ocid={`certificates.verify_button.${index}`}
          >
            <ExternalLink className="size-3.5" />
            Vérifier
          </Button>
        </div>
      </div>
    </article>
  );
}

function CertificatesGrid({
  certs,
  emptyMessage,
  emptyIcon: EmptyIcon,
}: {
  certs: Certificate[];
  emptyMessage: string;
  emptyIcon: React.ElementType;
}) {
  if (certs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="certificates.empty_state"
      >
        <div className="rounded-2xl bg-muted/50 p-5 mb-4">
          <EmptyIcon className="size-10 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground text-base">
          {emptyMessage}
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Complétez une formation pour obtenir votre certificat.
        </p>
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
      data-ocid="certificates.list"
    >
      {certs.map((cert, i) => (
        <CertificateCard key={cert.id} cert={cert} index={i + 1} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
      data-ocid="certificates.loading_state"
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <Skeleton className="h-14 w-full" />
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="size-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CertificatesPage() {
  const navigate = useNavigate();
  const { data: certificates, isLoading } = useGetCertificates();

  const approved = certificates?.filter((c) => c.isMinistryApproved) ?? [];
  const pending = certificates?.filter((c) => !c.isMinistryApproved) ?? [];

  return (
    <Layout>
      <div data-ocid="certificates.page" className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-xl gradient-ministry flex items-center justify-center shrink-0">
              <Award className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground leading-none">
                Mes Certificats
                {!isLoading && certificates && (
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    ({certificates.length})
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Certifications officielles — Ministère de la Formation
                Professionnelle, RDC
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar (shown when loaded) */}
        {!isLoading && certificates && certificates.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/8 border border-primary/20 rounded-xl">
              <Trophy className="size-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {approved.length} approuvé{approved.length > 1 ? "s" : ""} par
                le Ministère
              </span>
            </div>
            {pending.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-accent/8 border border-accent/20 rounded-xl">
                <Clock className="size-4 text-accent" />
                <span className="text-sm font-semibold text-accent">
                  {pending.length} en attente d'approbation
                </span>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : !certificates?.length ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="certificates.empty_state"
          >
            <div className="rounded-2xl gradient-ministry p-5 mb-5 opacity-80">
              <Award className="size-12 text-white" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              Aucun certificat pour l'instant
            </h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Complétez une formation pour obtenir votre premier certificat
              officiel du Ministère de la Formation Professionnelle de la RDC.
            </p>
            <Button
              onClick={() => navigate({ to: "/catalog" })}
              data-ocid="certificates.explore_button"
            >
              Explorer les formations
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="approved" data-ocid="certificates.tabs">
            <TabsList className="mb-6 h-10">
              <TabsTrigger
                value="approved"
                className="gap-2"
                data-ocid="certificates.approved_tab"
              >
                <CheckCircle2 className="size-3.5" />
                Certifiés par le Ministère
                <span className="ml-1 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-semibold">
                  {approved.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="gap-2"
                data-ocid="certificates.pending_tab"
              >
                <Clock className="size-3.5" />
                En attente d'approbation
                <span className="ml-1 text-[10px] bg-accent/10 text-accent rounded-full px-1.5 py-0.5 font-semibold">
                  {pending.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approved">
              <CertificatesGrid
                certs={approved}
                emptyMessage="Aucun certificat approuvé"
                emptyIcon={Shield}
              />
            </TabsContent>

            <TabsContent value="pending">
              <CertificatesGrid
                certs={pending}
                emptyMessage="Aucun certificat en attente"
                emptyIcon={Clock}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
