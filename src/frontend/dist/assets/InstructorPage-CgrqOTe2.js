import { aa as useGetInstructorCourses, ab as useDeleteCourse, r as reactExports, v as BookOpen, U as Users, S as Star, j as jsxRuntimeExports, L as Layout, e as Button, f as LoadingSpinner, B as Badge, p as Link, T as Trash2, h as ue, u as useNavigate, ac as useCreateCourse, ad as Label, I as Input, C as CATEGORIES } from "./index-D09cs5UV.js";
import { E as EmptyState } from "./EmptyState-C4UcnAWk.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DApGOtxs.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { T as TrendingUp } from "./trending-up-qzyPIsDv.js";
import { P as Plus } from "./plus-Ca2hIDM0.js";
import { E as Eye } from "./eye-BUftAp5-.js";
import { P as Pen } from "./pen-Sk67r7ll.js";
import "./x-DU9MTTQ_.js";
import "./index-CG-zuoud.js";
import "./check-CCiK2Afk.js";
import "./chevron-up-CGPOmjX1.js";
const DIFFICULTIES = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" }
];
function CreateCourseDialog({
  open,
  onClose
}) {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  const [form, setForm] = reactExports.useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    outcomes: [],
    thumbnail: "",
    price: 0,
    tags: []
  });
  const handleSubmit = async () => {
    if (!form.title || !form.category) {
      ue.error("Titre et catégorie sont requis");
      return;
    }
    try {
      const course = await createCourse.mutateAsync(form);
      ue.success("Formation créée avec succès !");
      onClose();
      navigate({
        to: "/instructor/courses/$courseId/edit",
        params: { courseId: course.id }
      });
    } catch {
      ue.error("Erreur lors de la création");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "create_course.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-xl", children: "Nouvelle formation" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-title", children: "Titre *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "new-title",
            value: form.title,
            onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })),
            placeholder: "Ex: Leadership Transformationnel",
            "data-ocid": "create_course.title_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "new-desc",
            value: form.description,
            onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
            placeholder: "Décrivez brièvement votre formation...",
            rows: 3,
            "data-ocid": "create_course.description_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Catégorie *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setForm((p) => ({ ...p, category: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "create_course.category_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choisir..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Niveau" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.difficulty,
              onValueChange: (v) => setForm((p) => ({ ...p, difficulty: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "create_course.difficulty_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.value, children: d.label }, d.value)) })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "create_course.cancel_button",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSubmit,
          disabled: createCourse.isPending,
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": "create_course.submit_button",
          children: createCourse.isPending ? "Création..." : "Créer & Configurer"
        }
      )
    ] })
  ] }) });
}
function DeleteConfirmDialog({
  courseTitle,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "delete_course.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold", children: "Supprimer la formation" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
      "Voulez-vous vraiment supprimer",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
        "“",
        courseTitle,
        "”"
      ] }),
      "? Cette action est irréversible."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "delete_course.cancel_button",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          onClick: onConfirm,
          "data-ocid": "delete_course.confirm_button",
          children: "Supprimer"
        }
      )
    ] })
  ] }) });
}
function InstructorPage() {
  const { data: courses, isLoading } = useGetInstructorCourses();
  const deleteCourse = useDeleteCourse();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const totalStudents = (courses == null ? void 0 : courses.reduce((s, c) => s + c.enrollmentCount, 0)) ?? 0;
  const publishedCount = (courses == null ? void 0 : courses.filter((c) => c.published).length) ?? 0;
  const draftCount = ((courses == null ? void 0 : courses.length) ?? 0) - publishedCount;
  const avgRating = courses && courses.length > 0 ? (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1) : "–";
  const stats = [
    {
      icon: BookOpen,
      label: "Formations",
      value: String((courses == null ? void 0 : courses.length) ?? 0),
      sub: `${publishedCount} publiées · ${draftCount} brouillons`
    },
    {
      icon: Users,
      label: "Apprenants inscrits",
      value: totalStudents.toLocaleString(),
      sub: "total des inscriptions"
    },
    {
      icon: Star,
      label: "Note moyenne",
      value: String(avgRating),
      sub: "sur 5 étoiles"
    },
    {
      icon: TrendingUp,
      label: "Taux de complétion",
      value: "73%",
      sub: "+5% ce mois"
    }
  ];
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCourse.mutateAsync(deletingId);
      ue.success("Formation supprimée");
    } catch {
      ue.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };
  const deletingCourse = courses == null ? void 0 : courses.find((c) => c.id === deletingId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "instructor.page", className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground mb-1", children: "Tableau de bord Formateur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Gérez vos formations et suivez vos apprenants" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            className: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated",
            "data-ocid": "instructor.create_course_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
              "Nouvelle formation"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat) => {
        const Icon = stat.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 shadow-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/10 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: stat.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.sub })
            ]
          },
          stat.label
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Mes formations" }),
          courses && courses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            courses.length,
            " formation",
            courses.length > 1 ? "s" : ""
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex justify-center py-16",
            "data-ocid": "instructor.loading_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
          }
        ) : !(courses == null ? void 0 : courses.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "instructor.courses_list.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: BookOpen,
            title: "Aucune formation créée",
            description: "Créez votre première formation et partagez votre expertise avec des milliers d'apprenants.",
            action: {
              label: "Créer une formation",
              onClick: () => setShowCreate(true)
            }
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "instructor.courses_list", children: courses.map((course, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-elevated transition-smooth flex items-center gap-4",
            "data-ocid": `instructor.course.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-muted", children: course.thumbnail ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: course.thumbnail,
                  alt: course.title,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-muted-foreground" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground line-clamp-1", children: course.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: course.published ? "default" : "secondary",
                      className: "text-xs shrink-0",
                      children: course.published ? "Publié" : "Brouillon"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
                    course.enrollmentCount.toLocaleString(),
                    " apprenants"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3 fill-accent text-accent" }),
                    course.rating > 0 ? course.rating.toFixed(1) : "N/A"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3" }),
                    course.lessonCount,
                    " leçons"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    "data-ocid": `instructor.view_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/instructor/courses/$courseId",
                        params: { courseId: course.id },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    "data-ocid": `instructor.edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/instructor/courses/$courseId/edit",
                        params: { courseId: course.id },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-destructive hover:text-destructive",
                    onClick: () => setDeletingId(course.id),
                    "data-ocid": `instructor.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" })
                  }
                )
              ] })
            ]
          },
          course.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateCourseDialog,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    deletingId && deletingCourse && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        courseTitle: deletingCourse.title,
        onConfirm: handleDelete,
        onCancel: () => setDeletingId(null)
      }
    )
  ] });
}
export {
  InstructorPage as default
};
