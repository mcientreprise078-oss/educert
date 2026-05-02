import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAdminModelConfig,
  useGetGenerationStatus,
  useListMyGenerations,
  useRequestGeneration,
  useSearchYouTubeVideos,
} from "@/lib/queries";
import type {
  AIModelConfig,
  CourseGeneration,
  GenerationStatus,
  YouTubeVideoResult,
} from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Library,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  Video,
  XCircle,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  "Comptabilité pour PME selon les normes OHADA",
  "TFC sur la gestion des ressources humaines en RDC",
  "Entrepreneuriat numérique pour les jeunes de Kinshasa",
  "Techniques agricoles modernes pour les régions tropicales",
  "Droit du travail en République Démocratique du Congo",
  "Marketing digital et e-commerce pour entrepreneurs congolais",
];

const TERMINAL: GenerationStatus[] = [
  "approved",
  "rejected",
  "revision_needed",
];

const STATUS_LABELS: Record<GenerationStatus, string> = {
  queued: "En attente",
  step1_deepseek: "Structure en cours",
  step2_qwen: "Rédaction en cours",
  step3_gpt4o: "Validation en cours",
  approved: "Approuvé",
  rejected: "Rejeté",
  revision_needed: "Révision requise",
};

const MODEL_PRESETS = [
  {
    id: "default",
    label: "DeepSeek + Qwen + GPT-4o",
    description: "Configuration par défaut recommandée",
    config: {
      structureModel: "DeepSeek R1",
      contentModel: "Qwen 72B",
      validationModel: "GPT-4o",
    },
  },
  {
    id: "advanced",
    label: "Claude + GPT-5 + Gemini",
    description: "Modèles avancés pour contenus complexes",
    config: {
      structureModel: "Claude Opus",
      contentModel: "GPT-5",
      validationModel: "Gemini Flash",
    },
  },
  {
    id: "fast",
    label: "DeepSeek + Gemini + GPT-4o",
    description: "Génération rapide avec analyse documentaire",
    config: {
      structureModel: "DeepSeek R1",
      contentModel: "Gemini Flash",
      validationModel: "GPT-4o",
    },
  },
] as const;

const SOURCES = [
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    description: "Vidéos pédagogiques",
  },
  {
    id: "open_library",
    label: "Bibliothèque Ouverte",
    icon: BookOpen,
    description: "Livres en accès libre",
  },
  {
    id: "google_books",
    label: "Google Livres",
    icon: FileText,
    description: "Millions de livres",
  },
  {
    id: "google_docs",
    label: "Google Docs",
    icon: Globe,
    description: "Documents partagés",
  },
] as const;

type SourceId = (typeof SOURCES)[number]["id"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStepState(
  stepIdx: number,
  gen: CourseGeneration,
): "idle" | "active" | "done" {
  const order: GenerationStatus[] = [
    "queued",
    "step1_deepseek",
    "step2_qwen",
    "step3_gpt4o",
    "approved",
  ];
  if (gen.status === "approved") return "done";
  if (gen.status === "rejected") return stepIdx === 0 ? "active" : "idle";
  if (gen.status === "revision_needed") return "done";
  const idx = order.indexOf(gen.status);
  if (idx > stepIdx + 1) return "done";
  if (idx === stepIdx + 1) return "active";
  return "idle";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function YouTubeCard({
  video,
  onAdd,
}: {
  video: YouTubeVideoResult;
  onAdd: (v: YouTubeVideoResult) => void;
}) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-smooth group">
      <div className="relative shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-muted">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='64'%3E%3Crect width='112' height='64' fill='%23e5e7eb'/%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
            <Play className="size-3 text-white fill-white ml-0.5" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-1 right-1 text-xs bg-black/80 text-white px-1 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
          {video.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {video.channelTitle}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 h-6 text-xs px-2 border-primary/30 text-primary hover:bg-primary/5"
          onClick={() => onAdd(video)}
          data-ocid="generate_course.video_add_button"
        >
          <Plus className="size-2.5 mr-1" />
          Intégrer dans le cours
        </Button>
      </div>
    </div>
  );
}

function PipelineStep({
  stepNum,
  label,
  model,
  description,
  state,
  isLast,
}: {
  stepNum: number;
  label: string;
  model: string;
  description: string;
  state: "idle" | "active" | "done";
  isLast: boolean;
}) {
  const colors = [
    {
      color: "text-primary",
      bg: "bg-primary",
      bgLight: "bg-primary/10 border-primary/30",
      bgDone: "bg-primary/5 border-primary/10",
    },
    {
      color: "text-accent",
      bg: "bg-accent",
      bgLight: "bg-accent/10 border-accent/30",
      bgDone: "bg-accent/5 border-accent/10",
    },
    {
      color: "text-chart-3",
      bg: "bg-chart-3",
      bgLight: "bg-chart-3/10 border-chart-3/30",
      bgDone: "bg-chart-3/5 border-chart-3/10",
    },
  ][stepNum - 1] ?? {
    color: "text-primary",
    bg: "bg-primary",
    bgLight: "bg-primary/10 border-primary/30",
    bgDone: "bg-primary/5 border-primary/10",
  };

  return (
    <div className="flex gap-3" data-ocid={`generate_course.step.${stepNum}`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
            state === "done"
              ? `${colors.bg} text-primary-foreground border-transparent`
              : state === "active"
                ? `${colors.bg} text-primary-foreground border-transparent ring-4 ring-primary/20`
                : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {state === "done" ? (
            <CheckCircle2 className="size-4" />
          ) : state === "active" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Clock className="size-4 opacity-40" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 my-1.5 rounded-full min-h-[2rem] transition-all duration-500 ${
              state === "done" ? `${colors.bg}/40` : "bg-border"
            }`}
          />
        )}
      </div>

      <div
        className={`flex-1 p-3.5 rounded-xl border mb-3 transition-all duration-500 ${
          state === "active"
            ? colors.bgLight
            : state === "done"
              ? colors.bgDone
              : "bg-muted/20 border-transparent"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  state !== "idle" ? colors.color : "text-muted-foreground"
                }`}
              >
                Étape {stepNum}
              </span>
              <span className="text-xs text-muted-foreground/60">·</span>
              <span
                className={`text-xs font-semibold ${
                  state !== "idle" ? colors.color : "text-muted-foreground"
                }`}
              >
                {model}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
          {state === "active" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              En cours
            </span>
          )}
          {state === "done" && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.color} bg-current/10 shrink-0 mt-0.5`}
            >
              ✓ Terminé
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CoursePreviewSection({ gen }: { gen: CourseGeneration }) {
  const preview = gen.generatedPreview;
  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
      data-ocid="generate_course.preview_section"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">
          Aperçu du cours généré
        </h3>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/3 p-4 space-y-1">
        <p className="font-bold text-foreground">{preview.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {preview.description}
        </p>
      </div>

      <div className="space-y-3">
        {preview.chapters.map((chapter) => (
          <div
            key={chapter.number}
            className="rounded-xl border bg-card overflow-hidden"
            data-ocid={`generate_course.chapter.${chapter.number}`}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                {chapter.number}
              </span>
              <p className="font-semibold text-sm text-foreground flex-1">
                {chapter.title}
              </p>
              {chapter.videoId && (
                <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Video className="size-3" />
                  Vidéo
                </span>
              )}
            </div>
            <div className="px-4 py-3 space-y-1.5">
              {chapter.lessons.map((lesson, i) => (
                <div
                  key={lesson}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {lesson}
                </div>
              ))}
            </div>
            {chapter.videoId && (
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Youtube className="size-3 text-destructive" />
                  Vidéo intégrée dans ce chapitre
                </p>
                <div className="rounded-lg overflow-hidden border border-border aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${chapter.videoId}`}
                    title={chapter.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function GenerationPipeline({
  gen,
  config,
  onNewGeneration,
  onStartLearning,
}: {
  gen: CourseGeneration;
  config: AIModelConfig;
  onNewGeneration: () => void;
  onStartLearning: (courseId: string) => void;
}) {
  const cfg = gen.aiModelConfig ?? config;
  const steps = [
    {
      stepNum: 1,
      label: "Structure du cours",
      model: cfg.structureModel,
      description: "Analyse des ressources et architecture pédagogique",
    },
    {
      stepNum: 2,
      label: "Rédaction des leçons en français",
      model: cfg.contentModel,
      description: "Contenu des leçons rédigé en français académique",
    },
    {
      stepNum: 3,
      label: "Validation pédagogique",
      model: cfg.validationModel,
      description: "Vérification de la cohérence et qualité ministérielle",
    },
  ];
  const isApproved = gen.status === "approved";
  const isRejected = gen.status === "rejected";
  const isRevision = gen.status === "revision_needed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
      data-ocid="generate_course.pipeline_card"
    >
      {/* Request info */}
      <Card className="border-primary/15">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Formation demandée
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
                {gen.requestDescription}
              </p>
            </div>
            <Badge
              variant={
                isApproved
                  ? "default"
                  : isRejected
                    ? "destructive"
                    : "secondary"
              }
              className="shrink-0"
            >
              {STATUS_LABELS[gen.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="flex gap-4 text-xs text-muted-foreground">
            {gen.resourceIds.length > 0 && (
              <span className="flex items-center gap-1">
                <Library className="size-3" />
                {gen.resourceIds.length} ressource
                {gen.resourceIds.length > 1 ? "s" : ""}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Globe className="size-3 text-primary" />
              Bibliothèques mondiales consultées
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline stepper */}
      <Card>
        <CardContent className="pt-5 px-4 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Flux de génération IA
          </p>
          {steps.map((s, i) => (
            <PipelineStep
              key={s.stepNum}
              {...s}
              state={getStepState(i, gen)}
              isLast={i === steps.length - 1}
            />
          ))}
          {/* Step 4: Cours prêt */}
          <div className="flex gap-3" data-ocid="generate_course.step.4">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-700 ${
                  isApproved
                    ? "bg-chart-3 text-primary-foreground border-transparent ring-4 ring-chart-3/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {isApproved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <Sparkles className="size-4" />
                  </motion.div>
                ) : (
                  <Clock className="size-4 opacity-40" />
                )}
              </div>
            </div>
            <div
              className={`flex-1 p-3.5 rounded-xl border transition-all duration-500 ${
                isApproved
                  ? "bg-chart-3/8 border-chart-3/30"
                  : "bg-muted/20 border-transparent"
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  isApproved ? "text-chart-3" : "text-muted-foreground"
                }`}
              >
                Étape 4
              </span>
              <p className="text-sm font-semibold text-foreground">
                Cours prêt !
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Publication et mise à disposition des apprenants
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queued state */}
      {gen.status === "queued" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <Clock className="size-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              En file d'attente
            </p>
            <p className="text-xs text-muted-foreground">
              L'IA commencera l'analyse dans quelques secondes.
            </p>
          </div>
        </div>
      )}

      {/* Success state */}
      {isApproved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl gradient-ministry text-white space-y-3"
          data-ocid="generate_course.success_state"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <p className="font-bold text-lg">Votre formation est prête !</p>
          </div>
          <p className="text-sm opacity-90">
            Validée par {cfg.validationModel} — disponible dans votre espace
            d'apprentissage.
          </p>
          <div className="flex gap-2 pt-1">
            {gen.generatedCourseId && (
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 border"
                onClick={() => onStartLearning(String(gen.generatedCourseId))}
                data-ocid="generate_course.start_learning_button"
              >
                <Zap className="size-3.5 mr-1.5" />
                Commencer à apprendre
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={onNewGeneration}
              data-ocid="generate_course.new_generation_button"
            >
              Nouvelle formation
            </Button>
          </div>
        </motion.div>
      )}

      {/* Rejected */}
      {isRejected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl bg-destructive/8 border border-destructive/20 space-y-3"
          data-ocid="generate_course.error_state"
        >
          <div className="flex items-center gap-2">
            <XCircle className="size-5 text-destructive" />
            <p className="font-semibold text-foreground">
              Formation non approuvée
            </p>
          </div>
          {gen.errorMessage && (
            <p className="text-sm text-foreground">{gen.errorMessage}</p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onNewGeneration}
            className="border-destructive/30 text-destructive"
            data-ocid="generate_course.retry_button"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Affiner et resoumettre
          </Button>
        </motion.div>
      )}

      {/* Revision */}
      {isRevision && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl bg-accent/8 border border-accent/20 space-y-3"
          data-ocid="generate_course.revision_state"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-accent" />
            <p className="font-semibold text-foreground">Révision nécessaire</p>
          </div>
          {gen.errorMessage && (
            <p className="text-sm text-foreground">{gen.errorMessage}</p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onNewGeneration}
            className="border-accent/30 text-accent"
            data-ocid="generate_course.resubmit_button"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Modifier et resoumettre
          </Button>
        </motion.div>
      )}

      {/* Course preview after approval */}
      {isApproved && <CoursePreviewSection gen={gen} />}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GenerateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [chapterCount, setChapterCount] = useState(5);
  const [selectedSources, setSelectedSources] = useState<Set<SourceId>>(
    new Set(["open_library", "google_books"]),
  );
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [activeGenId, setActiveGenId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [addedVideos, setAddedVideos] = useState<YouTubeVideoResult[]>([]);
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const requestGeneration = useRequestGeneration();
  const { data: myGenerations = [] } = useListMyGenerations();
  const { data: activeGenLive } = useGetGenerationStatus(activeGenId ?? "");
  const { data: modelConfig } = useGetAdminModelConfig();
  const youtubeSearch = useSearchYouTubeVideos();

  const defaultConfig: AIModelConfig = {
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o",
  };
  const config = modelConfig ?? defaultConfig;

  const activeGen = activeGenId
    ? (activeGenLive ?? myGenerations.find((g) => g.id === activeGenId) ?? null)
    : null;
  const showForm = !activeGen || TERMINAL.includes(activeGen.status);

  const youtubeSearchMutate = youtubeSearch.mutate;
  // Trigger YouTube search when source selected
  useEffect(() => {
    if (selectedSources.has("youtube") && title.trim().length >= 5) {
      setShowYouTubeSearch(true);
      youtubeSearchMutate({ query: title });
    } else {
      setShowYouTubeSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSources, title, youtubeSearchMutate]);

  const toggleSource = (id: SourceId) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    const trimmedDesc = (
      title + (description ? ` — ${description}` : "")
    ).trim();
    if (trimmedDesc.length < 10) {
      toast.error("Veuillez saisir un titre ou décrire votre formation.");
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
        modelPreset: selectedPreset,
      },
      {
        onSuccess: (gen) => {
          setActiveGenId(gen.id);
          setTitle("");
          setDescription("");
          setDomain("");
          setAttachedFile(null);
          toast.success(
            "Génération lancée — l'IA analyse les sources disponibles.",
            { duration: 4000 },
          );
        },
        onError: () => toast.error("Erreur lors de la soumission. Réessayez."),
      },
    );
    if (preset) {
      Object.assign(config, preset.config);
    }
  };

  const handleAddVideo = (video: YouTubeVideoResult) => {
    setAddedVideos((prev) => [
      ...prev.filter((v) => v.videoId !== video.videoId),
      video,
    ]);
    toast.success(`Vidéo ajoutée : ${video.title.slice(0, 40)}…`);
  };

  const historyItems = myGenerations.filter((g) => g.id !== activeGenId);

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto px-4 py-8 space-y-8"
        data-ocid="generate_course.page"
      >
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-ministry shadow-elevated mb-1">
            <Sparkles className="size-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground leading-tight">
            Générer un cours sur mesure
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Notre IA multi-modèle crée votre formation personnalisée à partir
            des bibliothèques mondiales, vidéos YouTube et ressources de
            l'admin.
          </p>
          <div className="flex items-center justify-center gap-1">
            {[
              config.structureModel,
              config.contentModel,
              config.validationModel,
            ].map((m, i) => (
              <div key={m} className="flex items-center gap-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-semibold">
                  {m}
                </span>
                {i < 2 && (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Generation form */}
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              <Card className="shadow-card">
                <CardContent className="pt-5 space-y-5">
                  {/* Title */}
                  <div>
                    <Label
                      htmlFor="course-title"
                      className="text-sm font-semibold mb-1.5 block"
                    >
                      Titre / Sujet du cours{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="course-title"
                      placeholder="Ex: Comptabilité OHADA pour entrepreneurs en RDC"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      data-ocid="generate_course.title_input"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="course-desc"
                      className="text-sm font-medium text-muted-foreground mb-1.5 block"
                    >
                      Description détaillée{" "}
                      <span className="text-xs">(optionnel)</span>
                    </Label>
                    <Textarea
                      id="course-desc"
                      placeholder="Décrivez vos attentes, le public cible, le niveau souhaité…"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="resize-none text-sm"
                      data-ocid="generate_course.description_textarea"
                    />
                  </div>

                  {/* Domain + Chapter count */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="course-domain"
                        className="text-sm font-medium text-muted-foreground mb-1.5 block"
                      >
                        Domaine / Profession
                      </Label>
                      <Input
                        id="course-domain"
                        placeholder="ex: Comptable, Médecin…"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        data-ocid="generate_course.domain_input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="chapter-count"
                        className="text-sm font-medium text-muted-foreground mb-1.5 block"
                      >
                        Nombre de chapitres
                      </Label>
                      <Input
                        id="chapter-count"
                        type="number"
                        min={3}
                        max={10}
                        value={chapterCount}
                        onChange={(e) =>
                          setChapterCount(Number(e.target.value))
                        }
                        data-ocid="generate_course.chapter_count_input"
                      />
                    </div>
                  </div>

                  {/* Source selection */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Sources à consulter
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SOURCES.map((src) => {
                        const Icon = src.icon;
                        const checked = selectedSources.has(src.id);
                        return (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => toggleSource(src.id)}
                            data-ocid={`generate_course.source.${src.id}`}
                            className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-smooth ${
                              checked
                                ? "bg-primary/5 border-primary/30"
                                : "bg-muted/30 border-border hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleSource(src.id)}
                              className="pointer-events-none"
                              data-ocid={`generate_course.source_checkbox.${src.id}`}
                            />
                            <Icon
                              className={`size-3.5 shrink-0 ${checked ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-semibold truncate ${checked ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {src.label}
                              </p>
                              <p className="text-xs text-muted-foreground/70 truncate">
                                {src.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Model preset */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Modèles IA
                    </p>
                    <div className="space-y-2">
                      {MODEL_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(preset.id)}
                          data-ocid={`generate_course.preset.${preset.id}`}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-smooth ${
                            selectedPreset === preset.id
                              ? "bg-primary/5 border-primary/30"
                              : "bg-muted/30 border-border hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                              selectedPreset === preset.id
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          />
                          <div>
                            <p className="text-xs font-semibold text-foreground">
                              {preset.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {preset.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File upload */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Joindre un document{" "}
                      <span className="text-xs">(optionnel — PDF ou Word)</span>
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setAttachedFile(f);
                          toast.success(`Fichier joint : ${f.name}`);
                        }
                      }}
                      className="hidden"
                      data-ocid="generate_course.file_input"
                    />
                    {attachedFile ? (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <FileText className="size-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">
                          {attachedFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                          data-ocid="generate_course.remove_file_button"
                        >
                          Retirer
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-primary/3 text-muted-foreground hover:text-primary transition-smooth"
                        data-ocid="generate_course.upload_button"
                      >
                        <Upload className="size-4 shrink-0" />
                        <span className="text-sm">Joindre un fichier</span>
                      </button>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    className="w-full gradient-ministry text-white border-0"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={
                      requestGeneration.isPending || title.trim().length < 3
                    }
                    data-ocid="generate_course.submit_button"
                  >
                    {requestGeneration.isPending ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Soumission en cours…
                      </>
                    ) : (
                      <>
                        <Zap className="size-4 mr-2" />
                        Lancer la génération IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* YouTube search results */}
              <AnimatePresence>
                {showYouTubeSearch && (
                  <motion.div
                    key="yt"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="border-destructive/20">
                      <CardContent className="pt-4 pb-4 px-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Youtube className="size-4 text-destructive" />
                          <p className="text-sm font-semibold text-foreground">
                            Vidéos YouTube trouvées
                          </p>
                          {youtubeSearch.isPending && (
                            <Loader2 className="size-3 animate-spin text-muted-foreground ml-auto" />
                          )}
                        </div>
                        {youtubeSearch.isPending ? (
                          <div className="space-y-2">
                            {[1, 2].map((i) => (
                              <Skeleton
                                key={i}
                                className="h-20 w-full rounded-xl"
                              />
                            ))}
                          </div>
                        ) : youtubeSearch.data?.length ? (
                          <div
                            className="space-y-2"
                            data-ocid="generate_course.youtube_results"
                          >
                            {youtubeSearch.data.map((v) => (
                              <YouTubeCard
                                key={v.videoId}
                                video={v}
                                onAdd={handleAddVideo}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Aucune vidéo trouvée pour ce sujet.
                          </p>
                        )}
                        {addedVideos.length > 0 && (
                          <div className="border-t pt-2">
                            <p className="text-xs text-primary font-medium">
                              {addedVideos.length} vidéo
                              {addedVideos.length > 1 ? "s" : ""} ajoutée
                              {addedVideos.length > 1 ? "s" : ""} au cours
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestion chips */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Exemples de formations
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTitle(chip)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-smooth text-muted-foreground"
                      data-ocid={`generate_course.suggestion_chip.${i + 1}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pipeline progress */}
        <AnimatePresence mode="wait">
          {activeGen && (
            <GenerationPipeline
              key={activeGen.id}
              gen={activeGen}
              config={config}
              onNewGeneration={() => {
                setActiveGenId(null);
                setTitle("");
              }}
              onStartLearning={(id) =>
                navigate({ to: "/courses/$courseId", params: { courseId: id } })
              }
            />
          )}
        </AnimatePresence>

        {/* History table */}
        {historyItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Générations précédentes
            </p>
            <div className="rounded-xl border bg-card overflow-hidden">
              <table
                className="w-full text-sm"
                data-ocid="generate_course.history_table"
              >
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                      Formation
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((gen, i) => (
                    <tr
                      key={gen.id}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-smooth"
                      onClick={() => setActiveGenId(gen.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setActiveGenId(gen.id)
                      }
                      tabIndex={0}
                      data-ocid={`generate_course.history_item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-1">
                          {gen.requestDescription}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {gen.resourceIds.length} ressource
                          {gen.resourceIds.length !== 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground text-center hidden sm:table-cell">
                        {new Date(gen.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant={
                            gen.status === "approved"
                              ? "default"
                              : gen.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {STATUS_LABELS[gen.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {historyItems.length === 0 && !activeGen && (
          <div
            className="text-center py-6 space-y-2"
            data-ocid="generate_course.empty_state"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Aucune génération précédente
            </p>
            <p className="text-xs text-muted-foreground">
              Vos formations générées apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
