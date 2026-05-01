import { Layout } from "@/components/Layout";
import { ProgressBar } from "@/components/ProgressBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/constants";
import {
  useEnroll,
  useGetCourse,
  useGetCourseLessons,
  useGetEnrollment,
} from "@/lib/queries";
import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const LEARNING_OUTCOMES = [
  "Maîtriser les concepts fondamentaux et les meilleures pratiques",
  "Appliquer les techniques dans des contextes professionnels réels",
  "Développer une approche structurée et méthodique",
  "Collaborer efficacement au sein d'équipes multidisciplinaires",
  "Utiliser les outils et frameworks les plus utilisés dans le secteur",
  "Obtenir une certification reconnue par les professionnels",
];

const INSTRUCTOR_BIOS: Record<
  string,
  { bio: string; courses: number; students: number; rating: number }
> = {
  "Dr. Amina Benali": {
    bio: "Docteure en management de projet avec 15 ans d'expérience dans de grandes entreprises. Certifiée PMP et coach Agile, elle accompagne des équipes internationales depuis 2010.",
    courses: 7,
    students: 8400,
    rating: 4.9,
  },
  "Marc Dupont": {
    bio: "Data scientist sénior chez un groupe pharmaceutique, Marc partage sa passion pour les données à travers des contenus pédagogiques clairs et accessibles.",
    courses: 4,
    students: 12000,
    rating: 4.7,
  },
  "Sophie Laurent": {
    bio: "Executive coach et formatrice en leadership, Sophie a accompagné plus de 500 dirigeants dans leur transformation personnelle et professionnelle.",
    courses: 5,
    students: 9200,
    rating: 4.9,
  },
  "Karim Mansouri": {
    bio: "Consultant en stratégie digitale et fondateur d'une agence de marketing, Karim transmet son expertise avec pragmatisme et exemples concrets.",
    courses: 3,
    students: 4100,
    rating: 4.6,
  },
  "Léa Moreau": {
    bio: "Designer UX senior avec 10 ans d'expérience dans des startups et grands comptes. Passionnée de design thinking et d'accessibilité numérique.",
    courses: 6,
    students: 6800,
    rating: 4.8,
  },
  "Dr. Thomas Chen": {
    bio: "Chercheur en IA et consultant pour des organisations Fortune 500, Thomas rend l'intelligence artificielle compréhensible pour les décideurs non-techniques.",
    courses: 3,
    students: 7500,
    rating: 4.7,
  },
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: "/courses/$courseId" });
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourse(courseId);
  const { data: enrollment } = useGetEnrollment(courseId);
  const { data: lessons = [] } = useGetCourseLessons(courseId);
  const enroll = useEnroll();

  const handleEnroll = async () => {
    try {
      await enroll.mutateAsync(courseId);
      toast.success("Inscription réussie !");
      navigate({
        to: "/learn/$courseId/$lessonId",
        params: { courseId, lessonId: "l1" },
      });
    } catch {
      toast.error("Erreur lors de l'inscription.");
    }
  };

  if (isLoading)
    return (
      <Layout>
        <div
          className="flex justify-center py-24"
          data-ocid="course_detail.loading_state"
        >
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );

  if (!course)
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="font-display text-2xl font-bold mb-2">
            Formation introuvable
          </h2>
          <Button asChild variant="link">
            <Link to="/catalog">Retour au catalogue</Link>
          </Button>
        </div>
      </Layout>
    );

  const instructorInfo = INSTRUCTOR_BIOS[course.instructor];

  return (
    <Layout>
      <div data-ocid="course_detail.page">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: "/catalog" })}
          data-ocid="course_detail.back_button"
        >
          <ArrowLeft className="size-4 mr-2" />
          Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{course.category}</Badge>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    DIFFICULTY_COLORS[course.difficulty as Difficulty],
                  )}
                >
                  {DIFFICULTY_LABELS[course.difficulty as Difficulty]}
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl lg:text-4xl text-foreground leading-tight">
                {course.title}
              </h1>

              <p className="text-muted-foreground text-base leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">
                    {course.rating.toFixed(1)}
                  </span>
                  <span>({course.ratingCount.toLocaleString()} avis)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {course.enrollmentCount.toLocaleString()} inscrits
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {Math.floor(course.duration / 60)}h de contenu
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-4" />
                  {course.lessonCount} leçons
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="rounded-xl overflow-hidden border border-border aspect-video shadow-card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/placeholder.svg";
                }}
              />
            </div>

            {/* Progress banner (if enrolled) */}
            {enrollment && (
              <div
                className="bg-card border border-border rounded-xl p-5"
                data-ocid="course_detail.progress_section"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">
                    Votre progression
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {enrollment.progress}%
                  </span>
                </div>
                <ProgressBar
                  value={enrollment.progress}
                  showLabel={false}
                  className="h-2.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {enrollment.completedLessons.length} leçon
                  {enrollment.completedLessons.length !== 1 ? "s" : ""} terminée
                  {enrollment.completedLessons.length !== 1 ? "s" : ""} sur{" "}
                  {course.lessonCount}
                </p>
              </div>
            )}

            {/* Learning outcomes */}
            <div data-ocid="course_detail.outcomes_section">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                Ce que vous allez apprendre
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEARNING_OUTCOMES.map((outcome, i) => (
                  <div
                    key={outcome}
                    className="flex items-start gap-2.5"
                    data-ocid={`course_detail.outcome.${i + 1}`}
                  >
                    <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Curriculum */}
            <div data-ocid="course_detail.curriculum_section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-foreground">
                  Programme de la formation
                </h2>
                <span className="text-sm text-muted-foreground">
                  {course.lessonCount} leçons ·{" "}
                  {Math.floor(course.duration / 60)}h au total
                </span>
              </div>
              <div className="space-y-2">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-card transition-smooth"
                    data-ocid={`course_detail.lesson.${i + 1}`}
                  >
                    <div
                      className={cn(
                        "size-7 rounded-full flex items-center justify-center shrink-0",
                        enrollment?.completedLessons.includes(lesson.id)
                          ? "bg-primary/10"
                          : "bg-muted",
                      )}
                    >
                      {enrollment?.completedLessons.includes(lesson.id) ? (
                        <CheckCircle className="size-4 text-primary" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "flex-1 text-sm min-w-0",
                        enrollment?.completedLessons.includes(lesson.id)
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}
                    >
                      {lesson.title}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Instructor bio */}
            {instructorInfo && (
              <div data-ocid="course_detail.instructor_section">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  Votre formateur
                </h2>
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16 shrink-0">
                      <AvatarImage
                        src={course.instructorAvatar}
                        alt={course.instructor}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(course.instructor)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {course.instructor}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {instructorInfo.bio}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5 fill-accent text-accent" />
                          <span className="font-semibold text-foreground">
                            {instructorInfo.rating.toFixed(1)}
                          </span>
                          de note
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {instructorInfo.students.toLocaleString()} apprenants
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="size-3.5" />
                          {instructorInfo.courses} formations
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-xl shadow-elevated overflow-hidden">
              <div className="aspect-video">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
              </div>

              <div className="p-5 space-y-4">
                <div className="text-center">
                  <span className="font-display font-bold text-3xl text-foreground">
                    {course.price === 0 ? "Gratuit" : `${course.price}€`}
                  </span>
                </div>

                {enrollment ? (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Progression
                        </span>
                        <span className="font-bold text-primary">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <ProgressBar
                        value={enrollment.progress}
                        showLabel={false}
                        className="h-2"
                      />
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      data-ocid="course_detail.continue_button"
                    >
                      <Link
                        to="/learn/$courseId/$lessonId"
                        params={{ courseId, lessonId: "l1" }}
                      >
                        Continuer l'apprentissage
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    onClick={handleEnroll}
                    disabled={enroll.isPending}
                    data-ocid="course_detail.enroll_button"
                  >
                    {enroll.isPending
                      ? "Inscription en cours…"
                      : "S'inscrire gratuitement"}
                  </Button>
                )}

                <Separator />

                <div className="space-y-2.5">
                  {[
                    {
                      icon: Clock,
                      label: `${Math.floor(course.duration / 60)}h de contenu vidéo`,
                    },
                    {
                      icon: BookOpen,
                      label: `${course.lessonCount} leçons structurées`,
                    },
                    { icon: TrendingUp, label: "Accès illimité à vie" },
                    { icon: Award, label: "Certificat de réussite" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <Icon className="size-4 text-primary shrink-0" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
