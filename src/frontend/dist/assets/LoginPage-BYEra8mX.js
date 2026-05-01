import { ah as useAuth, u as useNavigate, j as jsxRuntimeExports, e as Button, Y as ArrowRight } from "./index-Duog9_D-.js";
function LoginPage() {
  const {
    login,
    isInitializing,
    isLoggingIn,
    isAuthenticated,
    needsOnboarding
  } = useAuth();
  const navigate = useNavigate();
  if (isAuthenticated) {
    if (needsOnboarding) navigate({ to: "/onboarding" });
    else navigate({ to: "/catalog" });
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background flex items-center justify-center p-4",
      "data-ocid": "login.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-slide-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-primary", children: "Forma" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-accent", children: "Pro" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground mb-2", children: "Connexion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Connectez-vous pour accéder à vos formations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-8 shadow-elevated space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "FormaPro utilise Internet Identity pour une connexion sécurisée et décentralisée. Aucun mot de passe requis." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-muted-foreground space-y-1.5 text-left bg-muted/50 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-center gap-2", children: "✓ Connexion sécurisée et privée" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-center gap-2", children: "✓ Aucune donnée personnelle requise" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-center gap-2", children: "✓ Accessible sur tous vos appareils" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base",
              onClick: login,
              disabled: isInitializing || isLoggingIn,
              "data-ocid": "login.submit_button",
              children: isInitializing ? "Chargement..." : isLoggingIn ? "Connexion en cours..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Se connecter avec Internet Identity",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ml-2" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "En vous connectant, vous acceptez nos conditions d'utilisation." })
        ] })
      ] })
    }
  );
}
export {
  LoginPage as default
};
