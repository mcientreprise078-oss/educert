import { c as createLucideIcon, r as reactExports, u as useNavigate, aF as useRequestGeneration, aG as useListMyGenerations, aH as useGetGenerationStatus, ar as useGetAdminModelConfig, aI as useSearchYouTubeVideos, j as jsxRuntimeExports, L as Layout, aq as Sparkles, ad as Label, I as Input, v as BookOpen, au as FileText, h as ue, e as Button, a1 as LoaderCircle, B as Badge, t as Clock, a2 as ArrowRight } from "./index-D09cs5UV.js";
import { C as Card, a as CardContent, b as CardHeader } from "./card-BocCJxur.js";
import { C as Checkbox, V as Video } from "./checkbox-DS8TOOaW.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { m as motion, A as AnimatePresence } from "./proxy-Bw2IqH6w.js";
import { C as ChevronRight } from "./chevron-right-DTTFnz_N.js";
import { Y as Youtube, G as Globe } from "./youtube-Bu8RbQtc.js";
import { U as Upload } from "./upload-D7Yo8DgG.js";
import { Z as Zap } from "./zap-CnYYS7ma.js";
import { P as Play } from "./play-B9_PUdmR.js";
import { P as Plus } from "./plus-Ca2hIDM0.js";
import { C as CircleX } from "./circle-x-Bb-Z_XDj.js";
import { R as RefreshCw } from "./refresh-cw-BsHLDkRb.js";
import { C as CircleCheck } from "./circle-check-DuoBvN5I.js";
import "./index-CG-zuoud.js";
import "./check-CCiK2Afk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 6 4 14", key: "ji33uf" }],
  ["path", { d: "M12 6v14", key: "1n7gus" }],
  ["path", { d: "M8 8v12", key: "1gg7y9" }],
  ["path", { d: "M4 4v16", key: "6qkkli" }]
];
const Library = createLucideIcon("library", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const SUGGESTION_CHIPS = [
  "Comptabilité pour PME selon les normes OHADA",
  "TFC sur la gestion des ressources humaines en RDC",
  "Entrepreneuriat numérique pour les jeunes de Kinshasa",
  "Techniques agricoles modernes pour les régions tropicales",
  "Droit du travail en République Démocratique du Congo",
  "Marketing digital et e-commerce pour entrepreneurs congolais"
];
const TERMINAL = [
  "approved",
  "rejected",
  "revision_needed"
];
const STATUS_LABELS = {
  queued: "En attente",
  step1_deepseek: "Structure en cours",
  step2_qwen: "Rédaction en cours",
  step3_gpt4o: "Validation en cours",
  approved: "Approuvé",
  rejected: "Rejeté",
  revision_needed: "Révision requise"
};
const MODEL_PRESETS = [
  {
    id: "default",
    label: "DeepSeek + Qwen + GPT-4o",
    description: "Configuration par défaut recommandée",
    config: {
      structureModel: "DeepSeek R1",
      contentModel: "Qwen 72B",
      validationModel: "GPT-4o"
    }
  },
  {
    id: "advanced",
    label: "Claude + GPT-5 + Gemini",
    description: "Modèles avancés pour contenus complexes",
    config: {
      structureModel: "Claude Opus",
      contentModel: "GPT-5",
      validationModel: "Gemini Flash"
    }
  },
  {
    id: "fast",
    label: "DeepSeek + Gemini + GPT-4o",
    description: "Génération rapide avec analyse documentaire",
    config: {
      structureModel: "DeepSeek R1",
      contentModel: "Gemini Flash",
      validationModel: "GPT-4o"
    }
  }
];
const SOURCES = [
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    description: "Vidéos pédagogiques"
  },
  {
    id: "open_library",
    label: "Bibliothèque Ouverte",
    icon: BookOpen,
    description: "Livres en accès libre"
  },
  {
    id: "google_books",
    label: "Google Livres",
    icon: FileText,
    description: "Millions de livres"
  },
  {
    id: "google_docs",
    label: "Google Docs",
    icon: Globe,
    description: "Documents partagés"
  }
];
function getStepState(stepIdx, gen) {
  const order = [
    "queued",
    "step1_deepseek",
    "step2_qwen",
    "step3_gpt4o",
    "approved"
  ];
  if (gen.status === "approved") return "done";
  if (gen.status === "rejected") return stepIdx === 0 ? "active" : "idle";
  if (gen.status === "revision_needed") return "done";
  const idx = order.indexOf(gen.status);
  if (idx > stepIdx + 1) return "done";
  if (idx === stepIdx + 1) return "active";
  return "idle";
}
function YouTubeCard({
  video,
  onAdd
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-smooth group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: video.thumbnailUrl,
          alt: video.title,
          className: "w-full h-full object-cover",
          onError: (e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='64'%3E%3Crect width='112' height='64' fill='%23e5e7eb'/%3E%3C/svg%3E";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-black/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3 text-white fill-white ml-0.5" }) }) }),
      video.duration && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 right-1 text-xs bg-black/80 text-white px-1 rounded", children: video.duration })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground line-clamp-2 leading-snug", children: video.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: video.channelTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2 h-6 text-xs px-2 border-primary/30 text-primary hover:bg-primary/5",
          onClick: () => onAdd(video),
          "data-ocid": "generate_course.video_add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5 mr-1" }),
            "Intégrer dans le cours"
          ]
        }
      )
    ] })
  ] });
}
function PipelineStep({
  stepNum,
  label,
  model,
  description,
  state,
  isLast
}) {
  const colors = [
    {
      color: "text-primary",
      bg: "bg-primary",
      bgLight: "bg-primary/10 border-primary/30",
      bgDone: "bg-primary/5 border-primary/10"
    },
    {
      color: "text-accent",
      bg: "bg-accent",
      bgLight: "bg-accent/10 border-accent/30",
      bgDone: "bg-accent/5 border-accent/10"
    },
    {
      color: "text-chart-3",
      bg: "bg-chart-3",
      bgLight: "bg-chart-3/10 border-chart-3/30",
      bgDone: "bg-chart-3/5 border-chart-3/10"
    }
  ][stepNum - 1] ?? {
    color: "text-primary",
    bg: "bg-primary",
    bgLight: "bg-primary/10 border-primary/30",
    bgDone: "bg-primary/5 border-primary/10"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", "data-ocid": `generate_course.step.${stepNum}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${state === "done" ? `${colors.bg} text-primary-foreground border-transparent` : state === "active" ? `${colors.bg} text-primary-foreground border-transparent ring-4 ring-primary/20` : "bg-muted text-muted-foreground border-border"}`,
          children: state === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) : state === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 opacity-40" })
        }
      ),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-0.5 flex-1 my-1.5 rounded-full min-h-[2rem] transition-all duration-500 ${state === "done" ? `${colors.bg}/40` : "bg-border"}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `flex-1 p-3.5 rounded-xl border mb-3 transition-all duration-500 ${state === "active" ? colors.bgLight : state === "done" ? colors.bgDone : "bg-muted/20 border-transparent"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-xs font-bold uppercase tracking-widest ${state !== "idle" ? colors.color : "text-muted-foreground"}`,
                  children: [
                    "Étape ",
                    stepNum
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-semibold ${state !== "idle" ? colors.color : "text-muted-foreground"}`,
                  children: model
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: description })
          ] }),
          state === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary shrink-0 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
            "En cours"
          ] }),
          state === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs font-medium px-2 py-0.5 rounded-full ${colors.color} bg-current/10 shrink-0 mt-0.5`,
              children: "✓ Terminé"
            }
          )
        ] })
      }
    )
  ] });
}
function CoursePreviewSection({ gen }) {
  const preview = gen.generatedPreview;
  if (!preview) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2 },
      className: "space-y-4",
      "data-ocid": "generate_course.preview_section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Aperçu du cours généré" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/3 p-4 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: preview.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: preview.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: preview.chapters.map((chapter) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border bg-card overflow-hidden",
            "data-ocid": `generate_course.chapter.${chapter.number}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-muted/40 border-b", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0", children: chapter.number }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground flex-1", children: chapter.title }),
                chapter.videoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-3" }),
                  "Vidéo"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 space-y-1.5", children: chapter.lessons.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2 text-xs text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center shrink-0 mt-0.5", children: i + 1 }),
                    lesson
                  ]
                },
                lesson
              )) }),
              chapter.videoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "size-3 text-destructive" }),
                  "Vidéo intégrée dans ce chapitre"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg overflow-hidden border border-border aspect-video", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "iframe",
                  {
                    src: `https://www.youtube.com/embed/${chapter.videoId}`,
                    title: chapter.title,
                    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    allowFullScreen: true,
                    className: "w-full h-full",
                    loading: "lazy"
                  }
                ) })
              ] })
            ]
          },
          chapter.number
        )) })
      ]
    }
  );
}
function GenerationPipeline({
  gen,
  config,
  onNewGeneration,
  onStartLearning
}) {
  const cfg = gen.aiModelConfig ?? config;
  const steps = [
    {
      stepNum: 1,
      label: "Structure du cours",
      model: cfg.structureModel,
      description: "Analyse des ressources et architecture pédagogique"
    },
    {
      stepNum: 2,
      label: "Rédaction des leçons en français",
      model: cfg.contentModel,
      description: "Contenu des leçons rédigé en français académique"
    },
    {
      stepNum: 3,
      label: "Validation pédagogique",
      model: cfg.validationModel,
      description: "Vérification de la cohérence et qualité ministérielle"
    }
  ];
  const isApproved = gen.status === "approved";
  const isRejected = gen.status === "rejected";
  const isRevision = gen.status === "revision_needed";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: "space-y-5",
      "data-ocid": "generate_course.pipeline_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: "Formation demandée" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-relaxed line-clamp-3", children: gen.requestDescription })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: isApproved ? "default" : isRejected ? "destructive" : "secondary",
                className: "shrink-0",
                children: STATUS_LABELS[gen.status]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-3 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [
            gen.resourceIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "size-3" }),
              gen.resourceIds.length,
              " ressource",
              gen.resourceIds.length > 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-3 text-primary" }),
              "Bibliothèques mondiales consultées"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 px-4 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4", children: "Flux de génération IA" }),
          steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PipelineStep,
            {
              ...s,
              state: getStepState(i, gen),
              isLast: i === steps.length - 1
            },
            s.stepNum
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", "data-ocid": "generate_course.step.4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-700 ${isApproved ? "bg-chart-3 text-primary-foreground border-transparent ring-4 ring-chart-3/30" : "bg-muted text-muted-foreground border-border"}`,
                children: isApproved ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { scale: 0 },
                    animate: { scale: 1 },
                    transition: { type: "spring" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 opacity-40" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex-1 p-3.5 rounded-xl border transition-all duration-500 ${isApproved ? "bg-chart-3/8 border-chart-3/30" : "bg-muted/20 border-transparent"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-bold uppercase tracking-widest ${isApproved ? "text-chart-3" : "text-muted-foreground"}`,
                      children: "Étape 4"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Cours prêt !" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Publication et mise à disposition des apprenants" })
                ]
              }
            )
          ] })
        ] }) }),
        gen.status === "queued" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-5 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "En file d'attente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "L'IA commencera l'analyse dans quelques secondes." })
          ] })
        ] }),
        isApproved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            className: "p-5 rounded-xl gradient-ministry text-white space-y-3",
            "data-ocid": "generate_course.success_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: "Votre formation est prête !" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm opacity-90", children: [
                "Validée par ",
                cfg.validationModel,
                " — disponible dans votre espace d'apprentissage."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                gen.generatedCourseId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "bg-white/20 hover:bg-white/30 text-white border-white/30 border",
                    onClick: () => onStartLearning(String(gen.generatedCourseId)),
                    "data-ocid": "generate_course.start_learning_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3.5 mr-1.5" }),
                      "Commencer à apprendre",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 ml-1.5" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "text-white hover:bg-white/20",
                    onClick: onNewGeneration,
                    "data-ocid": "generate_course.new_generation_button",
                    children: "Nouvelle formation"
                  }
                )
              ] })
            ]
          }
        ),
        isRejected && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            className: "p-5 rounded-xl bg-destructive/8 border border-destructive/20 space-y-3",
            "data-ocid": "generate_course.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-5 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Formation non approuvée" })
              ] }),
              gen.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: gen.errorMessage }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: onNewGeneration,
                  className: "border-destructive/30 text-destructive",
                  "data-ocid": "generate_course.retry_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1.5" }),
                    "Affiner et resoumettre"
                  ]
                }
              )
            ]
          }
        ),
        isRevision && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            className: "p-5 rounded-xl bg-accent/8 border border-accent/20 space-y-3",
            "data-ocid": "generate_course.revision_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-5 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Révision nécessaire" })
              ] }),
              gen.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: gen.errorMessage }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: onNewGeneration,
                  className: "border-accent/30 text-accent",
                  "data-ocid": "generate_course.resubmit_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1.5" }),
                    "Modifier et resoumettre"
                  ]
                }
              )
            ]
          }
        ),
        isApproved && /* @__PURE__ */ jsxRuntimeExports.jsx(CoursePreviewSection, { gen })
      ]
    }
  );
}
function GenerateCoursePage() {
  var _a;
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [domain, setDomain] = reactExports.useState("");
  const [chapterCount, setChapterCount] = reactExports.useState(5);
  const [selectedSources, setSelectedSources] = reactExports.useState(
    /* @__PURE__ */ new Set(["open_library", "google_books"])
  );
  const [selectedPreset, setSelectedPreset] = reactExports.useState("default");
  const [activeGenId, setActiveGenId] = reactExports.useState(null);
  const [attachedFile, setAttachedFile] = reactExports.useState(null);
  const [addedVideos, setAddedVideos] = reactExports.useState([]);
  const [showYouTubeSearch, setShowYouTubeSearch] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const navigate = useNavigate();
  const requestGeneration = useRequestGeneration();
  const { data: myGenerations = [] } = useListMyGenerations();
  const { data: activeGenLive } = useGetGenerationStatus(activeGenId ?? "");
  const { data: modelConfig } = useGetAdminModelConfig();
  const youtubeSearch = useSearchYouTubeVideos();
  const defaultConfig = {
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o"
  };
  const config = modelConfig ?? defaultConfig;
  const activeGen = activeGenId ? activeGenLive ?? myGenerations.find((g) => g.id === activeGenId) ?? null : null;
  const showForm = !activeGen || TERMINAL.includes(activeGen.status);
  const youtubeSearchMutate = youtubeSearch.mutate;
  reactExports.useEffect(() => {
    if (selectedSources.has("youtube") && title.trim().length >= 5) {
      setShowYouTubeSearch(true);
      youtubeSearchMutate({ query: title });
    } else {
      setShowYouTubeSearch(false);
    }
  }, [selectedSources, title, youtubeSearchMutate]);
  const toggleSource = (id) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const handleGenerate = () => {
    const trimmedDesc = (title + (description ? ` — ${description}` : "")).trim();
    if (trimmedDesc.length < 10) {
      ue.error("Veuillez saisir un titre ou décrire votre formation.");
      return;
    }
    const preset = MODEL_PRESETS.find((p) => p.id === selectedPreset);
    requestGeneration.mutate(
      {
        description: trimmedDesc,
        title,
        domain,
        chapterCount,
        sources: Array.from(selectedSources),
        modelPreset: selectedPreset
      },
      {
        onSuccess: (gen) => {
          setActiveGenId(gen.id);
          setTitle("");
          setDescription("");
          setDomain("");
          setAttachedFile(null);
          ue.success(
            "Génération lancée — l'IA analyse les sources disponibles.",
            { duration: 4e3 }
          );
        },
        onError: () => ue.error("Erreur lors de la soumission. Réessayez.")
      }
    );
    if (preset) {
      Object.assign(config, preset.config);
    }
  };
  const handleAddVideo = (video) => {
    setAddedVideos((prev) => [
      ...prev.filter((v) => v.videoId !== video.videoId),
      video
    ]);
    ue.success(`Vidéo ajoutée : ${video.title.slice(0, 40)}…`);
  };
  const historyItems = myGenerations.filter((g) => g.id !== activeGenId);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 py-8 space-y-8",
      "data-ocid": "generate_course.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            className: "text-center space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-ministry shadow-elevated mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-8 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground leading-tight", children: "Générer un cours sur mesure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed", children: "Notre IA multi-modèle crée votre formation personnalisée à partir des bibliothèques mondiales, vidéos YouTube et ressources de l'admin." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1", children: [
                config.structureModel,
                config.contentModel,
                config.validationModel
              ].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-semibold", children: m }),
                i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3 text-muted-foreground" })
              ] }, m)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -16 },
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "course-title",
                      className: "text-sm font-semibold mb-1.5 block",
                      children: [
                        "Titre / Sujet du cours",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "course-title",
                      placeholder: "Ex: Comptabilité OHADA pour entrepreneurs en RDC",
                      value: title,
                      onChange: (e) => setTitle(e.target.value),
                      "data-ocid": "generate_course.title_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "course-desc",
                      className: "text-sm font-medium text-muted-foreground mb-1.5 block",
                      children: [
                        "Description détaillée",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "(optionnel)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "course-desc",
                      placeholder: "Décrivez vos attentes, le public cible, le niveau souhaité…",
                      value: description,
                      onChange: (e) => setDescription(e.target.value),
                      rows: 3,
                      className: "resize-none text-sm",
                      "data-ocid": "generate_course.description_textarea"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "course-domain",
                        className: "text-sm font-medium text-muted-foreground mb-1.5 block",
                        children: "Domaine / Profession"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "course-domain",
                        placeholder: "ex: Comptable, Médecin…",
                        value: domain,
                        onChange: (e) => setDomain(e.target.value),
                        "data-ocid": "generate_course.domain_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "chapter-count",
                        className: "text-sm font-medium text-muted-foreground mb-1.5 block",
                        children: "Nombre de chapitres"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "chapter-count",
                        type: "number",
                        min: 3,
                        max: 10,
                        value: chapterCount,
                        onChange: (e) => setChapterCount(Number(e.target.value)),
                        "data-ocid": "generate_course.chapter_count_input"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Sources à consulter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: SOURCES.map((src) => {
                    const Icon = src.icon;
                    const checked = selectedSources.has(src.id);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSource(src.id),
                        "data-ocid": `generate_course.source.${src.id}`,
                        className: `flex items-center gap-2 p-3 rounded-lg border text-left transition-smooth ${checked ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border hover:bg-muted/50"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Checkbox,
                            {
                              checked,
                              onCheckedChange: () => toggleSource(src.id),
                              className: "pointer-events-none",
                              "data-ocid": `generate_course.source_checkbox.${src.id}`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Icon,
                            {
                              className: `size-3.5 shrink-0 ${checked ? "text-primary" : "text-muted-foreground"}`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: `text-xs font-semibold truncate ${checked ? "text-foreground" : "text-muted-foreground"}`,
                                children: src.label
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 truncate", children: src.description })
                          ] })
                        ]
                      },
                      src.id
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Modèles IA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: MODEL_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedPreset(preset.id),
                      "data-ocid": `generate_course.preset.${preset.id}`,
                      className: `w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${selectedPreset === preset.id ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border hover:bg-muted/50"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `w-3 h-3 rounded-full border-2 shrink-0 ${selectedPreset === preset.id ? "border-primary bg-primary" : "border-border"}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: preset.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: preset.description })
                        ] })
                      ]
                    },
                    preset.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-muted-foreground mb-2", children: [
                    "Joindre un document",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "(optionnel — PDF ou Word)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: ".pdf,.doc,.docx",
                      onChange: (e) => {
                        var _a2;
                        const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
                        if (f) {
                          setAttachedFile(f);
                          ue.success(`Fichier joint : ${f.name}`);
                        }
                      },
                      className: "hidden",
                      "data-ocid": "generate_course.file_input"
                    }
                  ),
                  attachedFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate flex-1", children: attachedFile.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setAttachedFile(null),
                        className: "text-xs text-muted-foreground hover:text-foreground",
                        "data-ocid": "generate_course.remove_file_button",
                        children: "Retirer"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        var _a2;
                        return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                      },
                      className: "w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-primary/3 text-muted-foreground hover:text-primary transition-smooth",
                      "data-ocid": "generate_course.upload_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Joindre un fichier" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full gradient-ministry text-white border-0",
                    size: "lg",
                    onClick: handleGenerate,
                    disabled: requestGeneration.isPending || title.trim().length < 3,
                    "data-ocid": "generate_course.submit_button",
                    children: requestGeneration.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-2 animate-spin" }),
                      "Soumission en cours…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-4 mr-2" }),
                      "Lancer la génération IA"
                    ] })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showYouTubeSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-destructive/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4 px-4 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "size-4 text-destructive" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Vidéos YouTube trouvées" }),
                      youtubeSearch.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin text-muted-foreground ml-auto" })
                    ] }),
                    youtubeSearch.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Skeleton,
                      {
                        className: "h-20 w-full rounded-xl"
                      },
                      i
                    )) }) : ((_a = youtubeSearch.data) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "space-y-2",
                        "data-ocid": "generate_course.youtube_results",
                        children: youtubeSearch.data.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          YouTubeCard,
                          {
                            video: v,
                            onAdd: handleAddVideo
                          },
                          v.videoId
                        ))
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Aucune vidéo trouvée pour ce sujet." }),
                    addedVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary font-medium", children: [
                      addedVideos.length,
                      " vidéo",
                      addedVideos.length > 1 ? "s" : "",
                      " ajoutée",
                      addedVideos.length > 1 ? "s" : "",
                      " au cours"
                    ] }) })
                  ] }) })
                },
                "yt"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2", children: "Exemples de formations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SUGGESTION_CHIPS.map((chip, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTitle(chip),
                    className: "text-xs px-3 py-1.5 rounded-full bg-muted border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-smooth text-muted-foreground",
                    "data-ocid": `generate_course.suggestion_chip.${i + 1}`,
                    children: chip
                  },
                  chip
                )) })
              ] })
            ]
          },
          "form"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: activeGen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          GenerationPipeline,
          {
            gen: activeGen,
            config,
            onNewGeneration: () => {
              setActiveGenId(null);
              setTitle("");
            },
            onStartLearning: (id) => navigate({ to: "/courses/$courseId", params: { courseId: id } })
          },
          activeGen.id
        ) }),
        historyItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Générations précédentes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "table",
                {
                  className: "w-full text-sm",
                  "data-ocid": "generate_course.history_table",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b bg-muted/40", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Formation" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell", children: "Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Statut" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: historyItems.map((gen, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-smooth",
                        onClick: () => setActiveGenId(gen.id),
                        onKeyDown: (e) => e.key === "Enter" && setActiveGenId(gen.id),
                        tabIndex: 0,
                        "data-ocid": `generate_course.history_item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground line-clamp-1", children: gen.requestDescription }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                              gen.resourceIds.length,
                              " ressource",
                              gen.resourceIds.length !== 1 ? "s" : ""
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-muted-foreground text-center hidden sm:table-cell", children: new Date(gen.createdAt).toLocaleDateString("fr-FR") }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: gen.status === "approved" ? "default" : gen.status === "rejected" ? "destructive" : "secondary",
                              className: "text-xs",
                              children: STATUS_LABELS[gen.status]
                            }
                          ) })
                        ]
                      },
                      gen.id
                    )) })
                  ]
                }
              ) })
            ]
          }
        ),
        historyItems.length === 0 && !activeGen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-6 space-y-2",
            "data-ocid": "generate_course.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Aucune génération précédente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Vos formations générées apparaîtront ici." })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  GenerateCoursePage as default
};
