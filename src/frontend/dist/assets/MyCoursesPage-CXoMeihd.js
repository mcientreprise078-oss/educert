import { c as createLucideIcon, u as useNavigate, b as useGetEnrollments, a as useGetCourses, j as jsxRuntimeExports, L as Layout, f as LoadingSpinner, v as BookOpen, B as Badge, D as DIFFICULTY_LABELS, P as ProgressBar, t as Clock, e as Button, p as Link, E as Award } from "./index-D09cs5UV.js";
import { E as EmptyState } from "./EmptyState-C4UcnAWk.js";
import { C as CircleCheck } from "./circle-check-DuoBvN5I.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode);
function MyCoursesPage() {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useGetEnrollments();
  const { data: allCourses } = useGetCourses();
  const enrolledCourses = (enrollments ?? []).map((e) => {
    const course = (allCourses ?? []).find((c) => c.id === e.courseId);
    return { enrollment: e, course };
  }).filter((item) => item.course != null);
  const inProgress = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress < 100
  );
  const completed = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress >= 100
  );
  function getLastLesson(completedLessons) {
    if (completedLessons.length === 0) return "l1";
    return `l${completedLessons.length + 1}`;
  }
  function daysSince(ts) {
    const days = Math.floor((Date.now() - ts) / 864e5);
    return days === 0 ? "Aujourd'hui" : `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "my_courses.page", className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground mb-1", children: "Mes formations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Suivez votre progression et continuez votre apprentissage" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center py-20",
        "data-ocid": "my_courses.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) : enrolledCourses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "my_courses.empty_state",
        icon: BookOpen,
        title: "Aucune formation en cours",
        description: "Inscrivez-vous à une formation pour commencer votre apprentissage professionnel.",
        action: {
          label: "Explorer le catalogue",
          onClick: () => navigate({ to: "/catalog" })
        }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
      inProgress.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "my_courses.in_progress.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "size-5 text-primary" }),
          "En cours",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1", children: inProgress.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            "data-ocid": "my_courses.list",
            children: inProgress.map(({ enrollment, course }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "article",
              {
                className: "bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col",
                "data-ocid": `my_courses.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden bg-muted", children: [
                    (course == null ? void 0 : course.thumbnail) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: course.thumbnail,
                        alt: course.title,
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1.5 bg-muted/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full bg-primary transition-all duration-500",
                        style: { width: `${enrollment.progress}%` }
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-3 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
                        DIFFICULTY_LABELS[(course == null ? void 0 : course.difficulty) ?? "beginner"],
                        " · ",
                        (course == null ? void 0 : course.lessonCount) ?? "?",
                        " ",
                        "leçons"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground line-clamp-2", children: course.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: course == null ? void 0 : course.instructor })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Progression" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
                          enrollment.progress,
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ProgressBar,
                        {
                          value: enrollment.progress,
                          showLabel: false,
                          className: "h-2"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                        enrollment.completedLessons.length,
                        " leçon",
                        enrollment.completedLessons.length > 1 ? "s" : "",
                        " ",
                        "terminée",
                        enrollment.completedLessons.length > 1 ? "s" : "",
                        " · ",
                        daysSince(enrollment.enrolledAt)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        asChild: true,
                        size: "sm",
                        className: "mt-auto",
                        "data-ocid": `my_courses.continue_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/learn/$courseId/$lessonId",
                            params: {
                              courseId: enrollment.courseId,
                              lessonId: getLastLesson(
                                enrollment.completedLessons
                              )
                            },
                            children: enrollment.progress === 0 ? "Commencer" : "Continuer"
                          }
                        )
                      }
                    )
                  ] })
                ]
              },
              enrollment.id
            ))
          }
        )
      ] }),
      completed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "my_courses.completed.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 text-accent" }),
          "Terminées",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1", children: completed.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: completed.map(({ enrollment, course }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            className: "bg-card border border-border rounded-xl overflow-hidden shadow-card flex flex-col opacity-90 hover:opacity-100 transition-smooth",
            "data-ocid": `my_courses.completed.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden bg-muted", children: [
                (course == null ? void 0 : course.thumbnail) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: course.thumbnail,
                    alt: course.title,
                    className: "w-full h-full object-cover brightness-75"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-accent/90 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-7 text-white" }) }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-3 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground line-clamp-2", children: course.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: course == null ? void 0 : course.instructor })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-3.5 text-accent" }),
                  "Terminé",
                  " ",
                  enrollment.completedAt ? daysSince(enrollment.completedAt) : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      asChild: true,
                      size: "sm",
                      variant: "outline",
                      className: "flex-1",
                      "data-ocid": `my_courses.certificate_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/certificates", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-3.5 mr-1.5" }),
                        "Certificat"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      asChild: true,
                      size: "sm",
                      variant: "ghost",
                      "data-ocid": `my_courses.review_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Link,
                        {
                          to: "/learn/$courseId/$lessonId",
                          params: {
                            courseId: enrollment.courseId,
                            lessonId: "l1"
                          },
                          children: "Revoir"
                        }
                      )
                    }
                  )
                ] })
              ] })
            ]
          },
          enrollment.id
        )) })
      ] })
    ] })
  ] }) });
}
export {
  MyCoursesPage as default
};
