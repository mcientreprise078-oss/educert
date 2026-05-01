import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Lazy-loaded pages
const CatalogPage = () =>
  import("@/pages/CatalogPage").then((m) => ({ default: m.default }));
const CourseDetailPage = () =>
  import("@/pages/CourseDetailPage").then((m) => ({ default: m.default }));
const LearnPage = () =>
  import("@/pages/LearnPage").then((m) => ({ default: m.default }));
const MyCoursesPage = () =>
  import("@/pages/MyCoursesPage").then((m) => ({ default: m.default }));
const CertificatesPage = () =>
  import("@/pages/CertificatesPage").then((m) => ({ default: m.default }));
const InstructorPage = () =>
  import("@/pages/InstructorPage").then((m) => ({ default: m.default }));
const InstructorCourseDetailPage = () =>
  import("@/pages/InstructorCourseDetailPage").then((m) => ({
    default: m.default,
  }));
const InstructorCourseEditPage = () =>
  import("@/pages/InstructorCourseEditPage").then((m) => ({
    default: m.default,
  }));
const LoginPage = () =>
  import("@/pages/LoginPage").then((m) => ({ default: m.default }));

// Admin pages (lazy)
const AdminDashboardPage = () =>
  import("@/pages/AdminDashboardPage").then((m) => ({ default: m.default }));
const AdminResourcesPage = () =>
  import("@/pages/AdminResourcesPage").then((m) => ({ default: m.default }));
const AdminGenerationsPage = () =>
  import("@/pages/AdminGenerationsPage").then((m) => ({ default: m.default }));
const AdminApprovalsPage = () =>
  import("@/pages/AdminApprovalsPage").then((m) => ({ default: m.default }));
const AdminSettingsPage = () =>
  import("@/pages/AdminSettingsPage").then((m) => ({ default: m.default }));
const GenerateCoursePage = () =>
  import("@/pages/GenerateCoursePage").then((m) => ({ default: m.default }));
const CertificateVerifyPage = () =>
  import("@/pages/CertificateVerifyPage").then((m) => ({ default: m.default }));

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import React, { Suspense } from "react";

function LazyPage({
  loader,
}: { loader: () => Promise<{ default: React.ComponentType }> }) {
  const Component = React.lazy(loader);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LazyPage loader={LoginPage} />,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: () => <LazyPage loader={CatalogPage} />,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$courseId",
  component: () => <LazyPage loader={CourseDetailPage} />,
});

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn/$courseId/$lessonId",
  component: () => <LazyPage loader={LearnPage} />,
});

const myCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-courses",
  component: () => <LazyPage loader={MyCoursesPage} />,
});

const certificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certificates",
  component: () => <LazyPage loader={CertificatesPage} />,
});

const instructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/instructor",
  component: () => <LazyPage loader={InstructorPage} />,
});

const instructorCourseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/instructor/courses/$courseId",
  component: () => <LazyPage loader={InstructorCourseDetailPage} />,
});

const instructorCourseEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/instructor/courses/$courseId/edit",
  component: () => <LazyPage loader={InstructorCourseEditPage} />,
});

// ---- Admin & special routes ----

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <LazyPage loader={AdminDashboardPage} />,
});

const adminResourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/resources",
  component: () => <LazyPage loader={AdminResourcesPage} />,
});

const adminGenerationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/generations",
  component: () => <LazyPage loader={AdminGenerationsPage} />,
});

const adminApprovalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/approvals",
  component: () => <LazyPage loader={AdminApprovalsPage} />,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: () => <LazyPage loader={AdminSettingsPage} />,
});

const generateCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generate",
  component: () => <LazyPage loader={GenerateCoursePage} />,
});

const certificateVerifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify/$qrCode",
  component: () => <LazyPage loader={CertificateVerifyPage} />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  onboardingRoute,
  catalogRoute,
  courseDetailRoute,
  learnRoute,
  myCoursesRoute,
  certificatesRoute,
  instructorRoute,
  instructorCourseDetailRoute,
  instructorCourseEditRoute,
  adminDashboardRoute,
  adminResourcesRoute,
  adminGenerationsRoute,
  adminApprovalsRoute,
  adminSettingsRoute,
  generateCourseRoute,
  certificateVerifyRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
