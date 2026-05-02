import { Layout } from "@/components/Layout";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { useGetCourses, useGetEnrollments } from "@/lib/queries";
import type { Difficulty } from "@/lib/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { Award, BarChart2, BookOpen, CheckCircle2, Clock } from "lucide-react";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useGetEnrollments();
  const { data: allCourses } = useGetCourses();

  const enrolledCourses = (enrollments ?? [])
    .map((e) => {
      const course = (allCourses ?? []).find((c) => c.id === e.courseId);
      return { enrollment: e, course };
    })
    .filter((item) => item.course != null);

  const inProgress = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress < 100,
  );
  const completed = enrolledCourses.filter(
    ({ enrollment }) => enrollment.progress >= 100,
  );

  function getLastLesson(completedLessons: string[]): string {
    if (completedLessons.length === 0) return "l1";
    return `l${completedLessons.length + 1}`;
  }

  function daysSince(ts: number): string {
    const days = Math.floor((Date.now() - ts) / 86400000);
    return days === 0
      ? "Aujourd'hui"
      : `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  }

  return (
    <Layout>
      <div data-ocid="my_courses.page" className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">
            Mes formations
          </h1>
          <p className="text-muted-foreground">
            Suivez votre progression et continuez votre apprentissage
          </p>
        </div>

        {isLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="my_courses.loading_state"
          >
            <LoadingSpinner size="lg" />
          </div>
        ) : enrolledCourses.length === 0 ? (
          <EmptyState
            data-ocid="my_courses.empty_state"
            icon={BookOpen}
            title="Aucune formation en cours"
            description="Inscrivez-vous à une formation pour commencer votre apprentissage professionnel."
            action={{
              label: "Explorer le catalogue",
              onClick: () => navigate({ to: "/catalog" }),
            }}
          />
        ) : (
          <div className="space-y-10">
            {/* In Progress */}
            {inProgress.length > 0 && (
              <section data-ocid="my_courses.in_progress.section">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <BarChart2 className="size-5 text-primary" />
                  En cours
                  <Badge variant="secondary" className="ml-1">
                    {inProgress.length}
                  </Badge>
                </h2>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  data-ocid="my_courses.list"
                >
                  {inProgress.map(({ enrollment, course }, i) => (
                    <article
                      key={enrollment.id}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col"
                      data-ocid={`my_courses.item.${i + 1}`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {(course as { thumbnail?: string })?.thumbnail ? (
                          <img
                            src={(course as { thumbnail: string }).thumbnail}
                            alt={(course as { title: string }).title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="size-10 text-muted-foreground" />
                          </div>
                        )}
                        {/* Progress strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/60">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {
                              DIFFICULTY_LABELS[
                                (course as { difficulty?: Difficulty })
                                  ?.difficulty ?? "beginner"
                              ]
                            }
                            {" · "}
                            {(course as { lessonCount?: number })
                              ?.lessonCount ?? "?"}{" "}
                            leçons
                          </p>
                          <h3 className="font-display font-semibold text-foreground line-clamp-2">
                            {(course as { title: string }).title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {(course as { instructor?: string })?.instructor}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Progression
                            </span>
                            <span className="font-semibold text-primary">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <ProgressBar
                            value={enrollment.progress}
                            showLabel={false}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {enrollment.completedLessons.length} leçon
                            {enrollment.completedLessons.length > 1 ? "s" : ""}{" "}
                            terminée
                            {enrollment.completedLessons.length > 1 ? "s" : ""}
                            {" · "}
                            {daysSince(enrollment.enrolledAt)}
                          </p>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="mt-auto"
                          data-ocid={`my_courses.continue_button.${i + 1}`}
                        >
                          <Link
                            to="/learn/$courseId/$lessonId"
                            params={{
                              courseId: enrollment.courseId,
                              lessonId: getLastLesson(
                                enrollment.completedLessons,
                              ),
                            }}
                          >
                            {enrollment.progress === 0
                              ? "Commencer"
                              : "Continuer"}
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section data-ocid="my_courses.completed.section">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-accent" />
                  Terminées
                  <Badge variant="secondary" className="ml-1">
                    {completed.length}
                  </Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {completed.map(({ enrollment, course }, i) => (
                    <article
                      key={enrollment.id}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-card flex flex-col opacity-90 hover:opacity-100 transition-smooth"
                      data-ocid={`my_courses.completed.item.${i + 1}`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {(course as { thumbnail?: string })?.thumbnail ? (
                          <img
                            src={(course as { thumbnail: string }).thumbnail}
                            alt={(course as { title: string }).title}
                            className="w-full h-full object-cover brightness-75"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="size-10 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-accent/90 p-3">
                            <CheckCircle2 className="size-7 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="font-display font-semibold text-foreground line-clamp-2">
                            {(course as { title: string }).title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {(course as { instructor?: string })?.instructor}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Award className="size-3.5 text-accent" />
                          Terminé{" "}
                          {enrollment.completedAt
                            ? daysSince(enrollment.completedAt)
                            : ""}
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            data-ocid={`my_courses.certificate_button.${i + 1}`}
                          >
                            <Link to="/certificates">
                              <Award className="size-3.5 mr-1.5" />
                              Certificat
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            data-ocid={`my_courses.review_button.${i + 1}`}
                          >
                            <Link
                              to="/learn/$courseId/$lessonId"
                              params={{
                                courseId: enrollment.courseId,
                                lessonId: "l1",
                              }}
                            >
                              Revoir
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
