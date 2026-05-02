import { Layout } from "@/components/Layout";
import ResearchStepPanel from "@/components/ResearchStepPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RESEARCH_STATUS_LABELS,
  RESEARCH_STEP_LABELS,
  RESEARCH_STEP_ORDER,
} from "@/lib/constants";
import {
  useCreateResearchProject,
  useGetResearchProject,
  useListMyResearchProjects,
  useSearchWorldLibraries,
} from "@/lib/queries";
import type { ResearchProject, ResearchType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Lock,
  Plus,
  School,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-chart-3/10 text-chart-3",
};

const RESEARCH_TYPE_LABELS: Record<ResearchType, string> = {
  tfc: "TFC",
  memoire: "Mémoire",
  these: "Thèse",
};

const RESEARCH_TYPE_DESCRIPTIONS: Record<ResearchType, string> = {
  tfc: "Travail de Fin de Cycle (Licence)",
  memoire: "Mémoire de fin d’études (Master)",
  these: "Thèse de Doctorat",
};

const RESEARCH_TYPES: ResearchType[] = ["tfc", "memoire", "these"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStepProgress(project: ResearchProject): number {
  const validated = project.steps.filter(([, sd]) => sd.validated).length;
  return Math.round((validated / 6) * 100);
}

// ─── Step Sidebar Indicator ─────────────────────────────────────────────────────

function VerticalStepSidebar({ project }: { project: ResearchProject }) {
  const currentIdx = RESEARCH_STEP_ORDER.indexOf(
    project.currentStep as (typeof RESEARCH_STEP_ORDER)[number],
  );
  const validatedSteps = new Set(
    project.steps.filter(([, sd]) => sd.validated).map(([s]) => s),
  );

  return (
    <div className="flex flex-col gap-0">
      {RESEARCH_STEP_ORDER.map((step, idx) => {
        const isValidated = validatedSteps.has(step);
        const isCurrent = idx === currentIdx;
        const isLocked = idx > currentIdx && !isValidated;
        const isLast = idx === RESEARCH_STEP_ORDER.length - 1;

        return (
          <div key={step} className="flex items-stretch gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-smooth",
                  isValidated && "bg-primary text-primary-foreground",
                  isCurrent &&
                    !isValidated &&
                    "bg-accent text-accent-foreground ring-2 ring-accent/30",
                  isLocked && "bg-muted text-muted-foreground/50",
                  !isValidated &&
                    !isCurrent &&
                    !isLocked &&
                    "bg-secondary text-secondary-foreground",
                )}
              >
                {isValidated ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  idx + 1
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-1 min-h-[20px] rounded-full",
                    isValidated ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
            </div>
            {/* Step label */}
            <div className={cn("pb-4 flex-1 min-w-0", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-xs font-semibold leading-tight",
                  isValidated && "text-primary",
                  isCurrent && !isValidated && "text-foreground",
                  isLocked && "text-muted-foreground/50",
                  !isValidated &&
                    !isCurrent &&
                    !isLocked &&
                    "text-muted-foreground",
                )}
              >
                {RESEARCH_STEP_LABELS[step]}
              </p>
              {isValidated && (
                <p className="text-xs text-primary/70 mt-0.5">Validée ✓</p>
              )}
              {isCurrent && !isValidated && (
                <p className="text-xs text-accent mt-0.5">En cours</p>
              )}
              {isLocked && (
                <p className="text-xs text-muted-foreground/40 mt-0.5">
                  Verrouillée
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Recommended Resources Panel ──────────────────────────────────────────

function RecommendedResources({ topic }: { topic: string }) {
  const { data: results = [], isLoading } = useSearchWorldLibraries(
    topic.length >= 5 ? { query: topic } : null,
  );
  if (!topic || topic.length < 5) return null;

  return (
    <div
      className="bg-card rounded-xl border shadow-card p-4 space-y-3"
      data-ocid="research.recommended_resources_panel"
    >
      <div className="flex items-center gap-2">
        <BookMarked className="size-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          Ressources recommandées
        </p>
        {isLoading && (
          <span className="text-xs text-muted-foreground ml-auto">
            Recherche…
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.slice(0, 4).map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-smooth group"
            >
              <FileText className="size-3.5 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {r.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.author}
                  {r.year ? ` · ${r.year}` : ""} · {r.source}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Bibliothèques consultées automatiquement lors de chaque étape.
        </p>
      )}
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  isSelected,
  onClick,
  index,
}: {
  project: ResearchProject;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const progress = getStepProgress(project);
  const currentStepLabel =
    RESEARCH_STEP_LABELS[project.currentStep] ?? project.currentStep;
  const typeLabel = project.researchType
    ? RESEARCH_TYPE_LABELS[project.researchType]
    : null;

  return (
    <button
      type="button"
      data-ocid={`research.item.${index}`}
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-smooth hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">
          {project.title}
        </p>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {typeLabel && (
            <Badge variant="outline" className="text-xs h-4 px-1.5">
              {typeLabel}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className={cn("text-xs", STATUS_COLORS[project.status])}
          >
            {RESEARCH_STATUS_LABELS[project.status]}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{currentStepLabel}</p>
      <Progress value={progress} className="h-1" />
      <p className="text-xs text-muted-foreground mt-1">{progress}% complété</p>
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ResearchType>("tfc");
  const [newDomain, setNewDomain] = useState("");
  const [newInstitution, setNewInstitution] = useState("");
  const [newDirector, setNewDirector] = useState("");

  const { data: projects, isLoading } = useListMyResearchProjects();
  const { data: selectedProject, isLoading: isLoadingProject } =
    useGetResearchProject(selectedId ? String(selectedId) : "");
  const createMutation = useCreateResearchProject();

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate(
      {
        title: newTitle.trim(),
        researchType: newType,
        domain: newDomain.trim() || undefined,
        institution: newInstitution.trim() || undefined,
        directorName: newDirector.trim() || undefined,
      },
      {
        onSuccess: (project) => {
          setSelectedId(project.id);
          setNewTitle("");
          setNewDomain("");
          setNewInstitution("");
          setNewDirector("");
          setShowCreate(false);
        },
      },
    );
  };

  const currentProject =
    selectedProject ?? projects?.find((p) => p.id === selectedId) ?? null;
  const progress = currentProject ? getStepProgress(currentProject) : 0;
  const currentStepIdx = currentProject
    ? RESEARCH_STEP_ORDER.indexOf(
        currentProject.currentStep as (typeof RESEARCH_STEP_ORDER)[number],
      )
    : -1;

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-card border-b shadow-card">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Recherche Scientifique
              </h1>
              <p className="text-sm text-muted-foreground">
                Réalisez votre TFC, Mémoire ou Thèse guidé par l'IA Directeur de
                Recherche
              </p>
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="ml-auto gap-2"
              data-ocid="research.new_project_button"
            >
              <Plus className="w-4 h-4" />
              Nouveau projet
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <AnimatePresence mode="wait">
          {/* Empty state — no projects yet */}
          {!isLoading && (!projects || projects.length === 0) && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border shadow-card p-12 text-center max-w-xl mx-auto"
              data-ocid="research.main.empty_state"
            >
              <div className="w-20 h-20 rounded-2xl gradient-ministry mx-auto flex items-center justify-center mb-6">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Votre Directeur de Recherche IA
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Notre IA vous accompagne de A à Z dans la rédaction de votre
                travail scientifique avec une méthodologie stricte en 6 étapes
                verrouillées.
              </p>
              {/* Supported types */}
              <div className="flex justify-center gap-3 mb-6">
                {RESEARCH_TYPES.map((t) => (
                  <div
                    key={t}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 border border-border min-w-[80px]"
                  >
                    <School className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      {RESEARCH_TYPE_LABELS[t]}
                    </span>
                    <span className="text-xs text-muted-foreground text-center leading-tight">
                      {RESEARCH_TYPE_DESCRIPTIONS[t].split(" (")[0]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-center mb-2">
                {[
                  "Sujet",
                  "Problématique",
                  "Hypothèses",
                  "Méthodologie",
                  "Plan",
                  "Rédaction",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                      {step}
                    </span>
                    {i < 5 && (
                      <ChevronRight className="size-2.5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Chaque étape est verrouillée jusqu'à validation par l'IA
              </p>
              <Button
                size="lg"
                onClick={() => setShowCreate(true)}
                data-ocid="research.start_button"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Démarrer ma recherche
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace */}
        {(isLoading || (projects && projects.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5">
            {/* Left sidebar: projects list */}
            <aside>
              <div className="bg-card rounded-xl border shadow-card overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-foreground text-sm">
                    Mes Projets
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreate(true)}
                    className="h-7 gap-1 text-xs"
                    data-ocid="research.sidebar_new_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nouveau
                  </Button>
                </div>
                <div className="p-3 space-y-2">
                  {isLoading ? (
                    <>
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                      ))}
                    </>
                  ) : projects?.length === 0 ? (
                    <div
                      data-ocid="research.projects.empty_state"
                      className="py-8 text-center"
                    >
                      <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Aucun projet
                      </p>
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() => setShowCreate(true)}
                        className="text-xs mt-1"
                      >
                        Créer
                      </Button>
                    </div>
                  ) : (
                    projects?.map((project, idx) => (
                      <ProjectCard
                        key={project.id.toString()}
                        project={project}
                        isSelected={selectedId === project.id}
                        onClick={() => setSelectedId(project.id)}
                        index={idx + 1}
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Main workspace */}
            <main>
              {!currentProject && !isLoadingProject ? (
                <div
                  data-ocid="research.workspace.empty_state"
                  className="bg-card rounded-xl border shadow-card p-12 text-center"
                >
                  <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    Sélectionnez un projet
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Choisissez un projet dans la liste pour ouvrir votre espace
                    de travail.
                  </p>
                </div>
              ) : isLoadingProject ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ) : currentProject ? (
                <div className="space-y-4">
                  {/* Progress header */}
                  <div className="bg-card rounded-xl border shadow-card p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {currentProject.researchType && (
                            <Badge variant="outline" className="text-xs">
                              {
                                RESEARCH_TYPE_LABELS[
                                  currentProject.researchType
                                ]
                              }
                            </Badge>
                          )}
                          {currentProject.domain && (
                            <span className="text-xs text-muted-foreground">
                              {currentProject.domain}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display font-bold text-foreground truncate">
                          {currentProject.title}
                        </h2>
                        {currentProject.institution && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {currentProject.institution}
                            {currentProject.directorName
                              ? ` — Dir. ${currentProject.directorName}`
                              : ""}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Étape {currentStepIdx + 1} sur 6 —{" "}
                            <strong className="text-foreground">
                              {RESEARCH_STEP_LABELS[currentProject.currentStep]}
                            </strong>
                          </span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              STATUS_COLORS[currentProject.status],
                            )}
                          >
                            {RESEARCH_STATUS_LABELS[currentProject.status]}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary shrink-0">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {
                        currentProject.steps.filter(([, sd]) => sd.validated)
                          .length
                      }{" "}
                      étape
                      {currentProject.steps.filter(([, sd]) => sd.validated)
                        .length !== 1
                        ? "s"
                        : ""}{" "}
                      validée
                      {currentProject.steps.filter(([, sd]) => sd.validated)
                        .length !== 1
                        ? "s"
                        : ""}{" "}
                      sur 6
                    </p>
                  </div>

                  {/* Step Panel */}
                  <ResearchStepPanel project={currentProject} />
                </div>
              ) : null}
            </main>

            {/* Right sidebar: step progress + resources */}
            <aside className="space-y-4">
              {currentProject && (
                <>
                  <div className="bg-card rounded-xl border shadow-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                      Progression
                    </p>
                    <VerticalStepSidebar project={currentProject} />
                  </div>
                  <RecommendedResources
                    topic={`${currentProject.title} ${currentProject.domain ?? ""}`}
                  />
                </>
              )}
            </aside>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent
          className="max-w-lg"
          data-ocid="research.create_project.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              Nouveau Projet de Recherche
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Research type */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Type de travail <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {RESEARCH_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    data-ocid={`research.create_project.type.${t}`}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-smooth",
                      newType === t
                        ? "bg-primary/5 border-primary/40 text-primary"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    <p className="font-bold text-sm">
                      {RESEARCH_TYPE_LABELS[t]}
                    </p>
                    <p className="text-xs mt-0.5 leading-tight">
                      {RESEARCH_TYPE_DESCRIPTIONS[t].split(" (")[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label
                htmlFor="research-title"
                className="text-sm font-semibold mb-1.5 block"
              >
                Titre de votre travail{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="research-title"
                data-ocid="research.create_project.input"
                placeholder="Ex: Impact de la numérisation sur les PME en RDC"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !createMutation.isPending &&
                  handleCreate()
                }
                autoFocus
              />
            </div>

            {/* Domain + Institution */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="research-domain"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Filière / Domaine
                </Label>
                <Input
                  id="research-domain"
                  placeholder="ex: Sciences économiques"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  data-ocid="research.create_project.domain_input"
                />
              </div>
              <div>
                <Label
                  htmlFor="research-institution"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Institution
                </Label>
                <Input
                  id="research-institution"
                  placeholder="ex: UNIKIN, ISP…"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  data-ocid="research.create_project.institution_input"
                />
              </div>
            </div>

            {/* Director */}
            <div>
              <Label
                htmlFor="research-director"
                className="text-sm font-medium mb-1.5 block"
              >
                Nom du directeur
              </Label>
              <Input
                id="research-director"
                placeholder="ex: Prof. Dr. Jean-Pierre Mutombo"
                value={newDirector}
                onChange={(e) => setNewDirector(e.target.value)}
                data-ocid="research.create_project.director_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreate(false)}
              data-ocid="research.create_project.cancel_button"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTitle.trim() || createMutation.isPending}
              data-ocid="research.create_project.confirm_button"
            >
              {createMutation.isPending ? "Création..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
