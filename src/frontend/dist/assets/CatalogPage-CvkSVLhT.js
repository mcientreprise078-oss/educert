import { c as createLucideIcon, r as reactExports, u as useNavigate, a as useGetCourses, b as useGetEnrollments, d as useEnroll, j as jsxRuntimeExports, L as Layout, I as Input, C as CATEGORIES, B as Badge, D as DIFFICULTY_LABELS, e as Button, f as LoadingSpinner, g as CourseCard, h as ue, i as useListExternalCourses, k as useTrackExternalCourseView } from "./index-D09cs5UV.js";
import { E as EmptyState } from "./EmptyState-C4UcnAWk.js";
import { S as Search } from "./search-ZqenjnHR.js";
import { X } from "./x-DU9MTTQ_.js";
import { C as ChevronRight } from "./chevron-right-DTTFnz_N.js";
import { E as ExternalLink } from "./external-link-DO6HyzfZ.js";
import { P as Play } from "./play-B9_PUdmR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
const ALL_CATEGORY = "Tous";
const ALL_DIFFICULTY = "all";
const DIFFICULTIES = [
  { value: "all", label: "Tous niveaux" },
  { value: "beginner", label: DIFFICULTY_LABELS.beginner },
  { value: "intermediate", label: DIFFICULTY_LABELS.intermediate },
  { value: "advanced", label: DIFFICULTY_LABELS.advanced }
];
const PLATFORM_CONFIG = {
  YouTube: {
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800"
  },
  Coursera: {
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800"
  },
  Udemy: {
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800"
  },
  OpenClassrooms: {
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800"
  },
  Autre: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border"
  }
};
function getPlatformConfig(platform) {
  return PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.Autre;
}
function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
function ExternalCourseDetailModal({
  course,
  onClose
}) {
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!course) return null;
  const ytId = extractYouTubeId(course.url);
  const cfg = getPlatformConfig(course.platform);
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4",
      onClick: handleBackdrop,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      "data-ocid": "external_course.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "dialog",
        {
          open: true,
          className: "relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 m-0",
          "aria-label": `Cours externe : ${course.title}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-5 border-b border-border gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`,
                    children: course.platform
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium shrink-0", children: "Cours externe" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  "aria-label": "Fermer",
                  "data-ocid": "external_course.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground leading-snug", children: course.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed text-sm", children: course.description }),
              ytId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden aspect-video bg-muted border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "iframe",
                {
                  src: `https://www.youtube.com/embed/${ytId}`,
                  title: course.title,
                  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowFullScreen: true,
                  className: "w-full h-full",
                  loading: "lazy"
                }
              ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 border border-border p-6 flex flex-col items-center gap-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-8 text-primary/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Ce cours est hébergé sur",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${cfg.color}`, children: course.platform })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: course.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity",
                    "data-ocid": "external_course.open_link_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4" }),
                      "Ouvrir sur ",
                      course.platform
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
                ytId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: course.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium",
                    "data-ocid": "external_course.open_link_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4" }),
                      "Ouvrir sur ",
                      course.platform
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: onClose,
                    className: "ml-auto",
                    "data-ocid": "external_course.cancel_button",
                    children: "Fermer"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ExternalCourseCard({
  course,
  index,
  onOpen,
  onAccess
}) {
  const ytId = extractYouTubeId(course.url);
  const thumbnail = course.thumbnailUrl ?? (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
  const cfg = getPlatformConfig(course.platform);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 w-[280px] shrink-0",
      "data-ocid": `external_course.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "relative h-36 bg-muted overflow-hidden w-full text-left",
            onClick: () => onOpen(course),
            "aria-label": `Voir le cours : ${course.title}`,
            children: [
              thumbnail ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: thumbnail,
                  alt: course.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                  loading: "lazy"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-10 text-muted-foreground/30" }) }),
              ytId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-card/90 p-3 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-6 text-foreground fill-foreground" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`,
                  children: course.platform
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-3.5 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "font-semibold text-sm text-foreground line-clamp-2 leading-snug text-left hover:text-primary transition-colors",
              onClick: () => onOpen(course),
              children: course.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1", children: course.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "w-full mt-1 h-8 text-xs font-semibold gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors",
              onClick: () => onAccess(course),
              "data-ocid": `external_course.access_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
                "Accéder au cours"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ExternalCoursesSection() {
  const { data: externalCourses, isLoading } = useListExternalCourses();
  const trackView = useTrackExternalCourseView();
  const [selectedCourse, setSelectedCourse] = reactExports.useState(
    null
  );
  const scrollRef = reactExports.useRef(null);
  const handleOpenModal = reactExports.useCallback(
    (course) => {
      setSelectedCourse(course);
      trackView.mutate(course.id);
    },
    [trackView]
  );
  const handleCloseModal = reactExports.useCallback(() => setSelectedCourse(null), []);
  const handleAccess = reactExports.useCallback(
    (course) => {
      trackView.mutate(course.id);
      window.open(course.url, "_blank", "noopener,noreferrer");
    },
    [trackView]
  );
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth"
    });
  };
  if (!isLoading && (!externalCourses || externalCourses.length === 0))
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 pt-4", "data-ocid": "external_courses.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Cours provenant d'autres plateformes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ressources sélectionnées par l'équipe EDUCERT depuis des plateformes partenaires" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scroll("left"),
              className: "rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              "aria-label": "Défiler vers la gauche",
              "data-ocid": "external_courses.scroll_left_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scroll("right"),
              className: "rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              "aria-label": "Défiler vers la droite",
              "data-ocid": "external_courses.scroll_right_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: scrollRef,
          className: "flex gap-4 overflow-x-auto pb-3",
          "data-ocid": "external_courses.list",
          children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-[280px] shrink-0 h-[260px] rounded-xl bg-muted animate-pulse",
              "data-ocid": "external_courses.loading_state"
            },
            i
          )) : externalCourses == null ? void 0 : externalCourses.map((course, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ExternalCourseCard,
            {
              course,
              index: i,
              onOpen: handleOpenModal,
              onAccess: handleAccess
            },
            course.id
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExternalCourseDetailModal,
      {
        course: selectedCourse,
        onClose: handleCloseModal
      }
    )
  ] });
}
function CatalogPage() {
  const [inputValue, setInputValue] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState(ALL_CATEGORY);
  const [activeDifficulty, setActiveDifficulty] = reactExports.useState(
    ALL_DIFFICULTY
  );
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 350);
    return () => clearTimeout(timer);
  }, [inputValue]);
  const { data: courses, isLoading } = useGetCourses({
    search: search || void 0,
    category: activeCategory !== ALL_CATEGORY ? activeCategory : void 0,
    difficulty: activeDifficulty !== ALL_DIFFICULTY ? activeDifficulty : void 0
  });
  const { data: enrollments } = useGetEnrollments();
  const enroll = useEnroll();
  const enrollmentMap = new Map(enrollments == null ? void 0 : enrollments.map((e) => [e.courseId, e]));
  const handleEnroll = async (courseId) => {
    try {
      await enroll.mutateAsync(courseId);
      ue.success("Inscription réussie !");
      navigate({ to: "/courses/$courseId", params: { courseId } });
    } catch {
      ue.error("Erreur lors de l'inscription.");
    }
  };
  const hasActiveFilters = activeCategory !== ALL_CATEGORY || activeDifficulty !== ALL_DIFFICULTY || search !== "";
  const resetFilters = () => {
    setInputValue("");
    setSearch("");
    setActiveCategory(ALL_CATEGORY);
    setActiveDifficulty(ALL_DIFFICULTY);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", "data-ocid": "catalog.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl lg:text-4xl text-foreground", children: "Catalogue de formations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Découvrez nos formations professionnelles et développez vos compétences" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Rechercher une formation...",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          className: "pl-10 pr-10 h-11 text-base",
          "data-ocid": "catalog.search_input"
        }
      ),
      inputValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setInputValue("");
            setSearch("");
          },
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": "Effacer la recherche",
          "data-ocid": "catalog.search_clear_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-1.5 flex-wrap",
          "data-ocid": "catalog.categories",
          children: [ALL_CATEGORY, ...CATEGORIES].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveCategory(cat),
              "data-ocid": `catalog.category_${cat.toLowerCase().replace(/[\s&/]+/g, "_")}_tab`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: activeCategory === cat ? "default" : "outline",
                  className: "cursor-pointer hover:bg-primary/10 transition-smooth text-xs py-1 px-3 whitespace-nowrap",
                  children: cat
                }
              )
            },
            cat
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-1.5 flex-wrap",
          "data-ocid": "catalog.difficulty_filters",
          children: DIFFICULTIES.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveDifficulty(value),
              "data-ocid": `catalog.difficulty_${value}_tab`,
              className: [
                "text-xs font-medium px-3 py-1 rounded-full border transition-smooth",
                activeDifficulty === value ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground bg-transparent"
              ].join(" "),
              children: label
            },
            value
          ))
        }
      )
    ] }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between min-h-[1.5rem]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        (courses == null ? void 0 : courses.length) ?? 0,
        " formation",
        ((courses == null ? void 0 : courses.length) ?? 0) !== 1 ? "s" : "",
        " trouvée",
        ((courses == null ? void 0 : courses.length) ?? 0) !== 1 ? "s" : ""
      ] }),
      hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: resetFilters,
          className: "text-muted-foreground hover:text-foreground h-7 gap-1",
          "data-ocid": "catalog.reset_filters_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }),
            "Réinitialiser les filtres"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center py-16",
        "data-ocid": "catalog.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) : !(courses == null ? void 0 : courses.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "catalog.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "Aucune formation trouvée",
        description: "Essayez de modifier vos critères de recherche ou explorez d'autres catégories.",
        action: {
          label: "Réinitialiser les filtres",
          onClick: resetFilters
        }
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
        "data-ocid": "catalog.courses_list",
        children: courses.map((course, i) => {
          const enrollment = enrollmentMap.get(course.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            CourseCard,
            {
              ...course,
              difficulty: course.difficulty,
              progress: enrollment == null ? void 0 : enrollment.progress,
              enrolled: !!enrollment,
              index: i,
              onEnroll: handleEnroll
            },
            course.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalCoursesSection, {})
  ] }) });
}
export {
  CatalogPage as default
};
