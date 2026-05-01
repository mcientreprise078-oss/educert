import { Toaster } from "@/components/ui/sonner";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Layout({ children, fullWidth = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main
        className={`flex-1 ${fullWidth ? "" : "container mx-auto px-4 py-8 max-w-7xl"}`}
      >
        {children}
      </main>
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Ministry branding row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-ministry flex items-center justify-center text-white font-bold text-xs shrink-0">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-primary leading-tight">
                  EDUCERT
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Ministère de la Formation Professionnelle — RDC
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="/catalog"
                className="hover:text-foreground transition-colors duration-200"
              >
                Catalogue
              </a>
              <a
                href="/verify/check"
                className="hover:text-foreground transition-colors duration-200"
              >
                Vérifier un certificat
              </a>
            </div>
          </div>
          {/* Divider + credits */}
          <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} EDUCERT — Ministère de la Formation
              Professionnelle, RDC. Tous droits réservés.
            </p>
            <p className="text-muted-foreground text-xs">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default Layout;
