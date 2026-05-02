import { c as createLucideIcon, l as useParams, u as useNavigate, m as useGetCourse, af as useGetLessons, ag as useUpdateCourse, ah as useSetCoursePublished, ai as useDeleteLesson, aj as useUpdateLesson, r as reactExports, j as jsxRuntimeExports, L as Layout, f as LoadingSpinner, e as Button, p as Link, B as Badge, x as Separator, ad as Label, I as Input, C as CATEGORIES, v as BookOpen, h as ue, a9 as ChevronDown, T as Trash2, ak as useAddLesson, al as useGetQuiz, am as useSetQuiz } from "./index-D09cs5UV.js";
import { V as Video, C as Checkbox } from "./checkbox-DS8TOOaW.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DApGOtxs.js";
import { S as Switch } from "./switch-CqpoEhT-.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { A as ArrowLeft } from "./arrow-left-DCRm8SOu.js";
import { S as Save } from "./save-Cas2k9Vy.js";
import { X } from "./x-DU9MTTQ_.js";
import { P as Plus } from "./plus-Ca2hIDM0.js";
import { U as Upload } from "./upload-D7Yo8DgG.js";
import { C as ChevronUp } from "./chevron-up-CGPOmjX1.js";
import { P as Pencil } from "./pencil-CwU6fOmZ.js";
import "./index-CG-zuoud.js";
import "./check-CCiK2Afk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode);
const DIFFICULTIES = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" }
];
function QuizBuilder({
  lessonId,
  onClose
}) {
  const { data: existingQuiz } = useGetQuiz(lessonId);
  const setQuiz = useSetQuiz();
  const [questions, setQuestions] = reactExports.useState([]);
  const [passingScore, setPassingScore] = reactExports.useState(70);
  reactExports.useEffect(() => {
    if (existingQuiz) {
      setQuestions(existingQuiz.questions);
      setPassingScore(existingQuiz.passingScore);
    }
  }, [existingQuiz]);
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q${Date.now()}`,
        text: "",
        options: ["", "", "", ""],
        correctIndex: 0
      }
    ]);
  };
  const removeQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateQuestion = (idx, patch) => {
    setQuestions(
      (prev) => prev.map((q, i) => i === idx ? { ...q, ...patch } : q)
    );
  };
  const updateOption = (qIdx, oIdx, value) => {
    setQuestions(
      (prev) => prev.map(
        (q, i) => i === qIdx ? {
          ...q,
          options: q.options.map((o, oi) => oi === oIdx ? value : o)
        } : q
      )
    );
  };
  const handleSave = async () => {
    const quiz = { lessonId, questions, passingScore };
    try {
      await setQuiz.mutateAsync(quiz);
      ue.success("Quiz enregistré !");
      onClose();
    } catch {
      ue.error("Erreur lors de la sauvegarde du quiz");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[85vh] overflow-y-auto",
      "data-ocid": "quiz_builder.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-xl", children: "Quiz de la leçon" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-muted/50 rounded-lg px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium shrink-0", children: "Score de réussite (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0,
                max: 100,
                value: passingScore,
                onChange: (e) => setPassingScore(Number(e.target.value)),
                className: "w-24",
                "data-ocid": "quiz_builder.passing_score_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Le minimum pour valider la leçon" })
          ] }),
          questions.map((q, qIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-border rounded-xl p-4 space-y-3 bg-card",
              "data-ocid": `quiz_builder.question.${qIdx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-primary bg-primary/10 rounded px-2 py-0.5", children: [
                    "Q",
                    qIdx + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-destructive shrink-0",
                      onClick: () => removeQuestion(qIdx),
                      "data-ocid": `quiz_builder.delete_question.${qIdx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Énoncé de la question...",
                    value: q.text,
                    onChange: (e) => updateQuestion(qIdx, { text: e.target.value }),
                    "data-ocid": `quiz_builder.question_text.${qIdx + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Options (cochez la bonne réponse)" }),
                  ["A", "B", "C", "D"].map((optLabel, oIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        checked: q.correctIndex === oIdx,
                        onCheckedChange: () => updateQuestion(qIdx, { correctIndex: oIdx }),
                        "data-ocid": `quiz_builder.correct_answer.${qIdx + 1}.${oIdx + 1}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: `Option ${optLabel}`,
                        value: q.options[oIdx],
                        onChange: (e) => updateOption(qIdx, oIdx, e.target.value),
                        className: "h-8 text-sm",
                        "data-ocid": `quiz_builder.option.${qIdx + 1}.${oIdx + 1}`
                      }
                    )
                  ] }, optLabel))
                ] })
              ]
            },
            q.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: addQuestion,
              className: "w-full",
              "data-ocid": "quiz_builder.add_question_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
                "Ajouter une question"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "quiz_builder.cancel_button",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: setQuiz.isPending,
              className: "bg-accent text-accent-foreground hover:bg-accent/90",
              "data-ocid": "quiz_builder.save_button",
              children: setQuiz.isPending ? "Sauvegarde..." : "Sauvegarder le quiz"
            }
          )
        ] })
      ]
    }
  ) });
}
function LessonModal({
  courseId,
  editing,
  onClose
}) {
  const addLesson = useAddLesson();
  const updateLesson = useUpdateLesson();
  const videoInputRef = reactExports.useRef(null);
  const [videoFileName, setVideoFileName] = reactExports.useState(
    (editing == null ? void 0 : editing.videoUrl) ? "Vidéo déjà téléversée" : ""
  );
  const [form, setForm] = reactExports.useState({
    courseId,
    title: (editing == null ? void 0 : editing.title) ?? "",
    description: (editing == null ? void 0 : editing.description) ?? "",
    type: (editing == null ? void 0 : editing.videoUrl) ? "video" : "text",
    content: (editing == null ? void 0 : editing.content) ?? "",
    videoUrl: (editing == null ? void 0 : editing.videoUrl) ?? "",
    order: (editing == null ? void 0 : editing.order) ?? 1
  });
  const handleVideoFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setVideoFileName(file.name);
    setForm((p) => ({ ...p, videoUrl: objectUrl }));
  };
  const handleSave = async () => {
    if (!form.title) {
      ue.error("Le titre est requis");
      return;
    }
    try {
      if (editing) {
        await updateLesson.mutateAsync({
          lessonId: editing.id,
          courseId,
          data: form
        });
        ue.success("Leçon mise à jour !");
      } else {
        await addLesson.mutateAsync(form);
        ue.success("Leçon ajoutée !");
      }
      onClose();
    } catch {
      ue.error("Erreur lors de la sauvegarde");
    }
  };
  const isPending = addLesson.isPending || updateLesson.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "lesson_modal.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-xl", children: editing ? "Modifier la leçon" : "Nouvelle leçon" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lesson-title", children: "Titre *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "lesson-title",
            value: form.title,
            onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })),
            placeholder: "Ex: Introduction aux concepts clés",
            "data-ocid": "lesson_modal.title_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lesson-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "lesson-desc",
            value: form.description,
            onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
            placeholder: "Résumé bref de la leçon",
            "data-ocid": "lesson_modal.description_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type de contenu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["text", "video"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setForm((p) => ({ ...p, type: t })),
            className: `flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-smooth ${form.type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`,
            "data-ocid": `lesson_modal.type_${t}`,
            children: [
              t === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4" }),
              t === "text" ? "Texte" : "Vidéo"
            ]
          },
          t
        )) })
      ] }),
      form.type === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lesson-content", children: "Contenu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "lesson-content",
            value: form.content,
            onChange: (e) => setForm((p) => ({ ...p, content: e.target.value })),
            placeholder: "Rédigez le contenu de votre leçon...",
            rows: 6,
            "data-ocid": "lesson_modal.content_textarea"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fichier vidéo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: videoInputRef,
            type: "file",
            accept: "video/*",
            className: "hidden",
            onChange: handleVideoFileChange,
            "data-ocid": "lesson_modal.video_file_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "flex-1 justify-start gap-2 text-sm",
              onClick: () => {
                var _a;
                return (_a = videoInputRef.current) == null ? void 0 : _a.click();
              },
              "data-ocid": "lesson_modal.video_upload_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: videoFileName || "Sélectionner un fichier vidéo…" })
              ]
            }
          ),
          videoFileName && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "h-9 w-9 shrink-0 text-muted-foreground",
              onClick: () => {
                setVideoFileName("");
                setForm((p) => ({ ...p, videoUrl: "" }));
                if (videoInputRef.current)
                  videoInputRef.current.value = "";
              },
              "aria-label": "Retirer la vidéo",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Formats acceptés: MP4, WebM, MOV, AVI" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "lesson_modal.cancel_button",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          disabled: isPending,
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": "lesson_modal.save_button",
          children: isPending ? "Sauvegarde..." : editing ? "Mettre à jour" : "Ajouter"
        }
      )
    ] })
  ] }) });
}
function LessonRow({
  lesson,
  index,
  onEdit,
  onDelete,
  onQuiz,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:shadow-card transition-smooth",
      "data-ocid": `lesson.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "size-4 text-muted-foreground shrink-0 cursor-grab" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: onMoveUp,
              disabled: isFirst,
              "aria-label": "Monter",
              "data-ocid": `lesson.move_up.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: onMoveDown,
              disabled: isLast,
              "aria-label": "Descendre",
              "data-ocid": `lesson.move_down.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground w-6 shrink-0", children: lesson.order }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0", children: lesson.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground line-clamp-1", children: lesson.title }),
          lesson.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: lesson.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 text-xs px-2",
              onClick: onQuiz,
              "data-ocid": `lesson.quiz_button.${index + 1}`,
              children: "Quiz"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7",
              onClick: onEdit,
              "data-ocid": `lesson.edit_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-destructive hover:text-destructive",
              onClick: onDelete,
              "data-ocid": `lesson.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function InstructorCourseEditPage() {
  var _a;
  const { courseId } = useParams({
    from: "/instructor/courses/$courseId/edit"
  });
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useGetLessons(courseId);
  const updateCourse = useUpdateCourse();
  const setPublished = useSetCoursePublished();
  const deleteLesson = useDeleteLesson();
  const updateLesson = useUpdateLesson();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [difficulty, setDifficulty] = reactExports.useState("beginner");
  const [outcomes, setOutcomes] = reactExports.useState([""]);
  const [newOutcome, setNewOutcome] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [thumbnailPreview, setThumbnailPreview] = reactExports.useState("");
  const thumbnailInputRef = reactExports.useRef(null);
  const [showAddLesson, setShowAddLesson] = reactExports.useState(false);
  const [editingLesson, setEditingLesson] = reactExports.useState();
  const [quizLessonId, setQuizLessonId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setCategory(course.category);
      setDifficulty(course.difficulty);
      setThumbnailPreview(course.thumbnail ?? "");
    }
  }, [course]);
  const handleThumbnailFileChange = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
  };
  const handleSave = async () => {
    if (!title || !category) {
      ue.error("Titre et catégorie sont requis");
      return;
    }
    setSaving(true);
    try {
      await updateCourse.mutateAsync({
        id: courseId,
        data: { title, description, category, difficulty, outcomes }
      });
      ue.success("Formation mise à jour avec succès !");
      navigate({
        to: "/instructor/courses/$courseId",
        params: { courseId }
      });
    } catch {
      ue.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };
  const handleTogglePublish = async () => {
    if (!course) return;
    try {
      await setPublished.mutateAsync({
        id: courseId,
        published: !course.published
      });
      ue.success(
        course.published ? "Formation dépubliée" : "Formation publiée !"
      );
    } catch {
      ue.error("Erreur lors du changement de statut");
    }
  };
  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson.mutateAsync({ lessonId, courseId });
      ue.success("Leçon supprimée");
    } catch {
      ue.error("Erreur lors de la suppression");
    }
  };
  const handleMoveLesson = async (lesson, direction) => {
    const sorted = [...lessons].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((l) => l.id === lesson.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapLesson = sorted[swapIdx];
    try {
      await Promise.all([
        updateLesson.mutateAsync({
          lessonId: lesson.id,
          courseId,
          data: { order: swapLesson.order }
        }),
        updateLesson.mutateAsync({
          lessonId: swapLesson.id,
          courseId,
          data: { order: lesson.order }
        })
      ]);
    } catch {
      ue.error("Erreur lors du réordonnancement");
    }
  };
  const addOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes((p) => [...p, newOutcome.trim()]);
      setNewOutcome("");
    }
  };
  const removeOutcome = (idx) => {
    setOutcomes((p) => p.filter((_, i) => i !== idx));
  };
  if (courseLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex justify-center py-24",
        "data-ocid": "course_edit.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    ) });
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "course_edit.page", className: "space-y-8 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "ghost",
              size: "icon",
              className: "-ml-1",
              "data-ocid": "course_edit.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/instructor/courses/$courseId", params: { courseId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: (course == null ? void 0 : course.title) || "Modifier la formation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configurez le contenu et les paramètres" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: (course == null ? void 0 : course.published) ?? false,
                onCheckedChange: handleTogglePublish,
                disabled: setPublished.isPending,
                "data-ocid": "course_edit.publish_toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: (course == null ? void 0 : course.published) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "text-xs", children: "Publié" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Brouillon" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: saving,
              className: "bg-accent text-accent-foreground hover:bg-accent/90",
              "data-ocid": "course_edit.save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 mr-1.5" }),
                saving ? "Sauvegarde..." : "Sauvegarder"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              "data-ocid": "course_edit.cancel_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/instructor/courses/$courseId", params: { courseId }, children: "Annuler" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 shadow-card space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground", children: "Informations générales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Titre de la formation *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "title",
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  placeholder: "Ex: Introduction au Management Agile",
                  "data-ocid": "course_edit.title_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "description",
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  placeholder: "Décrivez le contenu et les objectifs de votre formation...",
                  rows: 5,
                  "data-ocid": "course_edit.description_textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Catégorie *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "course_edit.category_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sélectionnez..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Niveau de difficulté" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: difficulty,
                    onValueChange: (v) => setDifficulty(v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "course_edit.difficulty_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.value, children: d.label }, d.value)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Objectifs d'apprentissage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: outcomes.filter(Boolean).map((outcome, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2",
                  "data-ocid": `course_edit.outcome.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground flex-1", children: outcome }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-6 w-6 shrink-0",
                        onClick: () => removeOutcome(idx),
                        "data-ocid": `course_edit.remove_outcome.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
                      }
                    )
                  ]
                },
                `outcome-${outcome.slice(0, 20)}-${idx}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: newOutcome,
                    onChange: (e) => setNewOutcome(e.target.value),
                    placeholder: "Ex: Maîtriser les techniques de...",
                    onKeyDown: (e) => e.key === "Enter" && addOutcome(),
                    "data-ocid": "course_edit.new_outcome_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: addOutcome,
                    "data-ocid": "course_edit.add_outcome_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" })
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 shadow-card space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-lg text-foreground", children: [
                "Leçons",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
                  "(",
                  sortedLessons.length,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "bg-accent text-accent-foreground hover:bg-accent/90",
                  onClick: () => setShowAddLesson(true),
                  "data-ocid": "course_edit.add_lesson_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1.5" }),
                    "Ajouter une leçon"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            lessonsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex justify-center py-8",
                "data-ocid": "course_edit.lessons_loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {})
              }
            ) : !sortedLessons.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "py-10 text-center",
                "data-ocid": "course_edit.lessons.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 text-muted-foreground mx-auto mb-3 opacity-40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Aucune leçon ajoutée" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Ajoutez des leçons pour structurer votre formation." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "course_edit.lessons_list", children: sortedLessons.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              LessonRow,
              {
                lesson,
                index: i,
                onEdit: () => setEditingLesson(lesson),
                onDelete: () => handleDeleteLesson(lesson.id),
                onQuiz: () => setQuizLessonId(lesson.id),
                onMoveUp: () => handleMoveLesson(lesson, "up"),
                onMoveDown: () => handleMoveLesson(lesson, "down"),
                isFirst: i === 0,
                isLast: i === sortedLessons.length - 1
              },
              lesson.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-card space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground", children: "Miniature de la formation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video rounded-lg overflow-hidden bg-muted border border-border", children: thumbnailPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbnailPreview,
                alt: "Miniature",
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-8 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Aucune miniature" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: thumbnailInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleThumbnailFileChange,
                "data-ocid": "course_edit.thumbnail_file_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full gap-2",
                onClick: () => {
                  var _a2;
                  return (_a2 = thumbnailInputRef.current) == null ? void 0 : _a2.click();
                },
                "data-ocid": "course_edit.thumbnail_upload_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4" }),
                  "Changer la miniature"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Format recommandé: 16:9, 1280×720px" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 shadow-card space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground", children: "Récapitulatif" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Statut" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: (course == null ? void 0 : course.published) ? "default" : "secondary",
                    className: "text-xs",
                    children: (course == null ? void 0 : course.published) ? "Publié" : "Brouillon"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Leçons" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: sortedLessons.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Catégorie" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-right text-xs", children: category || "–" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Niveau" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: ((_a = DIFFICULTIES.find((d) => d.value === difficulty)) == null ? void 0 : _a.label) ?? "–" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    (showAddLesson || editingLesson) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LessonModal,
      {
        courseId,
        editing: editingLesson,
        onClose: () => {
          setShowAddLesson(false);
          setEditingLesson(void 0);
        }
      }
    ),
    quizLessonId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuizBuilder,
      {
        lessonId: quizLessonId,
        onClose: () => setQuizLessonId(null)
      }
    )
  ] });
}
export {
  InstructorCourseEditPage as default
};
