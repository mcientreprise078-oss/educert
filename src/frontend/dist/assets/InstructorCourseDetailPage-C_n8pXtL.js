import { l as useParams, m as useGetCourse, a8 as useGetCourseEnrollments, a9 as useGetLessons, j as jsxRuntimeExports, L as Layout, f as LoadingSpinner, v as BookOpen, e as Button, p as Link, B as Badge, U as Users, A as Avatar, y as AvatarFallback, P as ProgressBar, t as Clock } from "./index-Duog9_D-.js";
import { E as EmptyState } from "./EmptyState-UIw8up77.js";
import { A as ArrowLeft } from "./arrow-left-i8gNnilk.js";
import { P as Pen } from "./pen-BYhyIfjk.js";
import { C as CircleCheck } from "./circle-check-s5YqhxUQ.js";
import { T as Trophy } from "./trophy-DMhmuKil.js";
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function InstructorCourseDetailPage() {
  const { courseId } = useParams({ from: "/instructor/courses/$courseId" });
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: enrollments, isLoading: enrollLoading } = useGetCourseEnrollments(courseId);
  const { data: lessons } = useGetLessons(courseId);
  const isLoading = courseLoading || enrollLoading;
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center py-24",
        "data-ocid": "instructor_course_detail.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) });
  if (!course)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: BookOpen,
        title: "Formation introuvable",
        description: "Cette formation n'existe pas ou a été supprimée.",
        action: { label: "Retour au tableau de bord", onClick: () => {
        } }
      }
    ) });
  const completedCount = (enrollments == null ? void 0 : enrollments.filter((e) => e.progress === 100).length) ?? 0;
  const avgProgress = enrollments && enrollments.length > 0 ? Math.round(
    enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length
  ) : 0;
  const lessonCount = (lessons == null ? void 0 : lessons.length) ?? course.lessonCount;
  const lessonCompletionRates = (lessons == null ? void 0 : lessons.map((lesson) => {
    const completedBy = (enrollments == null ? void 0 : enrollments.filter((e) => e.completedLessons >= lesson.order).length) ?? 0;
    const total = (enrollments == null ? void 0 : enrollments.length) ?? 1;
    return {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      rate: total > 0 ? Math.round(completedBy / total * 100) : 0
    };
  })) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "instructor_course_detail.page", className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "-ml-2 mb-3",
            "data-ocid": "instructor_course_detail.back_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/instructor", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-2" }),
              "Tableau de bord"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: course.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: course.published ? "default" : "secondary", children: course.published ? "Publié" : "Brouillon" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 max-w-2xl text-sm", children: course.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          className: "bg-accent text-accent-foreground hover:bg-accent/90 shrink-0",
          "data-ocid": "instructor_course_detail.edit_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/instructor/courses/$courseId/edit", params: { courseId }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4 mr-2" }),
            "Modifier"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      {
        icon: Users,
        label: "Apprenants inscrits",
        value: ((enrollments == null ? void 0 : enrollments.length) ?? course.enrollmentCount).toLocaleString()
      },
      {
        icon: CircleCheck,
        label: "Ont terminé",
        value: completedCount.toString()
      },
      {
        icon: Trophy,
        label: "Progression moyenne",
        value: `${avgProgress}%`
      },
      { icon: BookOpen, label: "Leçons", value: lessonCount.toString() }
    ].map(({ icon: Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 shadow-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/10 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: value })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-card border border-border rounded-xl shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground", children: "Apprenants inscrits" }) }),
        !(enrollments == null ? void 0 : enrollments.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "py-12 flex flex-col items-center justify-center text-center px-4",
            "data-ocid": "instructor_course_detail.enrollments.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-10 text-muted-foreground mb-3 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Aucun apprenant inscrit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Publiez votre formation pour recevoir des inscriptions." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: enrollments.map((enrollment, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-5 py-4 flex items-center gap-3",
            "data-ocid": `instructor_course_detail.learner.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-semibold", children: getInitials(enrollment.learnerName) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: enrollment.learnerName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    enrollment.progress === 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "default",
                        className: "text-xs bg-primary/15 text-primary border-0",
                        children: "Terminé"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
                      enrollment.progress,
                      "%"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    value: enrollment.progress,
                    showLabel: false,
                    variant: enrollment.progress === 100 ? "success" : "primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3" }),
                    enrollment.completedLessons,
                    "/",
                    lessonCount,
                    " leçons"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                    "Inscrit le ",
                    formatDate(enrollment.enrolledAt)
                  ] })
                ] })
              ] })
            ]
          },
          enrollment.learnerId
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground", children: "Complétion par leçon" }) }),
        !lessonCompletionRates.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "py-10 text-center px-4",
            "data-ocid": "instructor_course_detail.lessons.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-8 text-muted-foreground mb-2 mx-auto opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aucune leçon ajoutée" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-4", children: lessonCompletionRates.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `instructor_course_detail.lesson_stat.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-foreground font-medium line-clamp-2 flex-1", children: [
                  lesson.order,
                  ". ",
                  lesson.title
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground shrink-0", children: [
                  lesson.rate,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProgressBar,
                {
                  value: lesson.rate,
                  showLabel: false,
                  variant: lesson.rate >= 80 ? "success" : lesson.rate >= 50 ? "primary" : "accent"
                }
              )
            ]
          },
          lesson.id
        )) })
      ] })
    ] }),
    course.thumbnail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden border border-border aspect-video max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: course.thumbnail,
        alt: course.title,
        className: "w-full h-full object-cover"
      }
    ) })
  ] }) });
}
export {
  InstructorCourseDetailPage as default
};
