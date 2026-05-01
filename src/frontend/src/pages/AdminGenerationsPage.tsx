import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveGeneration,
  useListAllGenerations,
  useListResources,
  useRejectGeneration,
  useTriggerAIGeneration,
} from "@/lib/queries";
import type { CourseGeneration, GenerationStatus } from "@/lib/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ---- Status config ----

interface StatusConfig {
  label: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_CONFIG: Record<GenerationStatus, StatusConfig> = {
  queued: {
    label: "En file d'attente",
    badgeVariant: "secondary",
    badgeClass: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  step1_deepseek: {
    label: "DeepSeek — Étape 1",
    badgeVariant: "secondary",
    badgeClass: "bg-primary/15 text-primary border-primary/20",
    icon: Loader2,
  },
  step2_qwen: {
    label: "Qwen — Étape 2",
    badgeVariant: "secondary",
    badgeClass: "bg-accent/15 text-accent border-accent/20",
    icon: Loader2,
  },
  step3_gpt4o: {
    label: "GPT-4o — Étape 3",
    badgeVariant: "secondary",
    badgeClass: "bg-chart-3/15 text-chart-3 border-chart-3/20",
    icon: Loader2,
  },
  approved: {
    label: "Approuvé",
    badgeVariant: "default",
    badgeClass: "",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejeté",
    badgeVariant: "destructive",
    badgeClass: "",
    icon: XCircle,
  },
  revision_needed: {
    label: "Révision demandée",
    badgeVariant: "outline",
    badgeClass: "border-accent/40 text-accent bg-accent/10",
    icon: RefreshCw,
  },
};

const ACTIVE_STATUSES: GenerationStatus[] = [
  "step1_deepseek",
  "step2_qwen",
  "step3_gpt4o",
];

const STEPS: Array<{ status: GenerationStatus; label: string; model: string }> =
  [
    {
      status: "step1_deepseek",
      label: "Structure pédagogique",
      model: "DeepSeek",
    },
    { status: "step2_qwen", label: "Contenu en français", model: "Qwen" },
    {
      status: "step3_gpt4o",
      label: "Validation & Approbation",
      model: "GPT-4o",
    },
  ];

const STATUS_ORDER: GenerationStatus[] = [
  "queued",
  "step1_deepseek",
  "step2_qwen",
  "step3_gpt4o",
  "approved",
];

function AIStepProgress({ status }: { status: GenerationStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const stepStatusIndex = STATUS_ORDER.indexOf(step.status);
        const isCompleted =
          status === "approved" || currentIndex > stepStatusIndex;
        const isActive = status === step.status;

        return (
          <div key={step.status} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-smooth ${
                isCompleted
                  ? "bg-primary/10 text-primary border-primary/20 font-medium"
                  : isActive
                    ? "bg-accent/15 text-accent border-accent/20 font-medium"
                    : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="size-3 shrink-0" />
              ) : isActive ? (
                <Loader2 className="size-3 shrink-0 animate-spin" />
              ) : (
                <span className="size-3 shrink-0 flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
              )}
              <span className="hidden sm:inline">{step.model}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-4 h-px mx-0.5 ${
                  isCompleted ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TriggerGenerationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: resources = [] } = useListResources();
  const triggerGeneration = useTriggerAIGeneration();
  const [description, setDescription] = useState("");

  const indexedResources = resources.filter((r) => r.status === "indexed");

  const handleTrigger = () => {
    if (!description.trim()) {
      toast.error("Veuillez décrire la formation à générer");
      return;
    }
    triggerGeneration.mutate("new", {
      onSuccess: () => {
        toast.success("Génération déclenchée — DeepSeek démarre...");
        setDescription("");
        onClose();
      },
      onError: () => toast.error("Erreur lors du déclenchement"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md"
        data-ocid="admin_generations.trigger_dialog"
      >
        <DialogHeader>
          <DialogTitle>Déclencher une nouvelle génération</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
            <p className="font-medium mb-1">Flux IA séquentiel</p>
            <p className="text-xs text-muted-foreground">
              DeepSeek → structure pédagogique · Qwen → contenu en français ·
              GPT-4o → validation
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gen-desc">Description de la formation *</Label>
            <Textarea
              id="gen-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Formation complète en gestion financière pour les PME congolaises, incluant la comptabilité OHADA et la fiscalité locale..."
              rows={4}
              className="resize-none"
              data-ocid="admin_generations.trigger_description_textarea"
            />
            <p className="text-xs text-muted-foreground">
              {indexedResources.length} ressource
              {indexedResources.length !== 1 ? "s" : ""} indexée
              {indexedResources.length !== 1 ? "s" : ""} disponible
              {indexedResources.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_generations.trigger_cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleTrigger}
            disabled={triggerGeneration.isPending}
            data-ocid="admin_generations.trigger_submit_button"
          >
            {triggerGeneration.isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Déclenchement...
              </>
            ) : (
              <>
                <Play className="size-4 mr-2" />
                Lancer la génération
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GenerationCard({
  gen,
  index,
}: {
  gen: CourseGeneration;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const approveGeneration = useApproveGeneration();
  const rejectGeneration = useRejectGeneration();
  const triggerGeneration = useTriggerAIGeneration();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const config = STATUS_CONFIG[gen.status];
  const Icon = config.icon;
  const isActive = ACTIVE_STATUSES.includes(gen.status);
  const canTrigger = gen.status === "queued";
  const canReview = gen.status === "step3_gpt4o";

  const handleApprove = () => {
    approveGeneration.mutate(
      { id: gen.id, notes: "" },
      {
        onSuccess: () => toast.success("Cours approuvé et publié"),
        onError: () => toast.error("Erreur lors de l'approbation"),
      },
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Veuillez indiquer la raison du rejet");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason: rejectReason },
      {
        onSuccess: () => {
          toast.success("Cours rejeté");
          setShowRejectInput(false);
          setRejectReason("");
        },
        onError: () => toast.error("Erreur lors du rejet"),
      },
    );
  };

  const handleTrigger = () => {
    triggerGeneration.mutate(gen.id, {
      onSuccess: () => toast.success("Génération déclenchée"),
      onError: () => toast.error("Erreur lors du déclenchement"),
    });
  };

  const iconColorClass = isActive ? "text-accent" : "text-muted-foreground";

  return (
    <Card
      className={`border-border transition-smooth ${isActive ? "ring-1 ring-accent/30" : ""}`}
      data-ocid={`admin_generations.item.${index + 1}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isActive ? "bg-accent/15" : "bg-muted/60"
            }`}
          >
            <Icon
              className={`size-4 ${iconColorClass} ${isActive ? "animate-spin" : ""}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground line-clamp-2 mb-2">
              {gen.requestDescription}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant={config.badgeVariant}
                className={`text-xs ${config.badgeClass}`}
              >
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {gen.resourceIds.length} ressource
                {gen.resourceIds.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canTrigger && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={handleTrigger}
                disabled={triggerGeneration.isPending}
                data-ocid={`admin_generations.trigger_button.${index + 1}`}
              >
                <Play className="size-3" />
                Déclencher
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              onClick={() => setExpanded((p) => !p)}
              data-ocid={`admin_generations.expand_button.${index + 1}`}
            >
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <AIStepProgress status={gen.status} />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 pb-4">
          <div className="border-t border-border pt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                Description complète
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {gen.requestDescription}
              </p>
            </div>

            {gen.steps.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Sorties IA ({gen.steps.length} étape
                  {gen.steps.length !== 1 ? "s" : ""} complétée
                  {gen.steps.length !== 1 ? "s" : ""})
                </p>
                <div className="space-y-2">
                  {gen.steps.map((step) => {
                    const stepLabel =
                      step.model === "deepseek"
                        ? "DeepSeek — Structure pédagogique"
                        : step.model === "qwen"
                          ? "Qwen — Contenu en français"
                          : "GPT-4o — Validation";
                    const isExp = expandedStep === step.step;
                    return (
                      <div
                        key={step.step}
                        className="rounded-lg border border-border overflow-hidden"
                      >
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/30 transition-colors"
                          onClick={() =>
                            setExpandedStep(isExp ? null : step.step)
                          }
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="size-3.5 text-primary shrink-0" />
                            <span className="text-xs font-medium text-foreground">
                              {stepLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {step.completedAt && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(step.completedAt).toLocaleTimeString(
                                  "fr-FR",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            )}
                            {isExp ? (
                              <ChevronUp className="size-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="size-3.5 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                        {isExp && step.output && (
                          <div className="px-3 pb-3 pt-1 bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                            {step.output}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {gen.resourceIds.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Ressources utilisées ({gen.resourceIds.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {gen.resourceIds.map((rid) => (
                    <Badge key={rid} variant="outline" className="text-xs">
                      {rid}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {canReview && (
              <div className="border-t border-border pt-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Action ministérielle
                </p>
                {showRejectInput && (
                  <div className="space-y-2">
                    <Label
                      htmlFor={`reject-reason-${gen.id}`}
                      className="text-xs"
                    >
                      Motif du rejet *
                    </Label>
                    <Textarea
                      id={`reject-reason-${gen.id}`}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Expliquez la raison du rejet..."
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleApprove}
                    disabled={approveGeneration.isPending}
                    data-ocid={`admin_generations.approve_button.${index + 1}`}
                  >
                    <CheckCircle className="size-4" />
                    Approuver
                  </Button>
                  {showRejectInput ? (
                    <>
                      <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={handleReject}
                        disabled={rejectGeneration.isPending}
                        data-ocid={`admin_generations.reject_confirm_button.${index + 1}`}
                      >
                        <XCircle className="size-4" />
                        Confirmer le rejet
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowRejectInput(false);
                          setRejectReason("");
                        }}
                        data-ocid={`admin_generations.reject_cancel_button.${index + 1}`}
                      >
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/5"
                      onClick={() => setShowRejectInput(true)}
                      data-ocid={`admin_generations.reject_button.${index + 1}`}
                    >
                      <XCircle className="size-4" />
                      Rejeter
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminGenerationsPage() {
  const { data: generations = [], isLoading } = useListAllGenerations();
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<GenerationStatus | "all">(
    "all",
  );

  const filters: Array<{ value: GenerationStatus | "all"; label: string }> = [
    { value: "all", label: "Toutes" },
    { value: "queued", label: "En attente" },
    { value: "step1_deepseek", label: "DeepSeek" },
    { value: "step2_qwen", label: "Qwen" },
    { value: "step3_gpt4o", label: "GPT-4o" },
    { value: "approved", label: "Approuvés" },
    { value: "rejected", label: "Rejetés" },
  ];

  const filteredGenerations =
    statusFilter === "all"
      ? generations
      : generations.filter((g) => g.status === statusFilter);

  const pendingCount = generations.filter(
    (g) => g.status === "step3_gpt4o",
  ).length;
  const activeCount = generations.filter((g) =>
    ACTIVE_STATUSES.includes(g.status),
  ).length;

  return (
    <AdminGuard>
      <Layout>
        <div className="space-y-6" data-ocid="admin_generations.page">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Générations de cours IA
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Flux séquentiel : DeepSeek → Qwen → GPT-4o
              </p>
            </div>
            <Button
              onClick={() => setTriggerOpen(true)}
              className="gap-2 shrink-0"
              data-ocid="admin_generations.new_generation_button"
            >
              <Sparkles className="size-4" />
              Nouvelle génération
            </Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              {
                label: "Total",
                value: generations.length,
                color: "text-foreground",
              },
              { label: "En cours", value: activeCount, color: "text-accent" },
              {
                label: "En attente d'approbation",
                value: pendingCount,
                color: "text-destructive",
              },
              {
                label: "Approuvés",
                value: generations.filter((g) => g.status === "approved")
                  .length,
                color: "text-primary",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm"
              >
                <span className={`font-bold font-display ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-xs">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {filters.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1 text-xs rounded-full border transition-smooth ${
                  statusFilter === value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
                data-ocid={`admin_generations.filter_${value}`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div
              className="space-y-4"
              data-ocid="admin_generations.loading_state"
            >
              {(["a", "b", "c"] as const).map((k) => (
                <Card key={k}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/3 mb-3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGenerations.length === 0 ? (
            <Card>
              <CardContent
                className="flex flex-col items-center justify-center py-16"
                data-ocid="admin_generations.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                  <Layers className="size-8 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground text-lg mb-2">
                  Aucune génération
                </p>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                  {statusFilter !== "all"
                    ? "Aucune génération avec ce statut."
                    : "Déclenchez votre première génération de cours IA pour démarrer."}
                </p>
                {statusFilter === "all" && (
                  <Button
                    onClick={() => setTriggerOpen(true)}
                    data-ocid="admin_generations.empty_trigger_button"
                  >
                    <Sparkles className="size-4 mr-2" />
                    Première génération
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredGenerations.map((gen, i) => (
                <GenerationCard key={gen.id} gen={gen} index={i} />
              ))}
            </div>
          )}
        </div>

        <TriggerGenerationDialog
          open={triggerOpen}
          onClose={() => setTriggerOpen(false)}
        />
      </Layout>
    </AdminGuard>
  );
}
