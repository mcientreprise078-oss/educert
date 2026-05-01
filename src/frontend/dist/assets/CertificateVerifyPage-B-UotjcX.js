import { l as useParams, aR as useVerifyCertificateQR, j as jsxRuntimeExports, a2 as Shield, e as Button, B as Badge, z as Award, v as BookOpen } from "./index-Duog9_D-.js";
import { S as Skeleton } from "./skeleton-Cm0MP4Fa.js";
import { C as CircleX, L as LoaderCircle } from "./loader-circle-B-dvYv7i.js";
import { E as ExternalLink } from "./external-link-CarBnmYU.js";
import { C as CircleCheck } from "./circle-check-s5YqhxUQ.js";
import { C as Calendar, Q as QrCode } from "./qr-code-C4Rcl713.js";
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function MinistryHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: "🇨🇩" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-primary tracking-widest uppercase leading-none", children: "République Démocratique du Congo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground tracking-wider uppercase leading-none mt-0.5", children: "Ministère de la Formation Professionnelle — EDUCERT" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-6 text-primary/50" }) })
  ] }) });
}
function LoadingState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4",
      "data-ocid": "certificate_verify.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 text-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Vérification en cours..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Interrogation du registre officiel EDUCERT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 mx-auto" })
        ] })
      ]
    }
  );
}
function InvalidResult({
  qrCode,
  errorMessage
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border-2 border-destructive/30 rounded-2xl overflow-hidden",
      "data-ocid": "certificate_verify.invalid_result",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border-b border-destructive/20 px-6 py-5 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-destructive/15 p-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-8 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-destructive tracking-widest uppercase", children: "CERTIFICAT NON TROUVÉ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-foreground mt-0.5", children: "Vérification échouée" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: errorMessage ?? "Ce certificat ne peut pas être vérifié ou n'existe pas." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Ce code QR ne correspond à aucun certificat enregistré dans le système officiel EDUCERT du Ministère de la Formation Professionnelle de la République Démocratique du Congo." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted/40 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono break-all", children: qrCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "En cas de doute :" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-1 list-disc list-inside", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Vérifiez que le code QR est intact et lisible" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Contactez l'établissement qui a délivré ce certificat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Signalez toute fraude au Ministère de la Formation Professionnelle" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ValidResult({ certificate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border-2 border-primary/30 rounded-2xl overflow-hidden watermark-pattern",
      "data-ocid": "certificate_verify.valid_result",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gradient-ministry px-6 py-5 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-white/20 p-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs font-bold tracking-widest uppercase leading-none", children: "CERTIFICAT VALIDE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-lg font-display font-bold mt-0.5 leading-tight", children: "Authentifié par EDUCERT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 text-white border-0 text-xs font-bold tracking-wide shrink-0", children: "✓ OFFICIEL" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border-b border-border px-6 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", "aria-hidden": "true", children: "🇨🇩" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground leading-none", children: "République Démocratique du Congo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider leading-none mt-0.5", children: "Ministère de la Formation Professionnelle" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5 text-accent ml-auto" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 border border-dashed border-border rounded-xl bg-background/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-2", children: "Apprenant vérifié" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: certificate.learnerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "a complété avec succès" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-base mt-2 px-4 leading-tight", children: certificate.courseTitle }),
            certificate.instructor && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: [
              "Formateur : ",
              certificate.instructor
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wide mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
                "Date d'émission"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: formatDate(certificate.issuedAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wide mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-3" }),
                "Identifiant"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground break-all leading-tight", children: certificate.id })
            ] })
          ] }),
          certificate.isMinistryApproved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-emerald-700 dark:text-emerald-300 text-sm", children: "Approuvé par le Ministère" }),
              certificate.ministryReviewerName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-0.5", children: [
                "Réviseur : ",
                certificate.ministryReviewerName
              ] }),
              certificate.approvedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600/70 dark:text-emerald-400/60 mt-0.5", children: [
                "Date d'approbation : ",
                formatDate(certificate.approvedAt)
              ] })
            ] })
          ] }),
          certificate.resourceCitations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3" }),
              "Ressources académiques citées"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 pl-1", children: certificate.resourceCitations.map((citation) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "text-xs text-muted-foreground flex items-start gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-bold mt-0.5 shrink-0", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: citation })
                ]
              },
              citation
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground text-center leading-relaxed", children: [
            "Ce certificat a été émis par la plateforme EDUCERT et validé par le",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Ministère de la Formation Professionnelle de la RDC" }),
            ". Il atteste la complétion réussie de la formation indiquée et est opposable à tout tiers."
          ] }) })
        ] })
      ]
    }
  );
}
function CertificateVerifyPage() {
  const { qrCode } = useParams({ from: "/verify/$qrCode" });
  const { data, isLoading, isError } = useVerifyCertificateQR(qrCode ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "certificate_verify.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MinistryHeader, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-ministry mb-2 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-7 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Vérification de certificat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto", children: "Système officiel de vérification EDUCERT — Ministère de la Formation Professionnelle, République Démocratique du Congo" })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-destructive/30 rounded-2xl p-8 flex flex-col items-center text-center gap-3",
              "data-ocid": "certificate_verify.error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-10 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Erreur de vérification" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Impossible de vérifier ce certificat. Veuillez réessayer." })
              ]
            }
          ) : (data == null ? void 0 : data.isValid) && data.certificate ? /* @__PURE__ */ jsxRuntimeExports.jsx(ValidResult, { certificate: data.certificate }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            InvalidResult,
            {
              qrCode: qrCode ?? "",
              errorMessage: data == null ? void 0 : data.errorMessage
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "text-muted-foreground gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
            "Accueil EDUCERT"
          ] }) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " EDUCERT — Ministère de la Formation Professionnelle, RDC.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-foreground transition-colors",
              children: "Built with caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  CertificateVerifyPage as default
};
