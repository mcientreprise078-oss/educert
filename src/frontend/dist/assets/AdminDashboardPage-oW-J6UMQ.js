import { c as createLucideIcon, u as useNavigate, ao as useListResources, ap as useListAllGenerations, j as jsxRuntimeExports, L as Layout, e as Button, aq as Sparkles, t as Clock, w as CircleCheckBig, v as BookOpen, G as GraduationCap, B as Badge, ar as useGetAdminModelConfig, as as useSetAdminModelConfig, r as reactExports, ad as Label, h as ue } from "./index-D09cs5UV.js";
import { A as AdminGuard } from "./AdminGuard-DAeZUvHt.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BocCJxur.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DApGOtxs.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { R as RefreshCw } from "./refresh-cw-BsHLDkRb.js";
import { L as Layers } from "./layers-ivYnSAUB.js";
import { B as Bot } from "./bot-RbbsHRbc.js";
import { C as Crown } from "./crown-CzuuUfNc.js";
import { C as ChevronRight } from "./chevron-right-DTTFnz_N.js";
import { S as Save } from "./save-Cas2k9Vy.js";
import "./index-CG-zuoud.js";
import "./check-CCiK2Afk.js";
import "./chevron-up-CGPOmjX1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 7h-3a2 2 0 0 1-2-2V2", key: "9rb54x" }],
  [
    "path",
    {
      d: "M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z",
      key: "1059l0"
    }
  ],
  ["path", { d: "M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15", key: "16874u" }],
  ["path", { d: "M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11", key: "k2ox98" }]
];
const FileStack = createLucideIcon("file-stack", __iconNode);
const GEN_STATUS_LABELS = {
  queued: "En file d'attente",
  step1_deepseek: "DeepSeek en cours",
  step2_qwen: "Qwen en cours",
  step3_gpt4o: "GPT-4o en cours",
  approved: "Approuvé",
  rejected: "Rejeté",
  revision_needed: "Révision demandée"
};
const GEN_STATUS_VARIANT = {
  queued: "secondary",
  step1_deepseek: "secondary",
  step2_qwen: "secondary",
  step3_gpt4o: "secondary",
  approved: "default",
  rejected: "destructive",
  revision_needed: "outline"
};
const STRUCTURE_MODEL_OPTIONS = [
  { value: "DeepSeek R1", label: "DeepSeek R1 (Recommandé)" },
  { value: "Qwen 72B", label: "Qwen 72B" },
  { value: "Claude Opus", label: "Claude Opus" }
];
const CONTENT_MODEL_OPTIONS = [
  { value: "Qwen 72B", label: "Qwen 72B (Recommandé)" },
  { value: "DeepSeek R1", label: "DeepSeek R1" },
  { value: "Claude Sonnet", label: "Claude Sonnet" }
];
const VALIDATION_MODEL_OPTIONS = [
  { value: "GPT-4o", label: "GPT-4o (Recommandé)" },
  { value: "Claude Opus", label: "Claude Opus" },
  { value: "GPT-5", label: "GPT-5" },
  { value: "Claude Sonnet", label: "Claude Sonnet" }
];
function StatCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 px-5 pb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-5 rounded mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12 mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" })
  ] }) });
}
function AIModelSettingsPanel() {
  const { data: config, isLoading } = useGetAdminModelConfig();
  const setConfig = useSetAdminModelConfig();
  const [local, setLocal] = reactExports.useState({
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o"
  });
  reactExports.useEffect(() => {
    if (config) setLocal(config);
  }, [config]);
  const handleSave = () => {
    setConfig.mutate(local, {
      onSuccess: () => ue.success("Configuration des modèles IA enregistrée"),
      onError: () => ue.error("Erreur lors de l'enregistrement")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_dashboard.model_settings_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "size-4 text-accent" }),
      "Configurer les modèles IA"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" })
    ] }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs text-muted-foreground flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Flux séquentiel :" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-primary/10 text-primary font-medium", children: "1. Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-accent/10 text-accent font-medium", children: "2. Contenu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium", children: "3. Validation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Modèle de structure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: local.structureModel,
              onValueChange: (v) => setLocal({ ...local, structureModel: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_dashboard.structure_model_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STRUCTURE_MODEL_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Génère le plan pédagogique du cours" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Modèle de contenu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: local.contentModel,
              onValueChange: (v) => setLocal({ ...local, contentModel: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_dashboard.content_model_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CONTENT_MODEL_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rédige les leçons en français" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Modèle de validation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: local.validationModel,
              onValueChange: (v) => setLocal({ ...local, validationModel: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_dashboard.validation_model_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: VALIDATION_MODEL_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Valide avant publication" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleSave,
          disabled: setConfig.isPending,
          size: "sm",
          className: "gap-2",
          "data-ocid": "admin_dashboard.save_model_config_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-3.5" }),
            setConfig.isPending ? "Enregistrement..." : "Enregistrer la configuration"
          ]
        }
      ) })
    ] }) })
  ] });
}
function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: resources = [], isLoading: resourcesLoading } = useListResources();
  const { data: generations = [], isLoading: generationsLoading } = useListAllGenerations();
  const inactivityNotifCount = 0;
  const isLoading = resourcesLoading || generationsLoading;
  const totalResources = resources.length;
  const indexedResources = resources.filter(
    (r) => r.status === "indexed"
  ).length;
  const pendingApprovals = generations.filter(
    (g) => g.status === "step3_gpt4o"
  ).length;
  const approvedCount = generations.filter(
    (g) => g.status === "approved"
  ).length;
  const totalGenerations = generations.length;
  const stats = [
    {
      label: "Ressources totales",
      value: totalResources,
      sub: `${indexedResources} indexées`,
      icon: FileStack,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "Générations demandées",
      value: totalGenerations,
      sub: "toutes demandes",
      icon: Sparkles,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      label: "En attente d'approbation",
      value: pendingApprovals,
      sub: "GPT-4o validé",
      icon: Clock,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      label: "Cours approuvés",
      value: approvedCount,
      sub: "publiés officiellement",
      icon: CircleCheckBig,
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];
  const quickActions = [
    {
      label: "Bibliothèque",
      description: `${totalResources} ressources`,
      icon: BookOpen,
      href: "/admin/resources",
      ocid: "admin_dashboard.nav_resources"
    },
    {
      label: "Générations IA",
      description: `${totalGenerations} demandes`,
      icon: Layers,
      href: "/admin/generations",
      ocid: "admin_dashboard.nav_generations"
    },
    {
      label: "Approbations",
      description: `${pendingApprovals} en attente`,
      icon: CircleCheckBig,
      href: "/admin/approvals",
      ocid: "admin_dashboard.nav_approvals",
      urgent: pendingApprovals > 0
    },
    {
      label: "Paramètres IA",
      description: "Configurer les modèles",
      icon: Bot,
      href: "/admin/settings",
      ocid: "admin_dashboard.nav_settings"
    },
    {
      label: "Suivi des Apprenants",
      description: "Progression des étudiants",
      icon: GraduationCap,
      href: "/admin/learners",
      ocid: "admin_dashboard.nav_learners"
    },
    {
      label: "Domaines VIP",
      description: "Catégories de formation",
      icon: Crown,
      href: "/admin/domains",
      ocid: "admin_dashboard.nav_domains"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", "data-ocid": "admin_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Administration" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground", children: "Tableau de bord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Ministère de la Formation Professionnelle — République Démocratique du Congo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-2",
          onClick: () => window.location.reload(),
          "data-ocid": "admin_dashboard.refresh_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5" }),
            "Actualiser"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: isLoading ? ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {}, k)) : stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-border shadow-card hover:shadow-elevated transition-smooth",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 px-5 pb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `size-4 ${stat.color}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-foreground font-display", children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mt-0.5", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.sub })
        ] })
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground mb-3", children: "Accès rapide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center justify-between p-4 rounded-xl border transition-smooth text-left ${action.urgent ? "border-destructive/40 bg-destructive/5 hover:bg-destructive/10" : "border-border bg-card hover:bg-muted/40"}`,
          onClick: () => navigate({ to: action.href }),
          "data-ocid": action.ocid,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-lg flex items-center justify-center ${action.urgent ? "bg-destructive/15" : "bg-primary/10"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    action.icon,
                    {
                      className: `size-4 ${action.urgent ? "text-destructive" : "text-primary"}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: action.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: action.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground shrink-0" })
          ]
        },
        action.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AIModelSettingsPanel, {}),
    inactivityNotifCount > 0,
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_dashboard.recent_generations", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-accent" }),
          "Activité récente — Générations IA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "text-xs text-muted-foreground gap-1",
            onClick: () => navigate({ to: "/admin/generations" }),
            "data-ocid": "admin_dashboard.view_all_generations",
            children: [
              "Tout voir ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 space-y-3", children: ["x", "y", "z"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-lg shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3/4 mb-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
      ] }, k)) }) : generations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 text-muted-foreground text-sm",
          "data-ocid": "admin_dashboard.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-8 mx-auto mb-2 opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune génération de cours pour le moment." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: generations.slice(0, 5).map((gen, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors duration-150",
          "data-ocid": `admin_dashboard.generation_item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: gen.requestDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: GEN_STATUS_VARIANT[gen.status],
                className: "ml-2 shrink-0 text-xs",
                children: GEN_STATUS_LABELS[gen.status]
              }
            )
          ]
        },
        gen.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_dashboard.resource_overview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileStack, { className: "size-4 text-primary" }),
          "Vue d'ensemble des ressources"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "text-xs text-muted-foreground gap-1",
            onClick: () => navigate({ to: "/admin/resources" }),
            "data-ocid": "admin_dashboard.view_all_resources",
            children: [
              "Gérer ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6", children: ["p", "q", "r"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-24 rounded-lg" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [
        {
          label: "Total",
          value: totalResources,
          color: "text-foreground"
        },
        {
          label: "Indexées",
          value: indexedResources,
          color: "text-primary"
        },
        {
          label: "En attente",
          value: resources.filter((r) => r.status === "pending").length,
          color: "text-accent"
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center p-3 rounded-lg bg-muted/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-bold font-display ${item.color}`,
                children: item.value
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: item.label })
          ]
        },
        item.label
      )) }) })
    ] })
  ] }) }) });
}
export {
  AdminDashboardPage as default
};
