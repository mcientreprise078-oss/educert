import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminModelConfig,
  useListAllGenerations,
  useListResources,
  useSetAdminModelConfig,
} from "@/lib/queries";
import type { AIModelConfig, GenerationStatus } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  CheckCircle,
  ChevronRight,
  Clock,
  FileStack,
  Layers,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const GEN_STATUS_LABELS: Record<GenerationStatus, string> = {
  queued: "En file d'attente",
  step1_deepseek: "DeepSeek en cours",
  step2_qwen: "Qwen en cours",
  step3_gpt4o: "GPT-4o en cours",
  approved: "Approuvé",
  rejected: "Rejeté",
  revision_needed: "Révision demandée",
};

const GEN_STATUS_VARIANT: Record<
  GenerationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  queued: "secondary",
  step1_deepseek: "secondary",
  step2_qwen: "secondary",
  step3_gpt4o: "secondary",
  approved: "default",
  rejected: "destructive",
  revision_needed: "outline",
};

const STRUCTURE_MODEL_OPTIONS = [
  { value: "DeepSeek R1", label: "DeepSeek R1 (Recommandé)" },
  { value: "Qwen 72B", label: "Qwen 72B" },
  { value: "Claude Opus", label: "Claude Opus" },
];

const CONTENT_MODEL_OPTIONS = [
  { value: "Qwen 72B", label: "Qwen 72B (Recommandé)" },
  { value: "DeepSeek R1", label: "DeepSeek R1" },
  { value: "Claude Sonnet", label: "Claude Sonnet" },
];

const VALIDATION_MODEL_OPTIONS = [
  { value: "GPT-4o", label: "GPT-4o (Recommandé)" },
  { value: "Claude Opus", label: "Claude Opus" },
  { value: "GPT-5", label: "GPT-5" },
  { value: "Claude Sonnet", label: "Claude Sonnet" },
];

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 px-5 pb-5">
        <Skeleton className="h-5 w-5 rounded mb-3" />
        <Skeleton className="h-8 w-12 mb-1" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function AIModelSettingsPanel() {
  const { data: config, isLoading } = useGetAdminModelConfig();
  const setConfig = useSetAdminModelConfig();
  const [local, setLocal] = useState<AIModelConfig>({
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o",
  });

  useEffect(() => {
    if (config) setLocal(config);
  }, [config]);

  const handleSave = () => {
    setConfig.mutate(local, {
      onSuccess: () =>
        toast.success("Configuration des modèles IA enregistrée"),
      onError: () => toast.error("Erreur lors de l'enregistrement"),
    });
  };

  return (
    <Card data-ocid="admin_dashboard.model_settings_panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="size-4 text-accent" />
          Configurer les modèles IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {(["a", "b", "c"] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Sequential flow visualization */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground">
                Flux séquentiel :
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                1. Structure
              </span>
              <ChevronRight className="size-3 shrink-0" />
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-medium">
                2. Contenu
              </span>
              <ChevronRight className="size-3 shrink-0" />
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                3. Validation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Structure model */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Modèle de structure
                </Label>
                <Select
                  value={local.structureModel}
                  onValueChange={(v) =>
                    setLocal({ ...local, structureModel: v })
                  }
                >
                  <SelectTrigger data-ocid="admin_dashboard.structure_model_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STRUCTURE_MODEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Génère le plan pédagogique du cours
                </p>
              </div>

              {/* Content model */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Modèle de contenu
                </Label>
                <Select
                  value={local.contentModel}
                  onValueChange={(v) => setLocal({ ...local, contentModel: v })}
                >
                  <SelectTrigger data-ocid="admin_dashboard.content_model_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_MODEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Rédige les leçons en français
                </p>
              </div>

              {/* Validation model */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Modèle de validation
                </Label>
                <Select
                  value={local.validationModel}
                  onValueChange={(v) =>
                    setLocal({ ...local, validationModel: v })
                  }
                >
                  <SelectTrigger data-ocid="admin_dashboard.validation_model_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALIDATION_MODEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Valide avant publication
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={setConfig.isPending}
                size="sm"
                className="gap-2"
                data-ocid="admin_dashboard.save_model_config_button"
              >
                <Save className="size-3.5" />
                {setConfig.isPending
                  ? "Enregistrement..."
                  : "Enregistrer la configuration"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: resources = [], isLoading: resourcesLoading } =
    useListResources();
  const { data: generations = [], isLoading: generationsLoading } =
    useListAllGenerations();

  const isLoading = resourcesLoading || generationsLoading;

  const totalResources = resources.length;
  const indexedResources = resources.filter(
    (r) => r.status === "indexed",
  ).length;
  const pendingApprovals = generations.filter(
    (g) => g.status === "step3_gpt4o",
  ).length;
  const approvedCount = generations.filter(
    (g) => g.status === "approved",
  ).length;
  const totalGenerations = generations.length;

  const stats = [
    {
      label: "Ressources totales",
      value: totalResources,
      sub: `${indexedResources} indexées`,
      icon: FileStack,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Générations demandées",
      value: totalGenerations,
      sub: "toutes demandes",
      icon: Sparkles,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "En attente d'approbation",
      value: pendingApprovals,
      sub: "GPT-4o validé",
      icon: Clock,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Cours approuvés",
      value: approvedCount,
      sub: "publiés officiellement",
      icon: CheckCircle,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const quickActions = [
    {
      label: "Bibliothèque",
      description: `${totalResources} ressources`,
      icon: BookOpen,
      href: "/admin/resources",
      ocid: "admin_dashboard.nav_resources",
    },
    {
      label: "Générations IA",
      description: `${totalGenerations} demandes`,
      icon: Layers,
      href: "/admin/generations",
      ocid: "admin_dashboard.nav_generations",
    },
    {
      label: "Approbations",
      description: `${pendingApprovals} en attente`,
      icon: CheckCircle,
      href: "/admin/approvals",
      ocid: "admin_dashboard.nav_approvals",
      urgent: pendingApprovals > 0,
    },
    {
      label: "Paramètres IA",
      description: "Configurer les modèles",
      icon: Bot,
      href: "/admin/settings",
      ocid: "admin_dashboard.nav_settings",
    },
  ];

  return (
    <AdminGuard>
      <Layout>
        <div className="space-y-8" data-ocid="admin_dashboard.page">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  Administration
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Ministère de la Formation Professionnelle — République
                Démocratique du Congo
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.reload()}
              data-ocid="admin_dashboard.refresh_button"
            >
              <RefreshCw className="size-3.5" />
              Actualiser
            </Button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? (["a", "b", "c", "d"] as const).map((k) => (
                  <StatCardSkeleton key={k} />
                ))
              : stats.map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-border shadow-card hover:shadow-elevated transition-smooth"
                  >
                    <CardContent className="pt-5 px-5 pb-5">
                      <div
                        className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                      >
                        <stat.icon className={`size-4 ${stat.color}`} />
                      </div>
                      <p className="text-3xl font-bold text-foreground font-display">
                        {stat.value}
                      </p>
                      <p className="text-xs font-medium text-foreground mt-0.5">
                        {stat.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stat.sub}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Quick nav tiles */}
          <div>
            <h2 className="font-display font-semibold text-base text-foreground mb-3">
              Accès rapide
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  type="button"
                  key={action.label}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-smooth text-left ${
                    action.urgent
                      ? "border-destructive/40 bg-destructive/5 hover:bg-destructive/10"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                  onClick={() => navigate({ to: action.href })}
                  data-ocid={action.ocid}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        action.urgent ? "bg-destructive/15" : "bg-primary/10"
                      }`}
                    >
                      <action.icon
                        className={`size-4 ${action.urgent ? "text-destructive" : "text-primary"}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Model Settings */}
          <AIModelSettingsPanel />

          {/* Recent generations */}
          <Card data-ocid="admin_dashboard.recent_generations">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  Activité récente — Générations IA
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground gap-1"
                  onClick={() => navigate({ to: "/admin/generations" })}
                  data-ocid="admin_dashboard.view_all_generations"
                >
                  Tout voir <ChevronRight className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="px-6 py-4 space-y-3">
                  {(["x", "y", "z"] as const).map((k) => (
                    <div key={k} className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-3.5 w-3/4 mb-1.5" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : generations.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground text-sm"
                  data-ocid="admin_dashboard.empty_state"
                >
                  <Sparkles className="size-8 mx-auto mb-2 opacity-40" />
                  <p>Aucune génération de cours pour le moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {generations.slice(0, 5).map((gen, i) => (
                    <div
                      key={gen.id}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors duration-150"
                      data-ocid={`admin_dashboard.generation_item.${i + 1}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Sparkles className="size-3.5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {gen.requestDescription}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={GEN_STATUS_VARIANT[gen.status]}
                        className="ml-2 shrink-0 text-xs"
                      >
                        {GEN_STATUS_LABELS[gen.status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource overview */}
          <Card data-ocid="admin_dashboard.resource_overview">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileStack className="size-4 text-primary" />
                  Vue d'ensemble des ressources
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground gap-1"
                  onClick={() => navigate({ to: "/admin/resources" })}
                  data-ocid="admin_dashboard.view_all_resources"
                >
                  Gérer <ChevronRight className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex gap-6">
                  {(["p", "q", "r"] as const).map((k) => (
                    <Skeleton key={k} className="h-12 w-24 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total",
                      value: totalResources,
                      color: "text-foreground",
                    },
                    {
                      label: "Indexées",
                      value: indexedResources,
                      color: "text-primary",
                    },
                    {
                      label: "En attente",
                      value: resources.filter((r) => r.status === "pending")
                        .length,
                      color: "text-accent",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-3 rounded-lg bg-muted/40"
                    >
                      <p
                        className={`text-2xl font-bold font-display ${item.color}`}
                      >
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </AdminGuard>
  );
}
