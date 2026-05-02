import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetAdminModelConfig, useSetAdminModelConfig } from "@/lib/queries";
import type { AIModelConfig } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Bot,
  ChevronRight,
  Crown,
  ExternalLink,
  Save,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STRUCTURE_MODEL_OPTIONS = [
  {
    value: "DeepSeek R1",
    label: "DeepSeek R1",
    description: "Idéal pour la structuration pédagogique",
  },
  {
    value: "Qwen 72B",
    label: "Qwen 72B",
    description: "Multilingue, fort en raisonnement",
  },
  {
    value: "Claude Opus",
    label: "Claude Opus",
    description: "Haute précision analytique",
  },
  {
    value: "Gemini Flash",
    label: "Gemini Flash",
    description: "Ultra-rapide, idéal pour les ébauches",
  },
];

const CONTENT_MODEL_OPTIONS = [
  {
    value: "Qwen 72B",
    label: "Qwen 72B",
    description: "Excellent en français, fluide",
  },
  {
    value: "DeepSeek R1",
    label: "DeepSeek R1",
    description: "Riche en détails techniques",
  },
  {
    value: "Claude Sonnet",
    label: "Claude Sonnet",
    description: "Style naturel et pédagogique",
  },
  {
    value: "Gemini Flash",
    label: "Gemini Flash",
    description: "Génération rapide en français",
  },
];

const VALIDATION_MODEL_OPTIONS = [
  {
    value: "GPT-4o",
    label: "GPT-4o",
    description: "Validation rapide et précise",
  },
  {
    value: "Claude Opus",
    label: "Claude Opus",
    description: "Révision approfondie",
  },
  { value: "GPT-5", label: "GPT-5", description: "Dernière génération OpenAI" },
  {
    value: "Claude Sonnet",
    label: "Claude Sonnet",
    description: "Équilibre vitesse/qualité",
  },
  {
    value: "Gemini Flash",
    label: "Gemini Flash",
    description: "Google Gemini — rapide et fiable",
  },
];

interface ModelSelectProps {
  label: string;
  description: string;
  step: string;
  value: string;
  options: Array<{ value: string; label: string; description: string }>;
  onChange: (value: string) => void;
  ocid: string;
}

function ModelSelect({
  label,
  description,
  step,
  value,
  options,
  onChange,
  ocid,
}: ModelSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3 mb-1">
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          {step}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-ocid={ocid}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex flex-col">
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { data: config, isLoading } = useGetAdminModelConfig();
  const setConfig = useSetAdminModelConfig();
  const notificationsEnabled = true;
  const setNotifications = {
    mutate: (_v: boolean, _opts?: object) => {},
    isPending: false,
  };
  const [local, setLocal] = useState<AIModelConfig>({
    structureModel: "DeepSeek R1",
    contentModel: "Qwen 72B",
    validationModel: "GPT-4o",
  });

  useEffect(() => {
    if (config) setLocal(config);
  }, [config]);

  const hasChanges =
    config &&
    (config.structureModel !== local.structureModel ||
      config.contentModel !== local.contentModel ||
      config.validationModel !== local.validationModel);

  const handleSave = () => {
    setConfig.mutate(local, {
      onSuccess: () =>
        toast.success("Configuration des modèles IA enregistrée"),
      onError: () => toast.error("Erreur lors de l'enregistrement"),
    });
  };

  return (
    <AdminGuard adminOnly>
      <Layout>
        <div
          className="max-w-2xl mx-auto space-y-6"
          data-ocid="admin_settings.page"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => navigate({ to: "/admin" })}
              data-ocid="admin_settings.back_button"
              aria-label="Retour au tableau de bord"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Paramètres IA
              </h1>
              <p className="text-muted-foreground text-sm">
                Configurez les modèles d'intelligence artificielle utilisés pour
                générer les cours
              </p>
            </div>
          </div>

          {/* Flux visuel */}
          <Card className="bg-muted/30">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">
                    Flux de génération séquentiel
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    1. Structure
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    2. Contenu (FR)
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                    3. Validation
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gemini Flash badge */}
          <Card className="border-amber-400/30 bg-amber-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2.5 shrink-0">
                  <Zap className="size-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Gemini Flash (Google) disponible
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nouveau modèle ultra-rapide de Google intégré dans toutes
                    les étapes de génération.
                  </p>
                </div>
                <span className="shrink-0 text-[10px] bg-amber-500/15 text-amber-700 border border-amber-400/30 rounded-full px-2 py-1 font-semibold uppercase tracking-wide">
                  Nouveau
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Model config card */}
          <Card data-ocid="admin_settings.model_config_card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="size-4 text-accent" />
                Configurer les modèles IA
              </CardTitle>
              <CardDescription>
                Chaque étape de génération utilise un modèle distinct.
                Choisissez le modèle le mieux adapté à chaque rôle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {(["a", "b", "c"] as const).map((k) => (
                    <div key={k} className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <ModelSelect
                    label="Modèle de structure"
                    description="Génère le plan pédagogique, les modules et les objectifs d'apprentissage"
                    step="1"
                    value={local.structureModel}
                    options={STRUCTURE_MODEL_OPTIONS}
                    onChange={(v) => setLocal({ ...local, structureModel: v })}
                    ocid="admin_settings.structure_model_select"
                  />

                  <div className="border-t border-border/60" />

                  <ModelSelect
                    label="Modèle de contenu"
                    description="Rédige les leçons, exercices et quiz en français à partir des ressources"
                    step="2"
                    value={local.contentModel}
                    options={CONTENT_MODEL_OPTIONS}
                    onChange={(v) => setLocal({ ...local, contentModel: v })}
                    ocid="admin_settings.content_model_select"
                  />

                  <div className="border-t border-border/60" />

                  <ModelSelect
                    label="Modèle de validation"
                    description="Valide la cohérence pédagogique et approuve le cours avant publication"
                    step="3"
                    value={local.validationModel}
                    options={VALIDATION_MODEL_OPTIONS}
                    onChange={(v) => setLocal({ ...local, validationModel: v })}
                    ocid="admin_settings.validation_model_select"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* VIP Domains shortcut */}
          <Card
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            data-ocid="admin_settings.vip_domains_card"
            onClick={() => navigate({ to: "/admin/domains" })}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 shrink-0">
                  <Crown className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Gérer les domaines VIP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Catégoriser les domaines complexes, activer l'approbation
                    manuelle pour les certificats Premium.
                  </p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* In-app notifications toggle */}
          <Card data-ocid="admin_settings.notifications_card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-accent" />
                Notifications in-app
              </CardTitle>
              <CardDescription>
                Activez l'IA Booster pour envoyer des rappels automatiques aux
                apprenants inactifs depuis plus de 24h.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    IA Booster — Rappels automatiques
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    L'IA analyse l'inactivité et envoie des messages
                    personnalisés aux apprenants en décrochage.
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) =>
                    setNotifications.mutate(checked, {
                      onSuccess: () =>
                        toast.success(
                          checked
                            ? "Notifications activées"
                            : "Notifications désactivées",
                        ),
                    })
                  }
                  data-ocid="admin_settings.notifications_toggle"
                  aria-label="Activer les notifications in-app"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save footer */}
          <div className="flex items-center justify-between py-2">
            {hasChanges ? (
              <p className="text-xs text-accent font-medium">
                • Modifications non enregistrées
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Configuration actuelle en cours d'utilisation
              </p>
            )}
            <Button
              onClick={handleSave}
              disabled={setConfig.isPending || isLoading}
              className="gap-2"
              data-ocid="admin_settings.save_button"
            >
              <Save className="size-4" />
              {setConfig.isPending
                ? "Enregistrement..."
                : "Enregistrer la configuration"}
            </Button>
          </div>
        </div>
      </Layout>
    </AdminGuard>
  );
}
