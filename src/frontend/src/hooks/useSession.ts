import { create } from "zustand";
import { persist } from "zustand/middleware";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

interface SessionState {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
  lastActivity: number;
  setAuth: (userId: string, userRole: string) => void;
  clearAuth: () => void;
  updateActivity: () => void;
  checkInactivity: () => boolean;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      userRole: null,
      lastActivity: Date.now(),

      setAuth: (userId: string, userRole: string) => {
        set({
          isAuthenticated: true,
          userId,
          userRole,
          lastActivity: Date.now(),
        });
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          userId: null,
          userRole: null,
          lastActivity: Date.now(),
        });
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      checkInactivity: () => {
        const { lastActivity, isAuthenticated } = get();
        if (!isAuthenticated) return false;
        return Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS;
      },
    }),
    {
      name: "educert-session",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        userRole: state.userRole,
        lastActivity: state.lastActivity,
      }),
    },
  ),
);

// Auto-logout watcher — starts a periodic check for inactivity
if (typeof window !== "undefined") {
  setInterval(() => {
    const { checkInactivity, clearAuth } = useSession.getState();
    if (checkInactivity()) {
      clearAuth();
    }
  }, 60 * 1000); // check every minute

  // Track user activity
  const activityEvents = ["mousemove", "keydown", "scroll", "click"];
  for (const event of activityEvents) {
    window.addEventListener(
      event,
      () => {
        useSession.getState().updateActivity();
      },
      { passive: true },
    );
  }
}
