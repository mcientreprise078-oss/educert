import { Layout } from "@/components/Layout";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetCourse,
  useGetCourseEnrollments,
  useGetLessons,
} from "@/lib/queries";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit2,
  Trophy,
  Users,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InstructorCourseDetailPage() {
  const { courseId } = useParams({ from: "/instructor/courses/$courseId" });
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: enrollments, isLoading: enrollLoading } =
    useGetCourseEnrollments(courseId);
  const { data: lessons } = useGetLessons(courseId);

  const isLoading = courseLoading || enrollLoading;

  if (isLoading)
    return (
      <Layout>
        <div
          className="flex justify-center py-24"
          data-ocid="instructor_course_detail.loading_state"
        >
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );

  if (!course)
    return (
      <Layout>
        <EmptyState
          icon={BookOpen}
          title="Formation introuvable"
          description="Cette formation n'existe pas ou a été supprimée."
          action={{ label: "Retour au tableau de bord", onClick: () => {} }}
        />
      </Layout>
    );

  const completedCount =
    enrollments?.filter((e) => e.progress === 100).length ?? 0;
  const avgProgress =
    enrollments && enrollments.length > 0
      ? Math.round(
          enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length,
        )
      : 0;

  const lessonCount = lessons?.length ?? course.lessonCount;
  const lessonCompletionRates =
    lessons?.map((lesson) => {
      const completedBy =
        enrollments?.filter((e) => e.completedLessons >= lesson.order).length ??
        0;
      const total = enrollments?.length ?? 1;
      return {
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        rate: total > 0 ? Math.round((completedBy / total) * 100) : 0,
      };
    }) ?? [];

  return (
    <Layout>
      <div data-ocid="instructor_course_detail.page" className="space-y-8">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Button
              asChild
              variant="ghost"
              className="-ml-2 mb-3"
              data-ocid="instructor_course_detail.back_button"
            >
              <Link to="/instructor">
                <ArrowLeft className="size-4 mr-2" />
                Tableau de bord
              </Link>
            </Button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-bold text-2xl text-foreground">
                {course.title}
              </h1>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "Publié" : "Brouillon"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
              {course.description}
            </p>
          </div>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
            data-ocid="instructor_course_detail.edit_button"
          >
            <Link to="/instructor/courses/$courseId/edit" params={{ courseId }}>
              <Edit2 className="size-4 mr-2" />
              Modifier
            </Link>
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              label: "Apprenants inscrits",
              value: (
                enrollments?.length ?? course.enrollmentCount
              ).toLocaleString(),
            },
            {
              icon: CheckCircle2,
              label: "Ont terminé",
              value: completedCount.toString(),
            },
            {
              icon: Trophy,
              label: "Progression moyenne",
              value: `${avgProgress}%`,
            },
            { icon: BookOpen, label: "Leçons", value: lessonCount.toString() },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="size-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="font-display font-bold text-2xl text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learner list */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Apprenants inscrits
              </h2>
            </div>
            {!enrollments?.length ? (
              <div
                className="py-12 flex flex-col items-center justify-center text-center px-4"
                data-ocid="instructor_course_detail.enrollments.empty_state"
              >
                <Users className="size-10 text-muted-foreground mb-3 opacity-40" />
                <p className="font-medium text-foreground">
                  Aucun apprenant inscrit
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Publiez votre formation pour recevoir des inscriptions.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {enrollments.map((enrollment, i) => (
                  <div
                    key={enrollment.learnerId}
                    className="px-5 py-4 flex items-center gap-3"
                    data-ocid={`instructor_course_detail.learner.${i + 1}`}
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(enrollment.learnerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {enrollment.learnerName}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {enrollment.progress === 100 && (
                            <Badge
                              variant="default"
                              className="text-xs bg-primary/15 text-primary border-0"
                            >
                              Terminé
                            </Badge>
                          )}
                          <span className="text-xs font-semibold text-foreground">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={enrollment.progress}
                        showLabel={false}
                        variant={
                          enrollment.progress === 100 ? "success" : "primary"
                        }
                      />
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {enrollment.completedLessons}/{lessonCount} leçons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          Inscrit le {formatDate(enrollment.enrolledAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lesson completion rates */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Complétion par leçon
              </h2>
            </div>
            {!lessonCompletionRates.length ? (
              <div
                className="py-10 text-center px-4"
                data-ocid="instructor_course_detail.lessons.empty_state"
              >
                <BookOpen className="size-8 text-muted-foreground mb-2 mx-auto opacity-40" />
                <p className="text-sm text-muted-foreground">
                  Aucune leçon ajoutée
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {lessonCompletionRates.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    data-ocid={`instructor_course_detail.lesson_stat.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs text-foreground font-medium line-clamp-2 flex-1">
                        {lesson.order}. {lesson.title}
                      </span>
                      <span className="text-xs font-semibold text-foreground shrink-0">
                        {lesson.rate}%
                      </span>
                    </div>
                    <ProgressBar
                      value={lesson.rate}
                      showLabel={false}
                      variant={
                        lesson.rate >= 80
                          ? "success"
                          : lesson.rate >= 50
                            ? "primary"
                            : "accent"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail preview */}
        {course.thumbnail && (
          <div className="rounded-xl overflow-hidden border border-border aspect-video max-w-xl">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
