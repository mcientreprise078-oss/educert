import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";
import {
  useCreateCourse,
  useDeleteCourse,
  useGetInstructorCourses,
} from "@/lib/queries";
import type { CourseInput, Difficulty } from "@/lib/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Edit2,
  Eye,
  Plus,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

function CreateCourseDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  const [form, setForm] = useState<Partial<CourseInput>>({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    outcomes: [],
    thumbnail: "",
    price: 0,
    tags: [],
  });

  const handleSubmit = async () => {
    if (!form.title || !form.category) {
      toast.error("Titre et catégorie sont requis");
      return;
    }
    try {
      const course = await createCourse.mutateAsync(form as CourseInput);
      toast.success("Formation créée avec succès !");
      onClose();
      navigate({
        to: "/instructor/courses/$courseId/edit",
        params: { courseId: course.id },
      });
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="create_course.dialog">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            Nouvelle formation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="new-title">Titre *</Label>
            <Input
              id="new-title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Ex: Leadership Transformationnel"
              data-ocid="create_course.title_input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-desc">Description</Label>
            <Textarea
              id="new-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Décrivez brièvement votre formation..."
              rows={3}
              data-ocid="create_course.description_textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger data-ocid="create_course.category_select">
                  <SelectValue placeholder="Choisir..." />
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
              <Label>Niveau</Label>
              <Select
                value={form.difficulty}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, difficulty: v as Difficulty }))
                }
              >
                <SelectTrigger data-ocid="create_course.difficulty_select">
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="create_course.cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createCourse.isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="create_course.submit_button"
          >
            {createCourse.isPending ? "Création..." : "Créer & Configurer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  courseTitle,
  onConfirm,
  onCancel,
}: { courseTitle: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Dialog open onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm" data-ocid="delete_course.dialog">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">
            Supprimer la formation
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-semibold text-foreground">
            &ldquo;{courseTitle}&rdquo;
          </span>
          ? Cette action est irréversible.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            data-ocid="delete_course.cancel_button"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            data-ocid="delete_course.confirm_button"
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function InstructorPage() {
  const { data: courses, isLoading } = useGetInstructorCourses();
  const deleteCourse = useDeleteCourse();
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalStudents =
    courses?.reduce((s, c) => s + c.enrollmentCount, 0) ?? 0;
  const publishedCount = courses?.filter((c) => c.published).length ?? 0;
  const draftCount = (courses?.length ?? 0) - publishedCount;
  const avgRating =
    courses && courses.length > 0
      ? (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1)
      : "–";

  const stats = [
    {
      icon: BookOpen,
      label: "Formations",
      value: String(courses?.length ?? 0),
      sub: `${publishedCount} publiées · ${draftCount} brouillons`,
    },
    {
      icon: Users,
      label: "Apprenants inscrits",
      value: totalStudents.toLocaleString(),
      sub: "total des inscriptions",
    },
    {
      icon: Star,
      label: "Note moyenne",
      value: String(avgRating),
      sub: "sur 5 étoiles",
    },
    {
      icon: TrendingUp,
      label: "Taux de complétion",
      value: "73%",
      sub: "+5% ce mois",
    },
  ];

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCourse.mutateAsync(deletingId);
      toast.success("Formation supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const deletingCourse = courses?.find((c) => c.id === deletingId);

  return (
    <Layout>
      <div data-ocid="instructor.page" className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground mb-1">
              Tableau de bord Formateur
            </h1>
            <p className="text-muted-foreground">
              Gérez vos formations et suivez vos apprenants
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated"
            data-ocid="instructor.create_course_button"
          >
            <Plus className="size-4 mr-1.5" />
            Nouvelle formation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 shadow-card"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
                <p className="font-display font-bold text-2xl text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Course list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-foreground">
              Mes formations
            </h2>
            {courses && courses.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {courses.length} formation{courses.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div
              className="flex justify-center py-16"
              data-ocid="instructor.loading_state"
            >
              <LoadingSpinner size="lg" />
            </div>
          ) : !courses?.length ? (
            <div data-ocid="instructor.courses_list.empty_state">
              <EmptyState
                icon={BookOpen}
                title="Aucune formation créée"
                description="Créez votre première formation et partagez votre expertise avec des milliers d'apprenants."
                action={{
                  label: "Créer une formation",
                  onClick: () => setShowCreate(true),
                }}
              />
            </div>
          ) : (
            <div className="space-y-3" data-ocid="instructor.courses_list">
              {courses.map((course, i) => (
                <div
                  key={course.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-elevated transition-smooth flex items-center gap-4"
                  data-ocid={`instructor.course.${i + 1}`}
                >
                  <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {course.title}
                      </h3>
                      <Badge
                        variant={course.published ? "default" : "secondary"}
                        className="text-xs shrink-0"
                      >
                        {course.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {course.enrollmentCount.toLocaleString()} apprenants
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-3 fill-accent text-accent" />
                        {course.rating > 0 ? course.rating.toFixed(1) : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3" />
                        {course.lessonCount} leçons
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      data-ocid={`instructor.view_button.${i + 1}`}
                    >
                      <Link
                        to="/instructor/courses/$courseId"
                        params={{ courseId: course.id }}
                      >
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      data-ocid={`instructor.edit_button.${i + 1}`}
                    >
                      <Link
                        to="/instructor/courses/$courseId/edit"
                        params={{ courseId: course.id }}
                      >
                        <Edit2 className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeletingId(course.id)}
                      data-ocid={`instructor.delete_button.${i + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCourseDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {deletingId && deletingCourse && (
        <DeleteConfirmDialog
          courseTitle={deletingCourse.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </Layout>
  );
}
