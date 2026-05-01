import { Layout } from "@/components/Layout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";
import {
  useAddLesson,
  useDeleteLesson,
  useGetCourse,
  useGetLessons,
  useGetQuiz,
  useSetCoursePublished,
  useSetQuiz,
  useUpdateCourse,
  useUpdateLesson,
} from "@/lib/queries";
import type {
  Difficulty,
  Lesson,
  LessonInput,
  Quiz,
  QuizQuestion,
} from "@/lib/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

// ---- Quiz Builder ----
function QuizBuilder({
  lessonId,
  onClose,
}: { lessonId: string; onClose: () => void }) {
  const { data: existingQuiz } = useGetQuiz(lessonId);
  const setQuiz = useSetQuiz();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [passingScore, setPassingScore] = useState(70);

  useEffect(() => {
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
        correctIndex: 0,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    );
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((o, oi) => (oi === oIdx ? value : o)),
            }
          : q,
      ),
    );
  };

  const handleSave = async () => {
    const quiz: Quiz = { lessonId, questions, passingScore };
    try {
      await setQuiz.mutateAsync(quiz);
      toast.success("Quiz enregistré !");
      onClose();
    } catch {
      toast.error("Erreur lors de la sauvegarde du quiz");
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        data-ocid="quiz_builder.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            Quiz de la leçon
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center gap-4 bg-muted/50 rounded-lg px-4 py-3">
            <Label className="text-sm font-medium shrink-0">
              Score de réussite (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-24"
              data-ocid="quiz_builder.passing_score_input"
            />
            <span className="text-xs text-muted-foreground">
              Le minimum pour valider la leçon
            </span>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="border border-border rounded-xl p-4 space-y-3 bg-card"
              data-ocid={`quiz_builder.question.${qIdx + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 rounded px-2 py-0.5">
                  Q{qIdx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive shrink-0"
                  onClick={() => removeQuestion(qIdx)}
                  data-ocid={`quiz_builder.delete_question.${qIdx + 1}`}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
              <Input
                placeholder="Énoncé de la question..."
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
                data-ocid={`quiz_builder.question_text.${qIdx + 1}`}
              />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Options (cochez la bonne réponse)
                </Label>
                {(["A", "B", "C", "D"] as const).map((optLabel, oIdx) => (
                  <div key={optLabel} className="flex items-center gap-2">
                    <Checkbox
                      checked={q.correctIndex === oIdx}
                      onCheckedChange={() =>
                        updateQuestion(qIdx, { correctIndex: oIdx })
                      }
                      data-ocid={`quiz_builder.correct_answer.${qIdx + 1}.${oIdx + 1}`}
                    />
                    <Input
                      placeholder={`Option ${optLabel}`}
                      value={q.options[oIdx]}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      className="h-8 text-sm"
                      data-ocid={`quiz_builder.option.${qIdx + 1}.${oIdx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addQuestion}
            className="w-full"
            data-ocid="quiz_builder.add_question_button"
          >
            <Plus className="size-4 mr-1.5" />
            Ajouter une question
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="quiz_builder.cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={setQuiz.isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="quiz_builder.save_button"
          >
            {setQuiz.isPending ? "Sauvegarde..." : "Sauvegarder le quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Lesson Modal ----
function LessonModal({
  courseId,
  editing,
  onClose,
}: { courseId: string; editing?: Lesson; onClose: () => void }) {
  const addLesson = useAddLesson();
  const updateLesson = useUpdateLesson();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoFileName, setVideoFileName] = useState(
    editing?.videoUrl ? "Vidéo déjà téléversée" : "",
  );
  const [form, setForm] = useState<Partial<LessonInput>>({
    courseId,
    title: editing?.title ?? "",
    description: editing?.description ?? "",
    type: editing?.videoUrl ? "video" : "text",
    content: editing?.content ?? "",
    videoUrl: editing?.videoUrl ?? "",
    order: editing?.order ?? 1,
  });

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Create a local object URL for preview/storage until backend integration
    const objectUrl = URL.createObjectURL(file);
    setVideoFileName(file.name);
    setForm((p) => ({ ...p, videoUrl: objectUrl }));
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Le titre est requis");
      return;
    }
    try {
      if (editing) {
        await updateLesson.mutateAsync({
          lessonId: editing.id,
          courseId,
          data: form,
        });
        toast.success("Leçon mise à jour !");
      } else {
        await addLesson.mutateAsync(form as LessonInput);
        toast.success("Leçon ajoutée !");
      }
      onClose();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const isPending = addLesson.isPending || updateLesson.isPending;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="lesson_modal.dialog">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            {editing ? "Modifier la leçon" : "Nouvelle leçon"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Titre *</Label>
            <Input
              id="lesson-title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Ex: Introduction aux concepts clés"
              data-ocid="lesson_modal.title_input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-desc">Description</Label>
            <Input
              id="lesson-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Résumé bref de la leçon"
              data-ocid="lesson_modal.description_input"
            />
          </div>
          <div className="space-y-2">
            <Label>Type de contenu</Label>
            <div className="flex gap-2">
              {(["text", "video"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-smooth ${form.type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  data-ocid={`lesson_modal.type_${t}`}
                >
                  {t === "text" ? (
                    <BookOpen className="size-4" />
                  ) : (
                    <Video className="size-4" />
                  )}
                  {t === "text" ? "Texte" : "Vidéo"}
                </button>
              ))}
            </div>
          </div>

          {form.type === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="lesson-content">Contenu</Label>
              <Textarea
                id="lesson-content"
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                placeholder="Rédigez le contenu de votre leçon..."
                rows={6}
                data-ocid="lesson_modal.content_textarea"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Fichier vidéo</Label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoFileChange}
                data-ocid="lesson_modal.video_file_input"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 justify-start gap-2 text-sm"
                  onClick={() => videoInputRef.current?.click()}
                  data-ocid="lesson_modal.video_upload_button"
                >
                  <Upload className="size-4 shrink-0" />
                  <span className="truncate">
                    {videoFileName || "Sélectionner un fichier vidéo…"}
                  </span>
                </Button>
                {videoFileName && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground"
                    onClick={() => {
                      setVideoFileName("");
                      setForm((p) => ({ ...p, videoUrl: "" }));
                      if (videoInputRef.current)
                        videoInputRef.current.value = "";
                    }}
                    aria-label="Retirer la vidéo"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: MP4, WebM, MOV, AVI
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="lesson_modal.cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="lesson_modal.save_button"
          >
            {isPending
              ? "Sauvegarde..."
              : editing
                ? "Mettre à jour"
                : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Lesson Row ----
function LessonRow({
  lesson,
  index,
  onEdit,
  onDelete,
  onQuiz,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  lesson: Lesson;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onQuiz: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:shadow-card transition-smooth"
      data-ocid={`lesson.item.${index + 1}`}
    >
      <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Monter"
          data-ocid={`lesson.move_up.${index + 1}`}
        >
          <ChevronUp className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Descendre"
          data-ocid={`lesson.move_down.${index + 1}`}
        >
          <ChevronDown className="size-3.5" />
        </Button>
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-6 shrink-0">
        {lesson.order}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {lesson.videoUrl ? (
          <Video className="size-3.5 text-accent" />
        ) : (
          <BookOpen className="size-3.5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1">
          {lesson.title}
        </p>
        {lesson.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {lesson.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs px-2"
          onClick={onQuiz}
          data-ocid={`lesson.quiz_button.${index + 1}`}
        >
          Quiz
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onEdit}
          data-ocid={`lesson.edit_button.${index + 1}`}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onDelete}
          data-ocid={`lesson.delete_button.${index + 1}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function InstructorCourseEditPage() {
  const { courseId } = useParams({
    from: "/instructor/courses/$courseId/edit",
  });
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useGetLessons(courseId);

  const updateCourse = useUpdateCourse();
  const setPublished = useSetCoursePublished();
  const deleteLesson = useDeleteLesson();
  const updateLesson = useUpdateLesson();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [newOutcome, setNewOutcome] = useState("");
  const [saving, setSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);

  // Init form from course data
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setCategory(course.category);
      setDifficulty(course.difficulty);
      setThumbnailPreview(course.thumbnail ?? "");
    }
  }, [course]);

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
  };

  const handleSave = async () => {
    if (!title || !category) {
      toast.error("Titre et catégorie sont requis");
      return;
    }
    setSaving(true);
    try {
      await updateCourse.mutateAsync({
        id: courseId,
        data: { title, description, category, difficulty, outcomes },
      });
      toast.success("Formation mise à jour avec succès !");
      navigate({
        to: "/instructor/courses/$courseId",
        params: { courseId },
      });
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!course) return;
    try {
      await setPublished.mutateAsync({
        id: courseId,
        published: !course.published,
      });
      toast.success(
        course.published ? "Formation dépubliée" : "Formation publiée !",
      );
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson.mutateAsync({ lessonId, courseId });
      toast.success("Leçon supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleMoveLesson = async (lesson: Lesson, direction: "up" | "down") => {
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
          data: { order: swapLesson.order },
        }),
        updateLesson.mutateAsync({
          lessonId: swapLesson.id,
          courseId,
          data: { order: lesson.order },
        }),
      ]);
    } catch {
      toast.error("Erreur lors du réordonnancement");
    }
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes((p) => [...p, newOutcome.trim()]);
      setNewOutcome("");
    }
  };

  const removeOutcome = (idx: number) => {
    setOutcomes((p) => p.filter((_, i) => i !== idx));
  };

  if (courseLoading)
    return (
      <Layout>
        <div
          className="flex justify-center py-24"
          data-ocid="course_edit.loading_state"
        >
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div data-ocid="course_edit.page" className="space-y-8 pb-12">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="-ml-1"
              data-ocid="course_edit.back_button"
            >
              <Link to="/instructor/courses/$courseId" params={{ courseId }}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                {course?.title || "Modifier la formation"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configurez le contenu et les paramètres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Publish toggle */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
              <Switch
                checked={course?.published ?? false}
                onCheckedChange={handleTogglePublish}
                disabled={setPublished.isPending}
                data-ocid="course_edit.publish_toggle"
              />
              <span className="text-sm font-medium">
                {course?.published ? (
                  <Badge variant="default" className="text-xs">
                    Publié
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Brouillon
                  </Badge>
                )}
              </span>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="course_edit.save_button"
            >
              <Save className="size-4 mr-1.5" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button
              asChild
              variant="outline"
              data-ocid="course_edit.cancel_button"
            >
              <Link to="/instructor/courses/$courseId" params={{ courseId }}>
                Annuler
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Course info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Informations générales
              </h2>
              <Separator />

              <div className="space-y-2">
                <Label htmlFor="title">Titre de la formation *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Introduction au Management Agile"
                  data-ocid="course_edit.title_input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le contenu et les objectifs de votre formation..."
                  rows={5}
                  data-ocid="course_edit.description_textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-ocid="course_edit.category_select">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Niveau de difficulté</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(v) => setDifficulty(v as Difficulty)}
                  >
                    <SelectTrigger data-ocid="course_edit.difficulty_select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Learning outcomes */}
              <div className="space-y-3">
                <Label>Objectifs d&apos;apprentissage</Label>
                <div className="space-y-2">
                  {outcomes.filter(Boolean).map((outcome, idx) => (
                    <div
                      key={`outcome-${outcome.slice(0, 20)}-${idx}`}
                      className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2"
                      data-ocid={`course_edit.outcome.${idx + 1}`}
                    >
                      <span className="text-sm text-foreground flex-1">
                        {outcome}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => removeOutcome(idx)}
                        data-ocid={`course_edit.remove_outcome.${idx + 1}`}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="Ex: Maîtriser les techniques de..."
                    onKeyDown={(e) => e.key === "Enter" && addOutcome()}
                    data-ocid="course_edit.new_outcome_input"
                  />
                  <Button
                    variant="outline"
                    onClick={addOutcome}
                    data-ocid="course_edit.add_outcome_button"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lessons section */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Leçons{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({sortedLessons.length})
                  </span>
                </h2>
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => setShowAddLesson(true)}
                  data-ocid="course_edit.add_lesson_button"
                >
                  <Plus className="size-4 mr-1.5" />
                  Ajouter une leçon
                </Button>
              </div>
              <Separator />

              {lessonsLoading ? (
                <div
                  className="flex justify-center py-8"
                  data-ocid="course_edit.lessons_loading_state"
                >
                  <LoadingSpinner />
                </div>
              ) : !sortedLessons.length ? (
                <div
                  className="py-10 text-center"
                  data-ocid="course_edit.lessons.empty_state"
                >
                  <BookOpen className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-foreground">
                    Aucune leçon ajoutée
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez des leçons pour structurer votre formation.
                  </p>
                </div>
              ) : (
                <div className="space-y-2" data-ocid="course_edit.lessons_list">
                  {sortedLessons.map((lesson, i) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      index={i}
                      onEdit={() => setEditingLesson(lesson)}
                      onDelete={() => handleDeleteLesson(lesson.id)}
                      onQuiz={() => setQuizLessonId(lesson.id)}
                      onMoveUp={() => handleMoveLesson(lesson, "up")}
                      onMoveDown={() => handleMoveLesson(lesson, "down")}
                      isFirst={i === 0}
                      isLast={i === sortedLessons.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Thumbnail + meta */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
              <h2 className="font-display font-semibold text-base text-foreground">
                Miniature de la formation
              </h2>
              <Separator />
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Miniature"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <BookOpen className="size-8 opacity-30" />
                    <span className="text-xs">Aucune miniature</span>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailFileChange}
                data-ocid="course_edit.thumbnail_file_input"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => thumbnailInputRef.current?.click()}
                data-ocid="course_edit.thumbnail_upload_button"
              >
                <Upload className="size-4" />
                Changer la miniature
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Format recommandé: 16:9, 1280×720px
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
              <h2 className="font-display font-semibold text-base text-foreground">
                Récapitulatif
              </h2>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge
                    variant={course?.published ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {course?.published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leçons</span>
                  <span className="font-medium text-foreground">
                    {sortedLessons.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span className="font-medium text-foreground text-right text-xs">
                    {category || "–"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Niveau</span>
                  <span className="font-medium text-foreground">
                    {DIFFICULTIES.find((d) => d.value === difficulty)?.label ??
                      "–"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showAddLesson || editingLesson) && (
        <LessonModal
          courseId={courseId}
          editing={editingLesson}
          onClose={() => {
            setShowAddLesson(false);
            setEditingLesson(undefined);
          }}
        />
      )}

      {quizLessonId && (
        <QuizBuilder
          lessonId={quizLessonId}
          onClose={() => setQuizLessonId(null)}
        />
      )}
    </Layout>
  );
}
