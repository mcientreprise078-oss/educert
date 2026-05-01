import { u as useNavigate, al as useGetAdminModelConfig, am as useSetAdminModelConfig, r as reactExports, j as jsxRuntimeExports, L as Layout, e as Button, h as ue } from "./index-Duog9_D-.js";
import { A as AdminGuard } from "./AdminGuard-B7BbpzcT.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-CITtkol-.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CsimE72L.js";
import { S as Skeleton } from "./skeleton-Cm0MP4Fa.js";
import { A as ArrowLeft } from "./arrow-left-i8gNnilk.js";
import { Z as Zap } from "./zap-CXJRp80N.js";
import { C as ChevronRight } from "./chevron-right-BMWJH4n-.js";
import { B as Bot } from "./bot-_5rZeXyZ.js";
import { S as Save } from "./save-V_sXbNby.js";
import "./index-hu8YwLkp.js";
import "./chevron-up-mwtev3bb.js";
const STRUCTURE_MODEL_OPTIONS = [
  {
    value: "DeepSeek R1",
    label: "DeepSeek R1",
    description: "Idéal pour la structuration pédagogique"
  },
  {
    value: "Qwen 72B",
    label: "Qwen 72B",
    description: "Multilingue, fort en raisonnement"
  },
  {
    value: "Claude Opus",
    label: "Claude Opus",
    description: "Haute précision analytique"
  }
];
const CONTENT_MODEL_OPTIONS = [
  {
    value: "Qwen 72B",
    label: "Qwen 72B",
    description: "Excellent en français, fluide"
  },
  {
    value: "DeepSeek R1",
    label: "DeepSeek R1",
    description: "Riche en détails techniques"
  },
  {
    value: "Claude Sonnet",
    label: "Claude Sonnet",
    description: "Style naturel et pédagogique"
  }
];
const VALIDATION_MODEL_OPTIONS = [
  {
    value: "GPT-4o",
    label: "GPT-4o",
    description: "Validation rapide et précise"
  },
  {
    value: "Claude Opus",
    label: "Claude Opus",
    description: "Révision approfondie"
  },
  { value: "GPT-5", label: "GPT-5", description: "Dernière génération OpenAI" },
  {
    value: "Claude Sonnet",
    label: "Claude Sonnet",
    description: "Équilibre vitesse/qualité"
  }
];
function ModelSelect({
  label,
  description,
  step,
  value,
  options,
  onChange,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: step }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: onChange, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: opt.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: opt.description })
      ] }) }, opt.value)) })
    ] })
  ] });
}
function AdminSettingsPage() {
  const navigate = useNavigate();
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
  const hasChanges = config && (config.structureModel !== local.structureModel || config.contentModel !== local.contentModel || config.validationModel !== local.validationModel);
  const handleSave = () => {
    setConfig.mutate(local, {
      onSuccess: () => ue.success("Configuration des modèles IA enregistrée"),
      onError: () => ue.error("Erreur lors de l'enregistrement")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { adminOnly: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto space-y-6",
      "data-ocid": "admin_settings.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "size-9",
              onClick: () => navigate({ to: "/admin" }),
              "data-ocid": "admin_settings.back_button",
              "aria-label": "Retour au tableau de bord",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Paramètres IA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Configurez les modèles d'intelligence artificielle utilisés pour générer les cours" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-xs flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Flux de génération séquentiel" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium", children: "1. Structure" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium", children: "2. Contenu (FR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium", children: "3. Validation" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_settings.model_config_card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "size-4 text-accent" }),
              "Configurer les modèles IA"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Chaque étape de génération utilise un modèle distinct. Choisissez le modèle le mieux adapté à chaque rôle." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" })
          ] }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ModelSelect,
              {
                label: "Modèle de structure",
                description: "Génère le plan pédagogique, les modules et les objectifs d'apprentissage",
                step: "1",
                value: local.structureModel,
                options: STRUCTURE_MODEL_OPTIONS,
                onChange: (v) => setLocal({ ...local, structureModel: v }),
                ocid: "admin_settings.structure_model_select"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ModelSelect,
              {
                label: "Modèle de contenu",
                description: "Rédige les leçons, exercices et quiz en français à partir des ressources",
                step: "2",
                value: local.contentModel,
                options: CONTENT_MODEL_OPTIONS,
                onChange: (v) => setLocal({ ...local, contentModel: v }),
                ocid: "admin_settings.content_model_select"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ModelSelect,
              {
                label: "Modèle de validation",
                description: "Valide la cohérence pédagogique et approuve le cours avant publication",
                step: "3",
                value: local.validationModel,
                options: VALIDATION_MODEL_OPTIONS,
                onChange: (v) => setLocal({ ...local, validationModel: v }),
                ocid: "admin_settings.validation_model_select"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
          hasChanges ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent font-medium", children: "• Modifications non enregistrées" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Configuration actuelle en cours d'utilisation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: setConfig.isPending || isLoading,
              className: "gap-2",
              "data-ocid": "admin_settings.save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
                setConfig.isPending ? "Enregistrement..." : "Enregistrer la configuration"
              ]
            }
          )
        ] })
      ]
    }
  ) }) });
}
export {
  AdminSettingsPage as default
};
