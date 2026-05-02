import { ap as useListAllGenerations, r as reactExports, j as jsxRuntimeExports, L as Layout, e as Button, aq as Sparkles, aB as useApproveGeneration, aC as useRejectGeneration, aD as useTriggerAIGeneration, w as CircleCheckBig, a1 as LoaderCircle, t as Clock, B as Badge, a9 as ChevronDown, ad as Label, ao as useListResources, h as ue } from "./index-D09cs5UV.js";
import { A as AdminGuard } from "./AdminGuard-DAeZUvHt.js";
import { C as Card, a as CardContent, b as CardHeader } from "./card-BocCJxur.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { L as Layers } from "./layers-ivYnSAUB.js";
import { R as RefreshCw } from "./refresh-cw-BsHLDkRb.js";
import { C as CircleX } from "./circle-x-Bb-Z_XDj.js";
import { P as Play } from "./play-B9_PUdmR.js";
import { C as ChevronUp } from "./chevron-up-CGPOmjX1.js";
import "./x-DU9MTTQ_.js";
const STATUS_CONFIG = {
  queued: {
    label: "En file d'attente",
    badgeVariant: "secondary",
    badgeClass: "bg-muted text-muted-foreground",
    icon: Clock
  },
  step1_deepseek: {
    label: "DeepSeek — Étape 1",
    badgeVariant: "secondary",
    badgeClass: "bg-primary/15 text-primary border-primary/20",
    icon: LoaderCircle
  },
  step2_qwen: {
    label: "Qwen — Étape 2",
    badgeVariant: "secondary",
    badgeClass: "bg-accent/15 text-accent border-accent/20",
    icon: LoaderCircle
  },
  step3_gpt4o: {
    label: "GPT-4o — Étape 3",
    badgeVariant: "secondary",
    badgeClass: "bg-chart-3/15 text-chart-3 border-chart-3/20",
    icon: LoaderCircle
  },
  approved: {
    label: "Approuvé",
    badgeVariant: "default",
    badgeClass: "",
    icon: CircleCheckBig
  },
  rejected: {
    label: "Rejeté",
    badgeVariant: "destructive",
    badgeClass: "",
    icon: CircleX
  },
  revision_needed: {
    label: "Révision demandée",
    badgeVariant: "outline",
    badgeClass: "border-accent/40 text-accent bg-accent/10",
    icon: RefreshCw
  }
};
const ACTIVE_STATUSES = [
  "step1_deepseek",
  "step2_qwen",
  "step3_gpt4o"
];
const STEPS = [
  {
    status: "step1_deepseek",
    label: "Structure pédagogique",
    model: "DeepSeek"
  },
  { status: "step2_qwen", label: "Contenu en français", model: "Qwen" },
  {
    status: "step3_gpt4o",
    label: "Validation & Approbation",
    model: "GPT-4o"
  }
];
const STATUS_ORDER = [
  "queued",
  "step1_deepseek",
  "step2_qwen",
  "step3_gpt4o",
  "approved"
];
function AIStepProgress({ status }) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0", children: STEPS.map((step, i) => {
    const stepStatusIndex = STATUS_ORDER.indexOf(step.status);
    const isCompleted = status === "approved" || currentIndex > stepStatusIndex;
    const isActive = status === step.status;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-smooth ${isCompleted ? "bg-primary/10 text-primary border-primary/20 font-medium" : isActive ? "bg-accent/15 text-accent border-accent/20 font-medium" : "bg-muted/50 text-muted-foreground border-border"}`,
          children: [
            isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3 shrink-0" }) : isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 shrink-0 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-3 shrink-0 flex items-center justify-center text-[10px] font-bold", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: step.model }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: i + 1 })
          ]
        }
      ),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-4 h-px mx-0.5 ${isCompleted ? "bg-primary/40" : "bg-border"}`
        }
      )
    ] }, step.status);
  }) });
}
function TriggerGenerationDialog({
  open,
  onClose
}) {
  const { data: resources = [] } = useListResources();
  const triggerGeneration = useTriggerAIGeneration();
  const [description, setDescription] = reactExports.useState("");
  const indexedResources = resources.filter((r) => r.status === "indexed");
  const handleTrigger = () => {
    if (!description.trim()) {
      ue.error("Veuillez décrire la formation à générer");
      return;
    }
    triggerGeneration.mutate("new", {
      onSuccess: () => {
        ue.success("Génération déclenchée — DeepSeek démarre...");
        setDescription("");
        onClose();
      },
      onError: () => ue.error("Erreur lors du déclenchement")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md",
      "data-ocid": "admin_generations.trigger_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Déclencher une nouvelle génération" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-1", children: "Flux IA séquentiel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "DeepSeek → structure pédagogique · Qwen → contenu en français · GPT-4o → validation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gen-desc", children: "Description de la formation *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "gen-desc",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Ex: Formation complète en gestion financière pour les PME congolaises, incluant la comptabilité OHADA et la fiscalité locale...",
                rows: 4,
                className: "resize-none",
                "data-ocid": "admin_generations.trigger_description_textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              indexedResources.length,
              " ressource",
              indexedResources.length !== 1 ? "s" : "",
              " indexée",
              indexedResources.length !== 1 ? "s" : "",
              " disponible",
              indexedResources.length !== 1 ? "s" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_generations.trigger_cancel_button",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleTrigger,
              disabled: triggerGeneration.isPending,
              "data-ocid": "admin_generations.trigger_submit_button",
              children: triggerGeneration.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-2 animate-spin" }),
                "Déclenchement..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-4 mr-2" }),
                "Lancer la génération"
              ] })
            }
          )
        ] })
      ]
    }
  ) });
}
function GenerationCard({
  gen,
  index
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [expandedStep, setExpandedStep] = reactExports.useState(null);
  const approveGeneration = useApproveGeneration();
  const rejectGeneration = useRejectGeneration();
  const triggerGeneration = useTriggerAIGeneration();
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [showRejectInput, setShowRejectInput] = reactExports.useState(false);
  const config = STATUS_CONFIG[gen.status];
  const Icon = config.icon;
  const isActive = ACTIVE_STATUSES.includes(gen.status);
  const canTrigger = gen.status === "queued";
  const canReview = gen.status === "step3_gpt4o";
  const handleApprove = () => {
    approveGeneration.mutate(
      { id: gen.id, notes: "" },
      {
        onSuccess: () => ue.success("Cours approuvé et publié"),
        onError: () => ue.error("Erreur lors de l'approbation")
      }
    );
  };
  const handleReject = () => {
    if (!rejectReason.trim()) {
      ue.error("Veuillez indiquer la raison du rejet");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason: rejectReason },
      {
        onSuccess: () => {
          ue.success("Cours rejeté");
          setShowRejectInput(false);
          setRejectReason("");
        },
        onError: () => ue.error("Erreur lors du rejet")
      }
    );
  };
  const handleTrigger = () => {
    triggerGeneration.mutate(gen.id, {
      onSuccess: () => ue.success("Génération déclenchée"),
      onError: () => ue.error("Erreur lors du déclenchement")
    });
  };
  const iconColorClass = isActive ? "text-accent" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: `border-border transition-smooth ${isActive ? "ring-1 ring-accent/30" : ""}`,
      "data-ocid": `admin_generations.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isActive ? "bg-accent/15" : "bg-muted/60"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `size-4 ${iconColorClass} ${isActive ? "animate-spin" : ""}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground line-clamp-2 mb-2", children: gen.requestDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: config.badgeVariant,
                    className: `text-xs ${config.badgeClass}`,
                    children: config.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  gen.resourceIds.length,
                  " ressource",
                  gen.resourceIds.length !== 1 ? "s" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              canTrigger && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "gap-1.5 text-xs",
                  onClick: handleTrigger,
                  disabled: triggerGeneration.isPending,
                  "data-ocid": `admin_generations.trigger_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3" }),
                    "Déclencher"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground",
                  onClick: () => setExpanded((p) => !p),
                  "data-ocid": `admin_generations.expand_button.${index + 1}`,
                  children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AIStepProgress, { status: gen.status }) })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5", children: "Description complète" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: gen.requestDescription })
          ] }),
          gen.steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: [
              "Sorties IA (",
              gen.steps.length,
              " étape",
              gen.steps.length !== 1 ? "s" : "",
              " complétée",
              gen.steps.length !== 1 ? "s" : "",
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: gen.steps.map((step) => {
              const stepLabel = step.model === "deepseek" ? "DeepSeek — Structure pédagogique" : step.model === "qwen" ? "Qwen — Contenu en français" : "GPT-4o — Validation";
              const isExp = expandedStep === step.step;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg border border-border overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/30 transition-colors",
                        onClick: () => setExpandedStep(isExp ? null : step.step),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3.5 text-primary shrink-0" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: stepLabel })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            step.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(step.completedAt).toLocaleTimeString(
                              "fr-FR",
                              { hour: "2-digit", minute: "2-digit" }
                            ) }),
                            isExp ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 text-muted-foreground" })
                          ] })
                        ]
                      }
                    ),
                    isExp && step.output && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-3 pt-1 bg-muted/20 text-xs text-muted-foreground leading-relaxed", children: step.output })
                  ]
                },
                step.step
              );
            }) })
          ] }),
          gen.resourceIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5", children: [
              "Ressources utilisées (",
              gen.resourceIds.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: gen.resourceIds.map((rid) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: rid }, rid)) })
          ] }),
          canReview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Action ministérielle" }),
            showRejectInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `reject-reason-${gen.id}`,
                  className: "text-xs",
                  children: "Motif du rejet *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: `reject-reason-${gen.id}`,
                  value: rejectReason,
                  onChange: (e) => setRejectReason(e.target.value),
                  placeholder: "Expliquez la raison du rejet...",
                  rows: 2,
                  className: "resize-none text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "flex-1 gap-2",
                  onClick: handleApprove,
                  disabled: approveGeneration.isPending,
                  "data-ocid": `admin_generations.approve_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4" }),
                    "Approuver"
                  ]
                }
              ),
              showRejectInput ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "destructive",
                    className: "flex-1 gap-2",
                    onClick: handleReject,
                    disabled: rejectGeneration.isPending,
                    "data-ocid": `admin_generations.reject_confirm_button.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }),
                      "Confirmer le rejet"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    onClick: () => {
                      setShowRejectInput(false);
                      setRejectReason("");
                    },
                    "data-ocid": `admin_generations.reject_cancel_button.${index + 1}`,
                    children: "Annuler"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 gap-2 border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/5",
                  onClick: () => setShowRejectInput(true),
                  "data-ocid": `admin_generations.reject_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }),
                    "Rejeter"
                  ]
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
function AdminGenerationsPage() {
  const { data: generations = [], isLoading } = useListAllGenerations();
  const [triggerOpen, setTriggerOpen] = reactExports.useState(false);
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const filters = [
    { value: "all", label: "Toutes" },
    { value: "queued", label: "En attente" },
    { value: "step1_deepseek", label: "DeepSeek" },
    { value: "step2_qwen", label: "Qwen" },
    { value: "step3_gpt4o", label: "GPT-4o" },
    { value: "approved", label: "Approuvés" },
    { value: "rejected", label: "Rejetés" }
  ];
  const filteredGenerations = statusFilter === "all" ? generations : generations.filter((g) => g.status === statusFilter);
  const pendingCount = generations.filter(
    (g) => g.status === "step3_gpt4o"
  ).length;
  const activeCount = generations.filter(
    (g) => ACTIVE_STATUSES.includes(g.status)
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_generations.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Générations de cours IA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Flux séquentiel : DeepSeek → Qwen → GPT-4o" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setTriggerOpen(true),
            className: "gap-2 shrink-0",
            "data-ocid": "admin_generations.new_generation_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
              "Nouvelle génération"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: [
        {
          label: "Total",
          value: generations.length,
          color: "text-foreground"
        },
        { label: "En cours", value: activeCount, color: "text-accent" },
        {
          label: "En attente d'approbation",
          value: pendingCount,
          color: "text-destructive"
        },
        {
          label: "Approuvés",
          value: generations.filter((g) => g.status === "approved").length,
          color: "text-primary"
        }
      ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold font-display ${stat.color}`, children: stat.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: stat.label })
          ]
        },
        stat.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: filters.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setStatusFilter(value),
          className: `px-3 py-1 text-xs rounded-full border transition-smooth ${statusFilter === value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`,
          "data-ocid": `admin_generations.filter_${value}`,
          children: label
        },
        value
      )) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-4",
          "data-ocid": "admin_generations.loading_state",
          children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" })
              ] })
            ] })
          ] }) }) }, k))
        }
      ) : filteredGenerations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CardContent,
        {
          className: "flex flex-col items-center justify-center py-16",
          "data-ocid": "admin_generations.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg mb-2", children: "Aucune génération" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 text-center max-w-sm", children: statusFilter !== "all" ? "Aucune génération avec ce statut." : "Déclenchez votre première génération de cours IA pour démarrer." }),
            statusFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setTriggerOpen(true),
                "data-ocid": "admin_generations.empty_trigger_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 mr-2" }),
                  "Première génération"
                ]
              }
            )
          ]
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filteredGenerations.map((gen, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(GenerationCard, { gen, index: i }, gen.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TriggerGenerationDialog,
      {
        open: triggerOpen,
        onClose: () => setTriggerOpen(false)
      }
    )
  ] }) });
}
export {
  AdminGenerationsPage as default
};
