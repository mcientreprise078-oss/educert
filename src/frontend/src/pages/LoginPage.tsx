import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const {
    login,
    isInitializing,
    isLoggingIn,
    isAuthenticated,
    needsOnboarding,
  } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    if (needsOnboarding) navigate({ to: "/onboarding" });
    else navigate({ to: "/catalog" });
    return null;
  }

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login.page"
    >
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="font-display font-bold text-3xl text-primary">
              Forma
            </span>
            <span className="font-display font-bold text-3xl text-accent">
              Pro
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-2">
            Connexion
          </h1>
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à vos formations
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-elevated space-y-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              FormaPro utilise Internet Identity pour une connexion sécurisée et
              décentralisée. Aucun mot de passe requis.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 text-left bg-muted/50 rounded-lg p-3">
              <li className="flex items-center gap-2">
                ✓ Connexion sécurisée et privée
              </li>
              <li className="flex items-center gap-2">
                ✓ Aucune donnée personnelle requise
              </li>
              <li className="flex items-center gap-2">
                ✓ Accessible sur tous vos appareils
              </li>
            </ul>
          </div>

          <Button
            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            data-ocid="login.submit_button"
          >
            {isInitializing ? (
              "Chargement..."
            ) : isLoggingIn ? (
              "Connexion en cours..."
            ) : (
              <>
                Se connecter avec Internet Identity
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            En vous connectant, vous acceptez nos conditions d'utilisation.
          </p>
        </div>
      </div>
    </div>
  );
}
