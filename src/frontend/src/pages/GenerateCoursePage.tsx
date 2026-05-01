import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  LIBRARY_SOURCE_ORDER,
  useGetAdminModelConfig,
  useGetGenerationStatus,
  useListMyGenerations,
  useRequestGeneration,
  useSearchWorldLibraries,
} from "@/lib/queries";
import type {
  AIModelConfig,
  CourseGeneration,
  GenerationStatus,
  LibrarySearchResult,
} from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BookText,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Library,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
  XCircle,
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
  step1_deepseek: "Étape 1 active",
  step2_qwen: "Étape 2 active",
  step3_gpt4o: "Étape 3 active",
  approved: "Approuvé",
  rejected: "Rejeté",
  revision_needed: "Révision requise",
};

const SOURCE_COLORS: Record<string, string> = {
  "Bibliothèque Ouverte": "bg-primary/10 text-primary border-primary/20",
  "Projet Gutenberg": "bg-accent/10 text-accent border-accent/20",
  "Archives Internet": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "Google Livres": "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

const SOURCE_ICONS: Record<string, typeof BookOpen> = {
  "Bibliothèque Ouverte": BookOpen,
  "Projet Gutenberg": BookText,
  "Archives Internet": Globe,
  "Google Livres": Search,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStepState(
  stepIdx: number,
  gen: CourseGeneration,
): "idle" | "active" | "done" {
  const statusOrder: GenerationStatus[] = [
    "queued",
    "step1_deepseek",
    "step2_qwen",
    "step3_gpt4o",
    "approved",
  ];
  if (gen.status === "approved" || gen.status === "revision_needed")
    return "done";
  if (gen.status === "rejected") return stepIdx === 0 ? "done" : "idle";
  const currentIdx = statusOrder.indexOf(gen.status);
  if (currentIdx > stepIdx + 1) return "done";
  if (currentIdx === stepIdx + 1) return "active";
  return "idle";
}

function buildStepConfig(config: AIModelConfig) {
  return [
    {
      step: 1,
      model: config.structureModel,
      label: "Structure du cours",
      description:
        "Analyse des ressources et définition de la structure pédagogique",
      color: "text-primary",
      bgActive: "bg-primary/10 border-primary/30",
      bgDone: "bg-primary/5 border-primary/20",
      iconBgActive: "bg-primary text-primary-foreground",
      iconBgDone: "bg-primary/20 text-primary",
    },
    {
      step: 2,
      model: config.contentModel,
      label: "Rédaction en français",
      description: "Rédaction du contenu pédagogique des leçons en français",
      color: "text-accent",
      bgActive: "bg-accent/10 border-accent/30",
      bgDone: "bg-accent/5 border-accent/20",
      iconBgActive: "bg-accent text-accent-foreground",
      iconBgDone: "bg-accent/20 text-accent",
    },
    {
      step: 3,
      model: config.validationModel,
      label: "Validation pédagogique",
      description: "Validation de la cohérence et approbation ministérielle",
      color: "text-chart-3",
      bgActive: "bg-chart-3/10 border-chart-3/30",
      bgDone: "bg-chart-3/5 border-chart-3/20",
      iconBgActive: "bg-chart-3 text-primary-foreground",
      iconBgDone: "bg-chart-3/20 text-chart-3",
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SuggestionChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTION_CHIPS.map((chip, idx) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="text-xs px-3 py-1.5 rounded-full bg-muted border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-smooth text-muted-foreground"
          data-ocid={`generate_course.suggestion_chip.${idx + 1}`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

function LibraryResultCard({ result }: { result: LibrarySearchResult }) {
  const colorClass =
    SOURCE_COLORS[result.source] ??
    "bg-muted text-muted-foreground border-border";
  const Icon = SOURCE_ICONS[result.source] ?? BookOpen;
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-smooth group">
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass}`}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {result.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {result.author}
          {result.year ? ` · ${result.year}` : ""}
        </p>
      </div>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="size-3 text-muted-foreground" />
      </a>
    </div>
  );
}

function WorldLibrarySection({
  description,
  domain,
}: {
  description: string;
  domain: string;
}) {
  const shouldSearch = description.trim().length >= 10;
  const { data: results = [], isLoading } = useSearchWorldLibraries(
    shouldSearch ? { query: description, domain: domain || undefined } : null,
  );

  if (!shouldSearch) return null;

  const grouped = LIBRARY_SOURCE_ORDER.reduce<
    Record<string, LibrarySearchResult[]>
  >((acc, src) => {
    acc[src] = results.filter((r) => r.source === src);
    return acc;
  }, {});

  const hasResults = results.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
      data-ocid="generate_course.world_libraries_section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">
            Sources mondiales
          </p>
        </div>
        {isLoading ? (
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            Consultation des bibliothèques…
          </span>
        ) : hasResults ? (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {results.length} ressource{results.length > 1 ? "s" : ""} trouvée
            {results.length > 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && hasResults && (
        <>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">
              {results.length} ressources trouvées
            </strong>{" "}
            dans les bibliothèques mondiales — consultées automatiquement pour
            enrichir votre formation.
          </p>
          <div className="space-y-3">
            {LIBRARY_SOURCE_ORDER.map((source) => {
              const items = grouped[source];
              if (!items || items.length === 0) return null;
              return (
                <div
                  key={source}
                  data-ocid={`generate_course.library_source.${source.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SOURCE_COLORS[source] ?? "bg-muted text-muted-foreground border-border"}`}
                    >
                      {source}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {items.length} livre{items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {items.map((r) => (
                      <LibraryResultCard key={r.id} result={r} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!isLoading && !hasResults && (
        <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
          <Library className="size-4 shrink-0" />
          <span>
            Les bibliothèques mondiales seront consultées lors de la génération.
          </span>
        </div>
      )}
    </motion.div>
  );
}

function StepItem({
  step,
  model,
  label,
  description,
  color,
  bgActive,
  bgDone,
  iconBgActive,
  iconBgDone,
  state,
  isLast,
  stepNum,
}: {
  step: number;
  model: string;
  label: string;
  description: string;
  color: string;
  bgActive: string;
  bgDone: string;
  iconBgActive: string;
  iconBgDone: string;
  state: "idle" | "active" | "done";
  isLast: boolean;
  stepNum: number;
}) {
  return (
    <div className="flex gap-4" data-ocid={`generate_course.step.${stepNum}`}>
      <div className="flex flex-col items-center gap-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-smooth ${
            state === "done"
              ? `${iconBgDone} border-transparent`
              : state === "active"
                ? `${iconBgActive} border-transparent`
                : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {state === "done" ? (
            <CheckCircle2 className="size-4" />
          ) : state === "active" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Clock className="size-4 opacity-50" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 my-1 rounded-full min-h-[2rem] transition-smooth ${
              state === "done" ? "bg-primary/30" : "bg-border"
            }`}
          />
        )}
      </div>

      <div
        className={`flex-1 p-3 rounded-xl border mb-3 transition-smooth ${
          state === "active"
            ? bgActive
            : state === "done"
              ? bgDone
              : "bg-muted/30 border-transparent"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${state !== "idle" ? color : "text-muted-foreground"}`}
              >
                Étape {step}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span
                className={`text-xs font-semibold ${state !== "idle" ? color : "text-muted-foreground"}`}
              >
                via {model}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
          {state === "active" && (
            <div className="shrink-0 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                En cours
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressSection({
  gen,
  modelConfig,
  onNewGeneration,
  onStartLearning,
}: {
  gen: CourseGeneration;
  modelConfig: AIModelConfig;
  onNewGeneration: () => void;
  onStartLearning: (courseId: string) => void;
}) {
  const resourceCount = gen.resourceIds.length;
  const isTerminal = TERMINAL.includes(gen.status);
  const steps = buildStepConfig(gen.aiModelConfig ?? modelConfig);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      data-ocid="generate_course.progress_card"
    >
      {/* Header card */}
      <Card className="border-primary/20">
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
                gen.status === "approved"
                  ? "default"
                  : gen.status === "rejected"
                    ? "destructive"
                    : "secondary"
              }
              className="shrink-0"
            >
              {STATUS_LABELS[gen.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-3 space-y-1.5">
          {resourceCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Library className="size-3.5" />
              <span>
                <strong className="text-foreground">{resourceCount}</strong>{" "}
                ressource{resourceCount > 1 ? "s" : ""} de la bibliothèque
                utilisée{resourceCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {(gen.libraryResultsCount ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="size-3.5 text-primary" />
              <span>
                <strong className="text-foreground">
                  {gen.libraryResultsCount}
                </strong>{" "}
                livres de bibliothèques inclus
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3-step stepper */}
      {!isTerminal || gen.status === "approved" ? (
        <Card>
          <CardContent className="pt-5 px-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Flux de génération IA
            </p>
            <div>
              {steps.map((cfg, i) => (
                <StepItem
                  key={cfg.step}
                  {...cfg}
                  stepNum={cfg.step}
                  state={getStepState(i, gen)}
                  isLast={i === steps.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Queued state */}
      {gen.status === "queued" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/60 border border-border">
          <Clock className="size-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              En file d'attente
            </p>
            <p className="text-xs text-muted-foreground">
              Votre demande est enregistrée. L'IA commencera l'analyse sous peu.
            </p>
          </div>
        </div>
      )}

      {/* Success state */}
      {gen.status === "approved" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl gradient-ministry text-white space-y-3"
          data-ocid="generate_course.success_state"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5" />
            <p className="font-bold">Votre formation est prête !</p>
          </div>
          <p className="text-sm opacity-90">
            Votre cours a été validé et approuvé par{" "}
            {gen.aiModelConfig?.validationModel ?? modelConfig.validationModel}.
            Il est maintenant disponible dans votre espace d'apprentissage.
          </p>
          {resourceCount > 0 && (
            <div className="text-xs opacity-80 flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              Basé sur {resourceCount} ressource{resourceCount > 1 ? "s" : ""}{" "}
              officielles du Ministère
            </div>
          )}
          <div className="flex gap-2 pt-1">
            {gen.generatedCourseId && (
              <Button
                size="sm"
                variant="secondary"
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

      {/* Rejected state */}
      {gen.status === "rejected" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
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
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/15">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Motif du rejet (
                {gen.aiModelConfig?.validationModel ??
                  modelConfig.validationModel}
                ) :
              </p>
              <p className="text-sm text-foreground">{gen.errorMessage}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Reformulez votre demande en étant plus précis, ou ajoutez plus de
            contexte pour améliorer les résultats.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onNewGeneration}
            className="border-destructive/30 text-destructive hover:bg-destructive/5"
            data-ocid="generate_course.retry_button"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Affiner et resoumettre
          </Button>
        </motion.div>
      )}

      {/* Revision needed state */}
      {gen.status === "revision_needed" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl bg-accent/8 border border-accent/20 space-y-3"
          data-ocid="generate_course.revision_state"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-accent" />
            <p className="font-semibold text-foreground">Révision nécessaire</p>
          </div>
          {gen.errorMessage && (
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/15">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Notes du réviseur :
              </p>
              <p className="text-sm text-foreground">{gen.errorMessage}</p>
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onNewGeneration}
            className="border-accent/30 text-accent hover:bg-accent/5"
            data-ocid="generate_course.resubmit_button"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Modifier et resoumettre
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GenerateCoursePage() {
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [activeGenId, setActiveGenId] = useState<string | null>(null);
  const [debouncedDescription, setDebouncedDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const requestGeneration = useRequestGeneration();
  const { data: myGenerations = [] } = useListMyGenerations();
  const { data: activeGenLive } = useGetGenerationStatus(activeGenId ?? "");
  const { data: modelConfig } = useGetAdminModelConfig();

  const defaultConfig: AIModelConfig = {
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o",
  };
  const config = modelConfig ?? defaultConfig;

  // Debounce description for library search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedDescription(description), 1500);
    return () => clearTimeout(t);
  }, [description]);

  const activeGen = activeGenId
    ? (activeGenLive ?? myGenerations.find((g) => g.id === activeGenId) ?? null)
    : null;

  const showForm = !activeGen || TERMINAL.includes(activeGen.status);

  const handleGenerate = () => {
    const trimmed = description.trim();
    if (trimmed.length < 20) {
      toast.error(
        "Veuillez décrire votre formation en au moins 20 caractères.",
      );
      return;
    }
    requestGeneration.mutate(trimmed, {
      onSuccess: (gen) => {
        setActiveGenId(gen.id);
        setDescription("");
        setDomain("");
        setAttachedFile(null);
        toast.success(
          "Génération lancée — les bibliothèques mondiales sont consultées automatiquement.",
          { duration: 5000 },
        );
      },
      onError: () => toast.error("Erreur lors de la soumission. Réessayez."),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Seuls les fichiers PDF et Word sont acceptés.");
      return;
    }
    setAttachedFile(file);
    toast.success(`Fichier joint : ${file.name}`);
  };

  const handleNewGeneration = () => {
    setActiveGenId(null);
    setDescription("");
    setDomain("");
  };

  const handleStartLearning = (courseId: string) => {
    navigate({ to: "/courses/$courseId", params: { courseId } });
  };

  const historyItems = myGenerations.filter((g) => g.id !== activeGenId);

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto px-4 py-8 space-y-8"
        data-ocid="generate_course.page"
      >
        {/* ── Hero header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-ministry shadow-elevated mb-1">
            <Sparkles className="size-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground leading-tight">
            Que souhaitez-vous apprendre ?
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Notre IA recherche dans des milliers de livres, vidéos et ressources
            des bibliothèques mondiales pour créer votre formation
            personnalisée.
          </p>
          {/* AI flow indicator — dynamic model names */}
          <div className="flex items-center justify-center gap-1 pt-1">
            {[
              config.structureModel,
              config.contentModel,
              config.validationModel,
            ].map((model, i) => (
              <div key={model} className="flex items-center gap-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                  {model}
                </span>
                {i < 2 && (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Generation form ──────────────────────────────────────── */}
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
                <CardContent className="pt-5 space-y-4">
                  {/* Description textarea */}
                  <div>
                    <label
                      htmlFor="course-description"
                      className="text-sm font-semibold text-foreground block mb-2"
                    >
                      Décrivez votre formation
                    </label>
                    <Textarea
                      id="course-description"
                      placeholder={`Ex: "Je veux apprendre la comptabilité pour PME selon les normes OHADA" ou "Rédiger un TFC sur la gestion des ressources humaines selon les règles académiques de la RDC"`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="resize-none text-sm"
                      data-ocid="generate_course.description_textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
                      <span>
                        Plus vous êtes précis, meilleur sera le résultat.
                      </span>
                      <span
                        className={
                          description.trim().length < 20
                            ? "text-muted-foreground"
                            : "text-primary font-medium"
                        }
                      >
                        {description.length} car.
                      </span>
                    </p>
                  </div>

                  {/* Domain / profession field */}
                  <div>
                    <label
                      htmlFor="course-domain"
                      className="text-sm font-medium text-muted-foreground block mb-1.5"
                    >
                      Domaine ou profession{" "}
                      <span className="text-xs text-muted-foreground/70">
                        (optionnel)
                      </span>
                    </label>
                    <Input
                      id="course-domain"
                      placeholder="ex: Médecin, Ingénieur civil, Entrepreneur..."
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="text-sm"
                      data-ocid="generate_course.domain_input"
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Joindre un plan ou document existant{" "}
                      <span className="text-xs">(optionnel — PDF ou Word)</span>
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
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
                          className="text-muted-foreground hover:text-foreground transition-colors text-xs"
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
                      requestGeneration.isPending ||
                      description.trim().length < 20
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
                        Lancer la génération
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* World library section — auto-triggered after debounce */}
              <AnimatePresence>
                {debouncedDescription.trim().length >= 10 && (
                  <motion.div
                    key="library-section"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="border-primary/15 bg-card">
                      <CardContent className="pt-4 px-4 pb-4">
                        <WorldLibrarySection
                          description={debouncedDescription}
                          domain={domain}
                        />
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
                <SuggestionChips onSelect={(text) => setDescription(text)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress + completion ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeGen && (
            <ProgressSection
              key={activeGen.id}
              gen={activeGen}
              modelConfig={config}
              onNewGeneration={handleNewGeneration}
              onStartLearning={handleStartLearning}
            />
          )}
        </AnimatePresence>

        {/* ── Generation history ────────────────────────────────────── */}
        {historyItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Mes générations précédentes
            </p>
            <div className="space-y-2">
              {historyItems.map((gen, i) => (
                <button
                  key={gen.id}
                  type="button"
                  className="w-full text-left p-3.5 rounded-xl bg-card border border-border hover:bg-muted/40 hover:border-primary/20 transition-smooth group"
                  onClick={() => setActiveGenId(gen.id)}
                  data-ocid={`generate_course.history_item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                      {gen.requestDescription}
                    </p>
                    <Badge
                      variant={
                        gen.status === "approved"
                          ? "default"
                          : gen.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className="shrink-0 text-xs"
                    >
                      {STATUS_LABELS[gen.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {gen.resourceIds.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Library className="size-3" />
                        {gen.resourceIds.length} ressource
                        {gen.resourceIds.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {(gen.libraryResultsCount ?? 0) > 0 && (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <Globe className="size-3" />
                        {gen.libraryResultsCount} livre
                        {(gen.libraryResultsCount ?? 0) > 1 ? "s" : ""} de
                        bibliothèques inclus
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty history */}
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
