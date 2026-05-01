import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
  /** If true, only full admins can pass (not ministry reviewers) */
  adminOnly?: boolean;
}

export function AdminGuard({ children, adminOnly = false }: AdminGuardProps) {
  const { isAuthenticated, isInitializing, isAdmin, isAdminOrReviewer } =
    useAuth();
  const navigate = useNavigate();

  const hasAccess = adminOnly ? isAdmin : isAdminOrReviewer;

  useEffect(() => {
    if (!isInitializing && isAuthenticated && !hasAccess) {
      navigate({ to: "/" });
    }
  }, [isInitializing, isAuthenticated, hasAccess, navigate]);

  // Still initializing — render nothing
  if (isInitializing) return null;

  // Not authenticated — show nothing while redirect happens
  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="admin_guard.unauthorized"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldX className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Accès restreint
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Vous devez vous connecter pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated but insufficient role
  if (!hasAccess) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="admin_guard.forbidden"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldX className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Accès non autorisé
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            {adminOnly
              ? "Cette section est réservée aux administrateurs."
              : "Cette section est réservée aux administrateurs et réviseurs ministériels."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminGuard;
