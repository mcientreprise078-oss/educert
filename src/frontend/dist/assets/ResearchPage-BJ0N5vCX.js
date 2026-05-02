import { c as createLucideIcon, r as reactExports, aJ as useSendResearchMessage, aK as useValidateResearchStep, aL as RESEARCH_STEP_ORDER, j as jsxRuntimeExports, B as Badge, aM as RESEARCH_STEP_LABELS, G as GraduationCap, a1 as LoaderCircle, e as Button, h as ue, q as cn, aN as useListMyResearchProjects, aO as useGetResearchProject, aP as useCreateResearchProject, L as Layout, au as FileText, v as BookOpen, t as Clock, aQ as RESEARCH_STATUS_LABELS, ad as Label, I as Input, aR as useSearchWorldLibraries } from "./index-D09cs5UV.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { C as CircleCheck } from "./circle-check-DuoBvN5I.js";
import { m as motion, A as AnimatePresence } from "./proxy-Bw2IqH6w.js";
import { S as Send } from "./send-C8jMAb4x.js";
import { C as ChevronRight } from "./chevron-right-DTTFnz_N.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { P as Progress } from "./progress-DYV8D1s7.js";
import { P as Plus } from "./plus-Ca2hIDM0.js";
import "./x-DU9MTTQ_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 2v8l3-3 3 3V2", key: "sqw3rj" }],
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ]
];
const BookMarked = createLucideIcon("book-marked", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 22v-4a2 2 0 1 0-4 0v4", key: "hhkicm" }],
  [
    "path",
    {
      d: "m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10",
      key: "1xqip1"
    }
  ],
  ["path", { d: "M18 5v17", key: "1sw6gf" }],
  ["path", { d: "m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6", key: "9d2mlk" }],
  ["path", { d: "M6 5v17", key: "1xfsm0" }],
  ["circle", { cx: "12", cy: "9", r: "2", key: "1092wv" }]
];
const School = createLucideIcon("school", __iconNode);
const STEP_PLACEHOLDERS = {
  sujet: "Décrivez votre sujet de recherche (domaine, contexte, intérêt scientifique)…",
  problematique: "Quelle est la question centrale de votre recherche ? Pourquoi ce problème mérite-t-il d'être étudié ?",
  hypotheses: "Formulez vos hypothèses de travail. Que pensez-vous trouver comme résultats ?",
  methodologie: "Décrivez votre approche : qualitative, quantitative ou mixte ? Quels outils de collecte ?",
  plan: "Votre plan est généré automatiquement. Validez pour accéder à la rédaction finale.",
  redaction: "Demandez à l'IA de développer une section, ou posez des questions sur votre rédaction…"
};
const STEP_DESCRIPTIONS = {
  sujet: "Présentez votre sujet à votre Directeur de Recherche IA. Il vous aidera à le délimiter et valider scientifiquement.",
  problematique: "Formulez la question centrale. L'IA vérifie sa pertinence et sa conformité aux normes académiques.",
  hypotheses: "Proposez vos hypothèses. Votre Directeur les évaluera et vous orientera sur leur validité scientifique.",
  methodologie: "Décrivez votre approche. L'IA valide la cohérence avec votre problématique et vos objectifs.",
  plan: "L'IA génère un plan détaillé basé sur vos échanges. Validez-le pour commencer la rédaction.",
  redaction: "Phase de rédaction assistée. L'IA vous aide à développer chaque section avec rigueur académique."
};
function StepTabButton({
  step,
  idx,
  isCurrent,
  isValidated,
  isLocked,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled: isLocked,
      "data-ocid": `research.step_tab.${idx + 1}`,
      className: cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-smooth flex-1 min-w-0 disabled:cursor-not-allowed",
        isValidated && "text-primary bg-primary/5",
        isCurrent && !isValidated && "text-foreground bg-accent/10",
        isLocked && "text-muted-foreground/40",
        !isValidated && !isCurrent && !isLocked && "text-muted-foreground hover:bg-muted/50"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-7 h-7 rounded-full flex items-center justify-center",
              isValidated && "bg-primary text-primary-foreground",
              isCurrent && !isValidated && "bg-accent text-accent-foreground ring-2 ring-accent/30",
              isLocked && "bg-muted text-muted-foreground/30",
              !isValidated && !isCurrent && !isLocked && "bg-secondary text-secondary-foreground"
            ),
            children: isValidated ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }) : idx + 1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate w-full text-center leading-tight", children: RESEARCH_STEP_LABELS[step] })
      ]
    }
  );
}
function ResearchStepPanel({
  project
}) {
  const [viewingStep, setViewingStep] = reactExports.useState(
    project.currentStep
  );
  const [userInput, setUserInput] = reactExports.useState("");
  const [isSending, setIsSending] = reactExports.useState(false);
  const sendMessage = useSendResearchMessage();
  const validateStep = useValidateResearchStep();
  const currentStepIdx = RESEARCH_STEP_ORDER.indexOf(
    project.currentStep
  );
  const viewingStepIdx = RESEARCH_STEP_ORDER.indexOf(
    viewingStep
  );
  const validatedSteps = new Set(
    project.steps.filter(([, sd]) => sd.validated).map(([s]) => s)
  );
  const stepDataMap = new Map(
    project.steps.map(([step, data]) => [step, data])
  );
  const viewingStepData = stepDataMap.get(viewingStep) ?? {
    content: "",
    aiResponse: "",
    resources: []
  };
  const isViewingCurrent = viewingStep === project.currentStep;
  const isViewingValidated = validatedSteps.has(viewingStep);
  const isViewingLocked = viewingStepIdx > currentStepIdx && !isViewingValidated;
  const hasAiResponse = !!viewingStepData.aiResponse;
  const canValidate = isViewingCurrent && hasAiResponse && !isViewingValidated;
  const handleSend = () => {
    if (!userInput.trim() || sendMessage.isPending) return;
    setIsSending(true);
    sendMessage.mutate(
      {
        projectId: String(project.id),
        step: viewingStep,
        userInput: userInput.trim()
      },
      {
        onSuccess: () => {
          setUserInput("");
          setIsSending(false);
          ue.success("Réponse reçue de votre Directeur de Recherche IA");
        },
        onError: () => {
          setIsSending(false);
          ue.error("Erreur lors de l'envoi du message");
        }
      }
    );
  };
  const handleValidate = () => {
    validateStep.mutate(
      { projectId: String(project.id), step: viewingStep },
      {
        onSuccess: (result) => {
          setViewingStep(result.currentStep);
          ue.success(
            `Étape « ${RESEARCH_STEP_LABELS[viewingStep]} » validée !`
          );
        },
        onError: () => ue.error("Erreur lors de la validation")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border shadow-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: RESEARCH_STEP_ORDER.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      StepTabButton,
      {
        step,
        idx,
        isCurrent: step === project.currentStep,
        isValidated: validatedSteps.has(step),
        isLocked: idx > currentStepIdx && !validatedSteps.has(step),
        onClick: () => {
          if (idx <= currentStepIdx || validatedSteps.has(step)) {
            setViewingStep(step);
            setUserInput("");
          }
        }
      },
      step
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: isViewingLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "research.step.locked_state",
        className: "py-12 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-muted mx-auto flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Étape verrouillée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Validez les étapes précédentes pour débloquer cette section." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs font-mono", children: [
            "Étape ",
            viewingStepIdx + 1,
            " / 6"
          ] }),
          isViewingValidated && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary text-xs border-0 gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
            "Validée"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-display font-bold text-foreground", children: [
          "Étape ",
          viewingStepIdx + 1,
          " : ",
          RESEARCH_STEP_LABELS[viewingStep]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed", children: STEP_DESCRIPTIONS[viewingStep] })
      ] }),
      hasAiResponse && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          "data-ocid": "research.step.ai_response",
          className: "rounded-xl border-2 border-primary/20 bg-primary/3 p-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 pb-3 border-b border-primary/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full gradient-ministry flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-5 h-5 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Prof. IA — Directeur de Recherche" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "EDUCERT · Académie Scientifique Officielle" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-primary/10 text-primary border-0 text-xs", children: "Académique" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-line", children: viewingStepData.aiResponse })
          ]
        }
      ),
      isSending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "research.step.loading_state",
          className: "rounded-xl border bg-muted/30 p-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 text-primary animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Analyse en cours…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Votre Directeur de Recherche IA examine votre contribution" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" })
            ] })
          ]
        }
      ),
      isViewingCurrent && !isViewingValidated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            "data-ocid": "research.step.input",
            placeholder: STEP_PLACEHOLDERS[viewingStep],
            value: userInput,
            onChange: (e) => setUserInput(e.target.value),
            rows: 4,
            disabled: sendMessage.isPending,
            className: "resize-none"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSend,
              disabled: !userInput.trim() || sendMessage.isPending,
              "data-ocid": "research.step.send_button",
              className: "gap-2",
              children: sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                "Analyse en cours…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
                "Soumettre à l'IA Directeur"
              ] })
            }
          ),
          canValidate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleValidate,
              disabled: validateStep.isPending,
              "data-ocid": "research.step.validate_button",
              className: "gap-2 border-primary text-primary hover:bg-primary/5",
              children: [
                validateStep.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                "Valider cette étape",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] }),
      isViewingValidated && viewingStepData.content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Votre réponse validée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: viewingStepData.content })
      ] }),
      (viewingStepData.resources.length > 0 || project.resourceCitations.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "research.step.resources_panel",
          className: "rounded-xl border bg-accent/5 border-accent/20 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "w-4 h-4 text-accent-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Sources citées par l'IA" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: [
              .../* @__PURE__ */ new Set([
                ...viewingStepData.resources,
                ...project.resourceCitations
              ])
            ].map((citation) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-accent-foreground/40 shrink-0 mt-1.5" }),
                  citation
                ]
              },
              citation
            )) })
          ]
        }
      )
    ] }) })
  ] });
}
const STATUS_COLORS = {
  draft: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-chart-3/10 text-chart-3"
};
const RESEARCH_TYPE_LABELS = {
  tfc: "TFC",
  memoire: "Mémoire",
  these: "Thèse"
};
const RESEARCH_TYPE_DESCRIPTIONS = {
  tfc: "Travail de Fin de Cycle (Licence)",
  memoire: "Mémoire de fin d’études (Master)",
  these: "Thèse de Doctorat"
};
const RESEARCH_TYPES = ["tfc", "memoire", "these"];
function getStepProgress(project) {
  const validated = project.steps.filter(([, sd]) => sd.validated).length;
  return Math.round(validated / 6 * 100);
}
function VerticalStepSidebar({ project }) {
  const currentIdx = RESEARCH_STEP_ORDER.indexOf(
    project.currentStep
  );
  const validatedSteps = new Set(
    project.steps.filter(([, sd]) => sd.validated).map(([s]) => s)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0", children: RESEARCH_STEP_ORDER.map((step, idx) => {
    const isValidated = validatedSteps.has(step);
    const isCurrent = idx === currentIdx;
    const isLocked = idx > currentIdx && !isValidated;
    const isLast = idx === RESEARCH_STEP_ORDER.length - 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-smooth",
              isValidated && "bg-primary text-primary-foreground",
              isCurrent && !isValidated && "bg-accent text-accent-foreground ring-2 ring-accent/30",
              isLocked && "bg-muted text-muted-foreground/50",
              !isValidated && !isCurrent && !isLocked && "bg-secondary text-secondary-foreground"
            ),
            children: isValidated ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }) : isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }) : idx + 1
          }
        ),
        !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-0.5 flex-1 my-1 min-h-[20px] rounded-full",
              isValidated ? "bg-primary/40" : "bg-border"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("pb-4 flex-1 min-w-0", isLast && "pb-0"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: cn(
              "text-xs font-semibold leading-tight",
              isValidated && "text-primary",
              isCurrent && !isValidated && "text-foreground",
              isLocked && "text-muted-foreground/50",
              !isValidated && !isCurrent && !isLocked && "text-muted-foreground"
            ),
            children: RESEARCH_STEP_LABELS[step]
          }
        ),
        isValidated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/70 mt-0.5", children: "Validée ✓" }),
        isCurrent && !isValidated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent mt-0.5", children: "En cours" }),
        isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/40 mt-0.5", children: "Verrouillée" })
      ] })
    ] }, step);
  }) });
}
function RecommendedResources({ topic }) {
  const { data: results = [], isLoading } = useSearchWorldLibraries(
    topic.length >= 5 ? { query: topic } : null
  );
  if (!topic || topic.length < 5) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card rounded-xl border shadow-card p-4 space-y-3",
      "data-ocid": "research.recommended_resources_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Ressources recommandées" }),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: "Recherche…" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }) : results.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: results.slice(0, 4).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: r.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-smooth group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors", children: r.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  r.author,
                  r.year ? ` · ${r.year}` : "",
                  " · ",
                  r.source
                ] })
              ] })
            ]
          },
          r.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bibliothèques consultées automatiquement lors de chaque étape." })
      ]
    }
  );
}
function ProjectCard({
  project,
  isSelected,
  onClick,
  index
}) {
  const progress = getStepProgress(project);
  const currentStepLabel = RESEARCH_STEP_LABELS[project.currentStep] ?? project.currentStep;
  const typeLabel = project.researchType ? RESEARCH_TYPE_LABELS[project.researchType] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `research.item.${index}`,
      onClick,
      className: cn(
        "w-full text-left p-3 rounded-lg border transition-smooth hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected ? "border-primary bg-primary/5" : "border-border bg-card"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground line-clamp-2 flex-1", children: project.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
            typeLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs h-4 px-1.5", children: typeLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: cn("text-xs", STATUS_COLORS[project.status]),
                children: RESEARCH_STATUS_LABELS[project.status]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: currentStepLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          progress,
          "% complété"
        ] })
      ]
    }
  );
}
function ResearchPage() {
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newType, setNewType] = reactExports.useState("tfc");
  const [newDomain, setNewDomain] = reactExports.useState("");
  const [newInstitution, setNewInstitution] = reactExports.useState("");
  const [newDirector, setNewDirector] = reactExports.useState("");
  const { data: projects, isLoading } = useListMyResearchProjects();
  const { data: selectedProject, isLoading: isLoadingProject } = useGetResearchProject(selectedId ? String(selectedId) : "");
  const createMutation = useCreateResearchProject();
  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate(
      {
        title: newTitle.trim(),
        researchType: newType,
        domain: newDomain.trim() || void 0,
        institution: newInstitution.trim() || void 0,
        directorName: newDirector.trim() || void 0
      },
      {
        onSuccess: (project) => {
          setSelectedId(project.id);
          setNewTitle("");
          setNewDomain("");
          setNewInstitution("");
          setNewDirector("");
          setShowCreate(false);
        }
      }
    );
  };
  const currentProject = selectedProject ?? (projects == null ? void 0 : projects.find((p) => p.id === selectedId)) ?? null;
  const progress = currentProject ? getStepProgress(currentProject) : 0;
  const currentStepIdx = currentProject ? RESEARCH_STEP_ORDER.indexOf(
    currentProject.currentStep
  ) : -1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-5 h-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Recherche Scientifique" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Réalisez votre TFC, Mémoire ou Thèse guidé par l'IA Directeur de Recherche" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowCreate(true),
          className: "ml-auto gap-2",
          "data-ocid": "research.new_project_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Nouveau projet"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !isLoading && (!projects || projects.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          className: "bg-card rounded-2xl border shadow-card p-12 text-center max-w-xl mx-auto",
          "data-ocid": "research.main.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl gradient-ministry mx-auto flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-10 h-10 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold text-foreground mb-3", children: "Votre Directeur de Recherche IA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4 leading-relaxed", children: "Notre IA vous accompagne de A à Z dans la rédaction de votre travail scientifique avec une méthodologie stricte en 6 étapes verrouillées." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-3 mb-6", children: RESEARCH_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 border border-border min-w-[80px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "w-5 h-5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: RESEARCH_TYPE_LABELS[t] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground text-center leading-tight", children: RESEARCH_TYPE_DESCRIPTIONS[t].split(" (")[0] })
                ]
              },
              t
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-center mb-2", children: [
              "Sujet",
              "Problématique",
              "Hypothèses",
              "Méthodologie",
              "Plan",
              "Rédaction"
            ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground", children: step }),
              i < 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5 text-muted-foreground" })
            ] }, step)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Chaque étape est verrouillée jusqu'à validation par l'IA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                onClick: () => setShowCreate(true),
                "data-ocid": "research.start_button",
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Démarrer ma recherche"
                ]
              }
            )
          ]
        },
        "empty"
      ) }),
      (isLoading || projects && projects.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border shadow-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Mes Projets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setShowCreate(true),
                className: "h-7 gap-1 text-xs",
                "data-ocid": "research.sidebar_new_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Nouveau"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }, i)) }) : (projects == null ? void 0 : projects.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "research.projects.empty_state",
              className: "py-8 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Aucun projet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "link",
                    onClick: () => setShowCreate(true),
                    className: "text-xs mt-1",
                    children: "Créer"
                  }
                )
              ]
            }
          ) : projects == null ? void 0 : projects.map((project, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectCard,
            {
              project,
              isSelected: selectedId === project.id,
              onClick: () => setSelectedId(project.id),
              index: idx + 1
            },
            project.id.toString()
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { children: !currentProject && !isLoadingProject ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "research.workspace.empty_state",
            className: "bg-card rounded-xl border shadow-card p-12 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-foreground mb-2", children: "Sélectionnez un projet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Choisissez un projet dans la liste pour ouvrir votre espace de travail." })
            ]
          }
        ) : isLoadingProject ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" })
        ] }) : currentProject ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border shadow-card p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                  currentProject.researchType && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: RESEARCH_TYPE_LABELS[currentProject.researchType] }),
                  currentProject.domain && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: currentProject.domain })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground truncate", children: currentProject.title }),
                currentProject.institution && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  currentProject.institution,
                  currentProject.directorName ? ` — Dir. ${currentProject.directorName}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Étape ",
                    currentStepIdx + 1,
                    " sur 6 —",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: RESEARCH_STEP_LABELS[currentProject.currentStep] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: cn(
                        "text-xs",
                        STATUS_COLORS[currentProject.status]
                      ),
                      children: RESEARCH_STATUS_LABELS[currentProject.status]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-primary shrink-0", children: [
                progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              currentProject.steps.filter(([, sd]) => sd.validated).length,
              " ",
              "étape",
              currentProject.steps.filter(([, sd]) => sd.validated).length !== 1 ? "s" : "",
              " ",
              "validée",
              currentProject.steps.filter(([, sd]) => sd.validated).length !== 1 ? "s" : "",
              " ",
              "sur 6"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResearchStepPanel, { project: currentProject })
        ] }) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "space-y-4", children: currentProject && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border shadow-card p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4", children: "Progression" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalStepSidebar, { project: currentProject })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecommendedResources,
            {
              topic: `${currentProject.title} ${currentProject.domain ?? ""}`
            }
          )
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showCreate, onOpenChange: setShowCreate, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg",
        "data-ocid": "research.create_project.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary" }),
            "Nouveau Projet de Recherche"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold mb-2 block", children: [
                "Type de travail ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: RESEARCH_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setNewType(t),
                  "data-ocid": `research.create_project.type.${t}`,
                  className: cn(
                    "p-3 rounded-lg border text-center transition-smooth",
                    newType === t ? "bg-primary/5 border-primary/40 text-primary" : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: RESEARCH_TYPE_LABELS[t] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5 leading-tight", children: RESEARCH_TYPE_DESCRIPTIONS[t].split(" (")[0] })
                  ]
                },
                t
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "research-title",
                  className: "text-sm font-semibold mb-1.5 block",
                  children: [
                    "Titre de votre travail",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "research-title",
                  "data-ocid": "research.create_project.input",
                  placeholder: "Ex: Impact de la numérisation sur les PME en RDC",
                  value: newTitle,
                  onChange: (e) => setNewTitle(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && !createMutation.isPending && handleCreate(),
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "research-domain",
                    className: "text-sm font-medium mb-1.5 block",
                    children: "Filière / Domaine"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "research-domain",
                    placeholder: "ex: Sciences économiques",
                    value: newDomain,
                    onChange: (e) => setNewDomain(e.target.value),
                    "data-ocid": "research.create_project.domain_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "research-institution",
                    className: "text-sm font-medium mb-1.5 block",
                    children: "Institution"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "research-institution",
                    placeholder: "ex: UNIKIN, ISP…",
                    value: newInstitution,
                    onChange: (e) => setNewInstitution(e.target.value),
                    "data-ocid": "research.create_project.institution_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "research-director",
                  className: "text-sm font-medium mb-1.5 block",
                  children: "Nom du directeur"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "research-director",
                  placeholder: "ex: Prof. Dr. Jean-Pierre Mutombo",
                  value: newDirector,
                  onChange: (e) => setNewDirector(e.target.value),
                  "data-ocid": "research.create_project.director_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setShowCreate(false),
                "data-ocid": "research.create_project.cancel_button",
                children: "Annuler"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleCreate,
                disabled: !newTitle.trim() || createMutation.isPending,
                "data-ocid": "research.create_project.confirm_button",
                children: createMutation.isPending ? "Création..." : "Créer le projet"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  ResearchPage as default
};
