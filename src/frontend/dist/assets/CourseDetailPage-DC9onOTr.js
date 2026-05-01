import { l as useParams, u as useNavigate, m as useGetCourse, n as useGetEnrollment, o as useGetCourseLessons, d as useEnroll, j as jsxRuntimeExports, L as Layout, f as LoadingSpinner, e as Button, p as Link, B as Badge, D as DIFFICULTY_LABELS, q as cn, s as DIFFICULTY_COLORS, S as Star, U as Users, t as Clock, v as BookOpen, P as ProgressBar, w as CircleCheckBig, A as Avatar, x as AvatarImage, y as AvatarFallback, G as GraduationCap, z as Award, h as ue } from "./index-Duog9_D-.js";
import { S as Separator } from "./separator-CpQ8MYrV.js";
import { A as ArrowLeft } from "./arrow-left-i8gNnilk.js";
import { T as TrendingUp } from "./trending-up-DJeyj1lG.js";
const LEARNING_OUTCOMES = [
  "Maîtriser les concepts fondamentaux et les meilleures pratiques",
  "Appliquer les techniques dans des contextes professionnels réels",
  "Développer une approche structurée et méthodique",
  "Collaborer efficacement au sein d'équipes multidisciplinaires",
  "Utiliser les outils et frameworks les plus utilisés dans le secteur",
  "Obtenir une certification reconnue par les professionnels"
];
const INSTRUCTOR_BIOS = {
  "Dr. Amina Benali": {
    bio: "Docteure en management de projet avec 15 ans d'expérience dans de grandes entreprises. Certifiée PMP et coach Agile, elle accompagne des équipes internationales depuis 2010.",
    courses: 7,
    students: 8400,
    rating: 4.9
  },
  "Marc Dupont": {
    bio: "Data scientist sénior chez un groupe pharmaceutique, Marc partage sa passion pour les données à travers des contenus pédagogiques clairs et accessibles.",
    courses: 4,
    students: 12e3,
    rating: 4.7
  },
  "Sophie Laurent": {
    bio: "Executive coach et formatrice en leadership, Sophie a accompagné plus de 500 dirigeants dans leur transformation personnelle et professionnelle.",
    courses: 5,
    students: 9200,
    rating: 4.9
  },
  "Karim Mansouri": {
    bio: "Consultant en stratégie digitale et fondateur d'une agence de marketing, Karim transmet son expertise avec pragmatisme et exemples concrets.",
    courses: 3,
    students: 4100,
    rating: 4.6
  },
  "Léa Moreau": {
    bio: "Designer UX senior avec 10 ans d'expérience dans des startups et grands comptes. Passionnée de design thinking et d'accessibilité numérique.",
    courses: 6,
    students: 6800,
    rating: 4.8
  },
  "Dr. Thomas Chen": {
    bio: "Chercheur en IA et consultant pour des organisations Fortune 500, Thomas rend l'intelligence artificielle compréhensible pour les décideurs non-techniques.",
    courses: 3,
    students: 7500,
    rating: 4.7
  }
};
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}
function getInitials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function CourseDetailPage() {
  const { courseId } = useParams({ from: "/courses/$courseId" });
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourse(courseId);
  const { data: enrollment } = useGetEnrollment(courseId);
  const { data: lessons = [] } = useGetCourseLessons(courseId);
  const enroll = useEnroll();
  const handleEnroll = async () => {
    try {
      await enroll.mutateAsync(courseId);
      ue.success("Inscription réussie !");
      navigate({
        to: "/learn/$courseId/$lessonId",
        params: { courseId, lessonId: "l1" }
      });
    } catch {
      ue.error("Erreur lors de l'inscription.");
    }
  };
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center py-24",
        "data-ocid": "course_detail.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) });
  if (!course)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold mb-2", children: "Formation introuvable" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/catalog", children: "Retour au catalogue" }) })
    ] }) });
  const instructorInfo = INSTRUCTOR_BIOS[course.instructor];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "course_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        className: "mb-6 -ml-2 text-muted-foreground hover:text-foreground",
        onClick: () => navigate({ to: "/catalog" }),
        "data-ocid": "course_detail.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-2" }),
          "Retour au catalogue"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: course.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                  DIFFICULTY_COLORS[course.difficulty]
                ),
                children: DIFFICULTY_LABELS[course.difficulty]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl lg:text-4xl text-foreground leading-tight", children: course.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base leading-relaxed", children: course.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4 fill-accent text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: course.rating.toFixed(1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "(",
                course.ratingCount.toLocaleString(),
                " avis)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
              course.enrollmentCount.toLocaleString(),
              " inscrits"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }),
              Math.floor(course.duration / 60),
              "h de contenu"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
              course.lessonCount,
              " leçons"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden border border-border aspect-video shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: course.thumbnail,
            alt: course.title,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.src = "/assets/images/placeholder.svg";
            }
          }
        ) }),
        enrollment && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-5",
            "data-ocid": "course_detail.progress_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Votre progression" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-primary", children: [
                  enrollment.progress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProgressBar,
                {
                  value: enrollment.progress,
                  showLabel: false,
                  className: "h-2.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
                enrollment.completedLessons.length,
                " leçon",
                enrollment.completedLessons.length !== 1 ? "s" : "",
                " terminée",
                enrollment.completedLessons.length !== 1 ? "s" : "",
                " sur",
                " ",
                course.lessonCount
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "course_detail.outcomes_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-4", children: "Ce que vous allez apprendre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: LEARNING_OUTCOMES.map((outcome, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2.5",
              "data-ocid": `course_detail.outcome.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-5 text-primary shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground leading-relaxed", children: outcome })
              ]
            },
            outcome
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "course_detail.curriculum_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Programme de la formation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              course.lessonCount,
              " leçons ·",
              " ",
              Math.floor(course.duration / 60),
              "h au total"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: lessons.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-3.5 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-card transition-smooth",
              "data-ocid": `course_detail.lesson.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "size-7 rounded-full flex items-center justify-center shrink-0",
                      (enrollment == null ? void 0 : enrollment.completedLessons.includes(lesson.id)) ? "bg-primary/10" : "bg-muted"
                    ),
                    children: (enrollment == null ? void 0 : enrollment.completedLessons.includes(lesson.id)) ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: i + 1 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "flex-1 text-sm min-w-0",
                      (enrollment == null ? void 0 : enrollment.completedLessons.includes(lesson.id)) ? "text-muted-foreground line-through" : "text-foreground"
                    ),
                    children: lesson.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: formatDuration(lesson.duration) })
              ]
            },
            lesson.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        instructorInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "course_detail.instructor_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-4", children: "Votre formateur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-5 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "size-16 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarImage,
                {
                  src: course.instructorAvatar,
                  alt: course.instructor
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-semibold text-lg", children: getInitials(course.instructor) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground", children: course.instructor }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: instructorInfo.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 fill-accent text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: instructorInfo.rating.toFixed(1) }),
                  "de note"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3.5" }),
                  instructorInfo.students.toLocaleString(),
                  " apprenants"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-3.5" }),
                  instructorInfo.courses,
                  " formations"
                ] })
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24 bg-card border border-border rounded-xl shadow-elevated overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: course.thumbnail,
            alt: course.title,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.src = "/assets/images/placeholder.svg";
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-3xl text-foreground", children: course.price === 0 ? "Gratuit" : `${course.price}€` }) }),
          enrollment ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Progression" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
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
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "w-full",
                "data-ocid": "course_detail.continue_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/learn/$courseId/$lessonId",
                    params: { courseId, lessonId: "l1" },
                    children: "Continuer l'apprentissage"
                  }
                )
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold",
              onClick: handleEnroll,
              disabled: enroll.isPending,
              "data-ocid": "course_detail.enroll_button",
              children: enroll.isPending ? "Inscription en cours…" : "S'inscrire gratuitement"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [
            {
              icon: Clock,
              label: `${Math.floor(course.duration / 60)}h de contenu vidéo`
            },
            {
              icon: BookOpen,
              label: `${course.lessonCount} leçons structurées`
            },
            { icon: TrendingUp, label: "Accès illimité à vie" },
            { icon: Award, label: "Certificat de réussite" }
          ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2.5 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
              ]
            },
            label
          )) })
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  CourseDetailPage as default
};
