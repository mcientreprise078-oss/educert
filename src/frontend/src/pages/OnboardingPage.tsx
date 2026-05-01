import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useSaveUserProfile } from "@/lib/queries";
import type { UserRole } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Shield,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type RoleOption = {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "user" | "management";
  accent: "primary" | "gold" | "ministry";
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "learner",
    label: "Je veux apprendre",
    description:
      "Accédez à des centaines de formations professionnelles et obtenez des certifications reconnues.",
    icon: GraduationCap,
    group: "user",
    accent: "primary",
  },
  {
    role: "instructor",
    label: "Je veux enseigner",
    description:
      "Créez et vendez vos formations, partagez votre expertise avec des milliers d'apprenants.",
    icon: BookOpen,
    group: "user",
    accent: "primary",
  },
  {
    role: "admin",
    label: "Administrateur EDUCERT",
    description: "Gérer la plateforme, les ressources et les utilisateurs.",
    icon: Shield,
    group: "management",
    accent: "gold",
  },
  {
    role: "ministryReviewer",
    label: "Réviseur Ministériel",
    description: "Approuver et valider les formations officielles.",
    icon: Star,
    group: "management",
    accent: "ministry",
  },
];

const REDIRECT_BY_ROLE: Record<UserRole, string> = {
  learner: "/catalog",
  instructor: "/instructor",
  admin: "/admin",
  ministryReviewer: "/admin/approvals",
  guest: "/",
};

const ROLE_DISPLAY_LABELS: Record<UserRole, string> = {
  learner: "Apprenant",
  instructor: "Formateur",
  admin: "Administrateur",
  ministryReviewer: "Réviseur Ministériel",
  guest: "Visiteur",
};

const ROLE_ICONS: Record<
  UserRole,
  React.ComponentType<{ className?: string }>
> = {
  learner: GraduationCap,
  instructor: BookOpen,
  admin: Shield,
  ministryReviewer: Star,
  guest: GraduationCap,
};

function RoleCard({
  option,
  onClick,
}: {
  option: RoleOption;
  onClick: () => void;
}) {
  const Icon = option.icon;
  const isManagement = option.group === "management";
  const isAdmin = option.role === "admin";

  const iconBg = isAdmin
    ? "bg-amber-500/10 group-hover:bg-amber-500/20"
    : isManagement
      ? "bg-primary/10 group-hover:bg-primary/20"
      : "bg-primary/10 group-hover:bg-primary/20";

  const iconColor = isAdmin
    ? "text-amber-600"
    : isManagement
      ? "text-primary"
      : "text-primary";

  const borderHover = isAdmin
    ? "hover:border-amber-500 hover:shadow-[0_0_0_1px_theme(colors.amber.400/20)]"
    : isManagement
      ? "hover:border-primary hover:shadow-elevated"
      : "hover:border-primary hover:shadow-elevated";

  const arrowColor = isAdmin
    ? "group-hover:text-amber-600"
    : "group-hover:text-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-card border-2 border-border rounded-xl p-5 transition-smooth group ${borderHover}`}
      data-ocid={`onboarding.role_${option.role}_button`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-xl ${iconBg} p-2.5 transition-colors shrink-0`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-foreground">
              {option.label}
            </h3>
            <ArrowRight
              className={`size-4 text-muted-foreground shrink-0 transition-colors ${arrowColor}`}
            />
          </div>
          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function OnboardingPage() {
  const { isAuthenticated, userProfile } = useAuth();
  const navigate = useNavigate();
  const saveProfile = useSaveUserProfile();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [step, setStep] = useState<"role" | "name">("role");

  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  if (userProfile) {
    const redirectTo = REDIRECT_BY_ROLE[userProfile.role] ?? "/catalog";
    navigate({ to: redirectTo });
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("name");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selectedRole) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim(), role: selectedRole });
      toast.success("Profil créé avec succès !");
      const redirectTo = REDIRECT_BY_ROLE[selectedRole] ?? "/catalog";
      navigate({ to: redirectTo });
    } catch {
      toast.error("Erreur lors de la création du profil. Veuillez réessayer.");
    }
  };

  const userRoles = ROLE_OPTIONS.filter((r) => r.group === "user");
  const managementRoles = ROLE_OPTIONS.filter((r) => r.group === "management");

  const SelectedIcon = selectedRole ? ROLE_ICONS[selectedRole] : GraduationCap;
  const selectedLabel = selectedRole ? ROLE_DISPLAY_LABELS[selectedRole] : "";
  const isManagementRole =
    selectedRole === "admin" || selectedRole === "ministryReviewer";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Logo + Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-3">
            <div className="w-8 h-8 rounded-full gradient-ministry flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-display font-bold text-2xl text-primary ml-1">
              EDUCERT
            </span>
          </div>
          {step === "role" ? (
            <>
              <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                Bienvenue !
              </h1>
              <p className="text-muted-foreground">
                Choisissez votre rôle pour commencer
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                Presque fini !
              </h1>
              <p className="text-muted-foreground">
                Comment souhaitez-vous être appelé ?
              </p>
            </>
          )}
        </div>

        {/* Step 1 — Role selection */}
        {step === "role" && (
          <div className="space-y-6" data-ocid="onboarding.role_selection">
            {/* Learner / Instructor group */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                Parcours d'apprentissage
              </p>
              {userRoles.map((option) => (
                <RoleCard
                  key={option.role}
                  option={option}
                  onClick={() => handleRoleSelect(option.role)}
                />
              ))}
            </div>

            {/* Admin / Ministry group */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Gestion de la plateforme
                </p>
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] bg-amber-500/10 text-amber-700 border border-amber-400/30 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide">
                  Accès privilégié
                </span>
              </div>
              {managementRoles.map((option) => (
                <RoleCard
                  key={option.role}
                  option={option}
                  onClick={() => handleRoleSelect(option.role)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Name input */}
        {step === "name" && selectedRole && (
          <div
            className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5"
            data-ocid="onboarding.name_form"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`rounded-full p-1.5 ${isManagementRole ? "bg-amber-500/10" : "bg-primary/10"}`}
              >
                <SelectedIcon
                  className={`size-4 ${isManagementRole ? "text-amber-600" : "text-primary"}`}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {selectedLabel}
              </span>
              <button
                onClick={() => setStep("role")}
                className="ml-auto text-xs text-primary hover:underline"
                type="button"
                data-ocid="onboarding.change_role_button"
              >
                Changer
              </button>
            </div>

            {isManagementRole && (
              <div className="flex items-start gap-2 text-xs bg-amber-500/5 border border-amber-400/20 rounded-lg p-3 text-amber-800">
                <Shield className="size-3.5 mt-0.5 shrink-0 text-amber-600" />
                <span>
                  Vous allez accéder à l'espace de gestion EDUCERT. Assurez-vous
                  d'avoir les autorisations nécessaires.
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Votre nom complet
              </Label>
              <Input
                id="name"
                placeholder="Ex: Jean-Pierre Kabila"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="h-11"
                autoFocus
                data-ocid="onboarding.name_input"
              />
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <CheckCircle className="size-3.5 text-primary mt-0.5 shrink-0" />
              <span>
                Votre nom sera affiché sur vos certificats et votre profil
                public.
              </span>
            </div>

            <Button
              className={`w-full h-11 ${isManagementRole ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}
              onClick={handleSubmit}
              disabled={!name.trim() || saveProfile.isPending}
              data-ocid="onboarding.submit_button"
            >
              {saveProfile.isPending
                ? "Création du profil..."
                : isManagementRole
                  ? "Accéder à l'espace d'administration"
                  : "Accéder à la plateforme"}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
