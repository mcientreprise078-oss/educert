import { useSession } from "@/hooks/useSession";
import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "./router";

export default function App() {
  const { isAuthenticated, lastActivity, clearAuth } = useSession();

  // Restore session and sync with Internet Identity on mount
  useEffect(() => {
    if (isAuthenticated) {
      const elapsed = Date.now() - lastActivity;
      if (elapsed > 30 * 60 * 1000) {
        clearAuth();
      }
    }
  }, [isAuthenticated, lastActivity, clearAuth]);

  return <RouterProvider router={router} />;
}
