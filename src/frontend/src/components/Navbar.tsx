import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  learner: "Apprenant",
  instructor: "Formateur",
  admin: "Administrateur",
  ministryReviewer: "Réviseur Ministériel",
  guest: "Visiteur",
};

export function Navbar() {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    userProfile,
    role,
    isAdminOrReviewer,
    isAdmin,
    login,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
      {/* Ministry strip */}
      <div className="gradient-ministry px-4 py-0.5">
        <p className="text-center text-[10px] text-white/90 font-medium tracking-wide">
          Ministère de la Formation Professionnelle — République Démocratique du
          Congo
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="navbar.logo"
          >
            <div className="w-7 h-7 rounded-full gradient-ministry flex items-center justify-center text-white font-bold text-xs">
              E
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-display font-bold text-lg text-primary leading-none">
                EDUCERT
              </span>
              <span className="text-[9px] text-muted-foreground leading-none hidden sm:block">
                Formation Professionnelle · RDC
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link
              to="/catalog"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              data-ocid="navbar.catalog_link"
            >
              <BookOpen className="size-4" />
              Catalogue
            </Link>

            {isAuthenticated &&
              (role === "learner" || role === "instructor") && (
                <Link
                  to="/generate"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-accent hover:text-foreground hover:bg-accent/10 transition-smooth"
                  data-ocid="navbar.generate_link"
                >
                  <Sparkles className="size-4" />
                  Générer un cours
                </Link>
              )}

            {isAuthenticated && role === "learner" && (
              <>
                <Link
                  to="/my-courses"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  data-ocid="navbar.my_courses_link"
                >
                  <GraduationCap className="size-4" />
                  Mes formations
                </Link>
                <Link
                  to="/certificates"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                  data-ocid="navbar.certificates_link"
                >
                  <Award className="size-4" />
                  Certificats
                </Link>
              </>
            )}

            {isAuthenticated && role === "instructor" && (
              <Link
                to="/instructor"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                data-ocid="navbar.instructor_link"
              >
                <LayoutDashboard className="size-4" />
                Tableau de bord
              </Link>
            )}

            {/* Admin dashboard — prominent button for admin/reviewer */}
            {isAdminOrReviewer && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold bg-amber-500/10 text-amber-700 border border-amber-400/30 hover:bg-amber-500/20 hover:text-amber-800 transition-smooth ml-1"
                data-ocid="navbar.admin_dashboard_link"
              >
                <Shield className="size-4" />
                Tableau de bord Admin
              </Link>
            )}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={isInitializing || isLoggingIn}
                  data-ocid="navbar.login_button"
                >
                  {isInitializing
                    ? "Chargement..."
                    : isLoggingIn
                      ? "Connexion..."
                      : "Se connecter"}
                </Button>
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isInitializing || isLoggingIn}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="navbar.signup_button"
                >
                  Commencer
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 h-10"
                    data-ocid="navbar.user_menu_button"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback
                        className={`text-xs font-semibold ${isAdminOrReviewer ? "bg-amber-500/10 text-amber-700" : "bg-primary/10 text-primary"}`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                      {userProfile?.name ?? "Mon compte"}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">
                        {userProfile?.name ?? "Utilisateur"}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`w-fit text-xs py-0 ${isAdminOrReviewer ? "bg-amber-500/10 text-amber-700 border border-amber-400/30" : ""}`}
                      >
                        {ROLE_LABELS[role] ?? role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {(role === "learner" || role === "instructor") && (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/generate" })}
                      data-ocid="navbar.generate_menu_item"
                    >
                      <Sparkles className="size-4 mr-2 text-accent" />
                      Générer un cours
                    </DropdownMenuItem>
                  )}

                  {role === "learner" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/my-courses" })}
                        data-ocid="navbar.my_courses_menu_item"
                      >
                        <GraduationCap className="size-4 mr-2" />
                        Mes formations
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/certificates" })}
                        data-ocid="navbar.certificates_menu_item"
                      >
                        <Award className="size-4 mr-2" />
                        Certificats
                      </DropdownMenuItem>
                    </>
                  )}

                  {role === "instructor" && (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/instructor" })}
                      data-ocid="navbar.instructor_menu_item"
                    >
                      <LayoutDashboard className="size-4 mr-2" />
                      Tableau de bord
                    </DropdownMenuItem>
                  )}

                  {isAdminOrReviewer && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold py-1">
                        Espace d'administration
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/admin" })}
                        className="text-amber-700 focus:text-amber-800 focus:bg-amber-500/10"
                        data-ocid="navbar.admin_dashboard_menu_item"
                      >
                        <Shield className="size-4 mr-2 text-amber-600" />
                        Tableau de bord Admin
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => navigate({ to: "/admin/resources" })}
                          data-ocid="navbar.admin_resources_menu_item"
                        >
                          <BookOpen className="size-4 mr-2" />
                          Bibliothèque de ressources
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/admin/approvals" })}
                        data-ocid="navbar.admin_approvals_menu_item"
                      >
                        <ShieldCheck className="size-4 mr-2" />
                        Approbations
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-ocid="navbar.profile_menu_item">
                    <User className="size-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                    data-ocid="navbar.logout_button"
                  >
                    <LogOut className="size-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
