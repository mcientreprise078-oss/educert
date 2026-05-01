import { useGetUserProfile } from "@/lib/queries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
  } = useInternetIdentity();

  const queryClient = useQueryClient();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetUserProfile();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
    localStorage.removeItem("userProfile");
  };

  const role = userProfile?.role ?? "guest";

  const isLearner = isAuthenticated && role === "learner";
  const isInstructor = isAuthenticated && role === "instructor";
  const isAdmin = isAuthenticated && role === "admin";
  const isMinistryReviewer = isAuthenticated && role === "ministryReviewer";
  const isAdminOrReviewer = isAdmin || isMinistryReviewer;
  const needsOnboarding =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
    userProfile,
    profileLoading,
    profileFetched,
    role,
    isLearner,
    isInstructor,
    isAdmin,
    isMinistryReviewer,
    isAdminOrReviewer,
    needsOnboarding,
    login: handleLogin,
    logout: handleLogout,
  };
}
