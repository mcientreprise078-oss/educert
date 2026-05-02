import { c as createLucideIcon, ap as useListAllGenerations, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Badge, t as Clock, w as CircleCheckBig, a8 as User, au as FileText, e as Button, a9 as ChevronDown, v as BookOpen, aB as useApproveGeneration, ad as Label, a1 as LoaderCircle, aC as useRejectGeneration, h as ue } from "./index-D09cs5UV.js";
import { A as AdminGuard } from "./AdminGuard-DAeZUvHt.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BocCJxur.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { C as CircleX } from "./circle-x-Bb-Z_XDj.js";
import { R as RefreshCw } from "./refresh-cw-BsHLDkRb.js";
import { C as ChevronUp } from "./chevron-up-CGPOmjX1.js";
import "./x-DU9MTTQ_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
];
const ClipboardCheck = createLucideIcon("clipboard-check", __iconNode);
const TAB_CONFIG = [
  { value: "pending", label: "En attente", statuses: ["step3_gpt4o"] },
  { value: "approved", label: "Approuvés", statuses: ["approved"] },
  { value: "rejected", label: "Rejetés", statuses: ["rejected"] },
  {
    value: "revision",
    label: "Révision demandée",
    statuses: ["revision_needed"]
  }
];
const anonymizeLearner = (id) => {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `Apprenant #${hash % 9e3 + 1e3}`;
};
function RejectDialog({
  gen,
  open,
  onClose
}) {
  const rejectGeneration = useRejectGeneration();
  const [reason, setReason] = reactExports.useState("");
  const handleReject = () => {
    if (!gen) return;
    if (!reason.trim()) {
      ue.error("Veuillez indiquer la raison du rejet");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason },
      {
        onSuccess: () => {
          ue.success("Cours rejeté");
          setReason("");
          onClose();
        },
        onError: () => ue.error("Erreur lors du rejet")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          setReason("");
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-md",
          "data-ocid": "admin_approvals.reject_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-5 text-destructive" }),
              "Rejeter le cours"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
              gen && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 p-3 bg-muted/40 rounded-lg", children: gen.requestDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reject-reason", children: "Motif du rejet *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "reject-reason",
                    value: reason,
                    onChange: (e) => setReason(e.target.value),
                    placeholder: "Expliquez clairement pourquoi ce cours est rejeté...",
                    rows: 4,
                    className: "resize-none",
                    "data-ocid": "admin_approvals.reject_reason_textarea"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    setReason("");
                    onClose();
                  },
                  "data-ocid": "admin_approvals.reject_cancel_button",
                  children: "Annuler"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "destructive",
                  onClick: handleReject,
                  disabled: rejectGeneration.isPending,
                  "data-ocid": "admin_approvals.reject_confirm_button",
                  children: rejectGeneration.isPending ? "Rejet en cours..." : "Confirmer le rejet"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function RevisionDialog({
  gen,
  open,
  onClose
}) {
  const rejectGeneration = useRejectGeneration();
  const [notes, setNotes] = reactExports.useState("");
  const handleRevision = () => {
    if (!gen) return;
    if (!notes.trim()) {
      ue.error("Veuillez indiquer les points à réviser");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason: `[RÉVISION] ${notes}` },
      {
        onSuccess: () => {
          ue.success("Demande de révision envoyée");
          setNotes("");
          onClose();
        },
        onError: () => ue.error("Erreur lors de la demande")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          setNotes("");
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-md",
          "data-ocid": "admin_approvals.revision_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-5 text-accent" }),
              "Demander une révision"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
              gen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-muted/40 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: gen.requestDescription }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "revision-notes", children: "Points à réviser *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "revision-notes",
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    placeholder: "Indiquez les sections à améliorer, les corrections à apporter...",
                    rows: 4,
                    className: "resize-none",
                    "data-ocid": "admin_approvals.revision_notes_textarea"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    setNotes("");
                    onClose();
                  },
                  "data-ocid": "admin_approvals.revision_cancel_button",
                  children: "Annuler"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "bg-accent text-accent-foreground hover:bg-accent/90",
                  onClick: handleRevision,
                  disabled: rejectGeneration.isPending,
                  "data-ocid": "admin_approvals.revision_confirm_button",
                  children: rejectGeneration.isPending ? "Envoi..." : "Envoyer la demande"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function ApproveDialog({
  gen,
  open,
  onClose
}) {
  const approveGeneration = useApproveGeneration();
  const [notes, setNotes] = reactExports.useState("");
  const handleApprove = () => {
    if (!gen) return;
    approveGeneration.mutate(
      { id: gen.id, notes },
      {
        onSuccess: () => {
          ue.success("Cours approuvé et publié officiellement");
          setNotes("");
          onClose();
        },
        onError: () => ue.error("Erreur lors de l'approbation")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          setNotes("");
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-md",
          "data-ocid": "admin_approvals.approve_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-5 text-primary" }),
              "Approuver et publier"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
              gen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-primary/5 border border-primary/20 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground line-clamp-2", children: gen.requestDescription }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "En approuvant ce cours, vous certifiez qu'il respecte les standards pédagogiques du Ministère de la Formation Professionnelle de la RDC." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "approve-notes", children: "Notes du réviseur (optionnel)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "approve-notes",
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    placeholder: "Commentaires, félicitations ou recommandations...",
                    rows: 3,
                    className: "resize-none",
                    "data-ocid": "admin_approvals.approve_notes_textarea"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    setNotes("");
                    onClose();
                  },
                  "data-ocid": "admin_approvals.approve_cancel_button",
                  children: "Annuler"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleApprove,
                  disabled: approveGeneration.isPending,
                  "data-ocid": "admin_approvals.approve_confirm_button",
                  children: approveGeneration.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-2 animate-spin" }),
                    "Publication..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 mr-2" }),
                    "Approuver et publier"
                  ] })
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function ApprovalCard({
  gen,
  index,
  tab,
  onApprove,
  onReject,
  onRevision
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isPending = tab === "pending";
  const gpt4oStep = gen.steps.find((s) => s.model === "gpt4o");
  const validationExcerpt = (gpt4oStep == null ? void 0 : gpt4oStep.output) ?? "Validation GPT-4o en attente...";
  const mockLessons = [
    "Introduction et objectifs de la formation",
    "Cadre conceptuel et notions fondamentales",
    "Applications pratiques et études de cas"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: `border-border transition-smooth ${isPending ? "ring-1 ring-primary/20" : ""}`,
      "data-ocid": `admin_approvals.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isPending ? "bg-primary/10" : tab === "approved" ? "bg-primary/10" : "bg-muted"}`,
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-primary" }) : tab === "approved" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 text-primary" }) : tab === "rejected" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 text-accent" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground line-clamp-2 mb-2", children: gen.requestDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3" }),
                  anonymizeLearner(gen.requestedBy)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                  new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
                  gen.resourceIds.length,
                  " ressource",
                  gen.resourceIds.length !== 1 ? "s" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-8 text-muted-foreground shrink-0",
                onClick: () => setExpanded((p) => !p),
                "data-ocid": `admin_approvals.expand_button.${index + 1}`,
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 rounded-lg bg-muted/40 border border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Validation GPT-4o" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground line-clamp-2", children: validationExcerpt })
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: "Notes complètes de validation GPT-4o" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 border border-border/50", children: [
              gen.steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 last:mb-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground", children: [
                  step.model === "deepseek" ? "DeepSeek" : step.model === "qwen" ? "Qwen" : "GPT-4o",
                  " ",
                  ":"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: step.output ?? "En attente" })
              ] }, step.step)),
              gen.steps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Aucune sortie IA disponible." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: "Aperçu de la structure (3 premières leçons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: mockLessons.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs text-foreground p-2 rounded bg-card border border-border/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold shrink-0", children: i + 1 }),
                  lesson
                ]
              },
              lesson
            )) })
          ] }),
          gen.resourceIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: [
              "Ressources citées (",
              gen.resourceIds.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: gen.resourceIds.map((rid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-2.5" }),
                  rid
                ]
              },
              rid
            )) })
          ] }),
          (tab === "rejected" || tab === "revision") && gen.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-destructive/5 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-destructive mb-1", children: tab === "rejected" ? "Motif du rejet" : "Points à réviser" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: gen.errorMessage })
          ] })
        ] }) }),
        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 gap-2",
              onClick: () => onApprove(gen),
              "data-ocid": `admin_approvals.approve_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4" }),
                "Approuver et publier"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2 border-accent/30 text-accent hover:bg-accent/5 hover:text-accent",
              onClick: () => onRevision(gen),
              "data-ocid": `admin_approvals.revision_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }),
                "Révision"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive",
              onClick: () => onReject(gen),
              "data-ocid": `admin_approvals.reject_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }),
                "Rejeter"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function AdminApprovalsPage() {
  var _a;
  const { data: generations = [], isLoading } = useListAllGenerations();
  const [activeTab, setActiveTab] = reactExports.useState("pending");
  const [approveTarget, setApproveTarget] = reactExports.useState(
    null
  );
  const [rejectTarget, setRejectTarget] = reactExports.useState(
    null
  );
  const [revisionTarget, setRevisionTarget] = reactExports.useState(
    null
  );
  const getTabCount = (tab) => {
    const config = TAB_CONFIG.find((t) => t.value === tab);
    if (!config) return 0;
    return generations.filter((g) => config.statuses.includes(g.status)).length;
  };
  const currentTabStatuses = ((_a = TAB_CONFIG.find((t) => t.value === activeTab)) == null ? void 0 : _a.statuses) ?? [];
  const filteredGenerations = generations.filter(
    (g) => currentTabStatuses.includes(g.status)
  );
  const pendingCount = getTabCount("pending");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_approvals.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Approbations en attente" }),
          pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "destructive",
              className: "text-xs font-bold",
              "data-ocid": "admin_approvals.pending_count_badge",
              children: pendingCount
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Validez les cours générés par l'IA avant leur publication officielle." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 p-1 bg-muted/50 rounded-xl w-full sm:w-auto sm:inline-flex",
          "data-ocid": "admin_approvals.tabs",
          children: TAB_CONFIG.map(({ value, label }) => {
            const count = getTabCount(value);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(value),
                className: `flex-1 sm:flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-smooth ${activeTab === value ? "bg-card shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `admin_approvals.tab_${value}`,
                children: [
                  label,
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === value ? value === "pending" ? "bg-destructive text-destructive-foreground" : "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                      children: count
                    }
                  )
                ]
              },
              value
            );
          })
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-4",
          "data-ocid": "admin_approvals.loading_state",
          children: ["a", "b"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" })
            ] })
          ] }) }) }, k))
        }
      ) : filteredGenerations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CardContent,
        {
          className: "flex flex-col items-center justify-center py-16",
          "data-ocid": "admin_approvals.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg mb-2", children: activeTab === "pending" ? "Aucun cours en attente" : activeTab === "approved" ? "Aucun cours approuvé" : activeTab === "rejected" ? "Aucun cours rejeté" : "Aucune révision demandée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-sm", children: activeTab === "pending" ? "Les cours validés par GPT-4o apparaîtront ici pour approbation ministérielle." : "Aucune entrée dans cette catégorie pour le moment." })
          ]
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filteredGenerations.map((gen, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ApprovalCard,
        {
          gen,
          index: i,
          tab: activeTab,
          onApprove: setApproveTarget,
          onReject: setRejectTarget,
          onRevision: setRevisionTarget
        },
        gen.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApproveDialog,
      {
        gen: approveTarget,
        open: !!approveTarget,
        onClose: () => setApproveTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RejectDialog,
      {
        gen: rejectTarget,
        open: !!rejectTarget,
        onClose: () => setRejectTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RevisionDialog,
      {
        gen: revisionTarget,
        open: !!revisionTarget,
        onClose: () => setRevisionTarget(null)
      }
    )
  ] }) });
}
export {
  AdminApprovalsPage as default
};
