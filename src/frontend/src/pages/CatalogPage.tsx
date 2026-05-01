import { CourseCard } from "@/components/CourseCard";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, DIFFICULTY_LABELS } from "@/lib/constants";
import {
  useEnroll,
  useGetCourses,
  useGetEnrollments,
  useListExternalCourses,
  useTrackExternalCourseView,
} from "@/lib/queries";
import type { Difficulty, ExternalCourse } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ALL_CATEGORY = "Tous";
const ALL_DIFFICULTY = "all";

const DIFFICULTIES: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "Tous niveaux" },
  { value: "beginner", label: DIFFICULTY_LABELS.beginner },
  { value: "intermediate", label: DIFFICULTY_LABELS.intermediate },
  { value: "advanced", label: DIFFICULTY_LABELS.advanced },
];

// ---- Platform badge config ----
const PLATFORM_CONFIG: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  YouTube: {
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
  },
  Coursera: {
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
  },
  Udemy: {
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
  },
  OpenClassrooms: {
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800",
  },
  Autre: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
};

function getPlatformConfig(platform: string) {
  return PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.Autre;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

// ---- External Course Detail Modal ----
interface ExternalCourseModalProps {
  course: ExternalCourse | null;
  onClose: () => void;
}

function ExternalCourseDetailModal({
  course,
  onClose,
}: ExternalCourseModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!course) return null;

  const ytId = extractYouTubeId(course.url);
  const cfg = getPlatformConfig(course.platform);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="external_course.dialog"
    >
      <dialog
        open
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 m-0"
        aria-label={`Cours externe : ${course.title}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}
            >
              {course.platform}
            </span>
            <p className="text-xs text-muted-foreground font-medium shrink-0">
              Cours externe
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Fermer"
            data-ocid="external_course.close_button"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground leading-snug">
            {course.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {course.description}
          </p>

          {/* YouTube embed */}
          {ytId ? (
            <div className="rounded-xl overflow-hidden aspect-video bg-muted border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-muted/60 border border-border p-6 flex flex-col items-center gap-3 text-center">
              <ExternalLink className="size-8 text-primary/60" />
              <p className="text-sm text-muted-foreground">
                Ce cours est hébergé sur{" "}
                <span className={`font-semibold ${cfg.color}`}>
                  {course.platform}
                </span>
              </p>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                data-ocid="external_course.open_link_button"
              >
                <ExternalLink className="size-4" />
                Ouvrir sur {course.platform}
              </a>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2">
            {ytId && (
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                data-ocid="external_course.open_link_button"
              >
                <ExternalLink className="size-4" />
                Ouvrir sur {course.platform}
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="ml-auto"
              data-ocid="external_course.cancel_button"
            >
              Fermer
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

// ---- External Course Card ----
interface ExternalCourseCardProps {
  course: ExternalCourse;
  index: number;
  onOpen: (course: ExternalCourse) => void;
  onAccess: (course: ExternalCourse) => void;
}

function ExternalCourseCard({
  course,
  index,
  onOpen,
  onAccess,
}: ExternalCourseCardProps) {
  const ytId = extractYouTubeId(course.url);
  const thumbnail =
    course.thumbnailUrl ??
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
  const cfg = getPlatformConfig(course.platform);

  return (
    <div
      className="group bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 w-[280px] shrink-0"
      data-ocid={`external_course.item.${index + 1}`}
    >
      {/* Thumbnail / placeholder */}
      <button
        type="button"
        className="relative h-36 bg-muted overflow-hidden w-full text-left"
        onClick={() => onOpen(course)}
        aria-label={`Voir le cours : ${course.title}`}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ExternalLink className="size-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Play overlay for YouTube */}
        {ytId && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/20">
            <div className="rounded-full bg-card/90 p-3 shadow-lg">
              <Play className="size-6 text-foreground fill-foreground" />
            </div>
          </div>
        )}
        {/* Platform badge overlay */}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
        >
          {course.platform}
        </span>
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        <button
          type="button"
          className="font-semibold text-sm text-foreground line-clamp-2 leading-snug text-left hover:text-primary transition-colors"
          onClick={() => onOpen(course)}
        >
          {course.title}
        </button>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-1 h-8 text-xs font-semibold gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          onClick={() => onAccess(course)}
          data-ocid={`external_course.access_button.${index + 1}`}
        >
          <ExternalLink className="size-3.5" />
          Accéder au cours
        </Button>
      </div>
    </div>
  );
}

// ---- External Courses Section ----
function ExternalCoursesSection() {
  const { data: externalCourses, isLoading } = useListExternalCourses();
  const trackView = useTrackExternalCourseView();
  const [selectedCourse, setSelectedCourse] = useState<ExternalCourse | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = useCallback(
    (course: ExternalCourse) => {
      setSelectedCourse(course);
      trackView.mutate(course.id);
    },
    [trackView],
  );

  const handleCloseModal = useCallback(() => setSelectedCourse(null), []);

  const handleAccess = useCallback(
    (course: ExternalCourse) => {
      trackView.mutate(course.id);
      window.open(course.url, "_blank", "noopener,noreferrer");
    },
    [trackView],
  );

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (!isLoading && (!externalCourses || externalCourses.length === 0))
    return null;

  return (
    <>
      <section className="space-y-4 pt-4" data-ocid="external_courses.section">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-display font-bold text-xl text-foreground">
              Cours provenant d'autres plateformes
            </h2>
            <p className="text-sm text-muted-foreground">
              Ressources sélectionnées par l'équipe EDUCERT depuis des
              plateformes partenaires
            </p>
          </div>
          {/* Scroll controls */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Défiler vers la gauche"
              data-ocid="external_courses.scroll_left_button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Défiler vers la droite"
              data-ocid="external_courses.scroll_right_button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3"
          data-ocid="external_courses.list"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                  key={i}
                  className="w-[280px] shrink-0 h-[260px] rounded-xl bg-muted animate-pulse"
                  data-ocid="external_courses.loading_state"
                />
              ))
            : externalCourses?.map((course, i) => (
                <ExternalCourseCard
                  key={course.id}
                  course={course}
                  index={i}
                  onOpen={handleOpenModal}
                  onAccess={handleAccess}
                />
              ))}
        </div>
      </section>

      {/* Modal */}
      <ExternalCourseDetailModal
        course={selectedCourse}
        onClose={handleCloseModal}
      />
    </>
  );
}

// ---- Main Catalog Page ----
export default function CatalogPage() {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "all">(
    ALL_DIFFICULTY,
  );
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 350);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: courses, isLoading } = useGetCourses({
    search: search || undefined,
    category: activeCategory !== ALL_CATEGORY ? activeCategory : undefined,
    difficulty:
      activeDifficulty !== ALL_DIFFICULTY ? activeDifficulty : undefined,
  });

  const { data: enrollments } = useGetEnrollments();
  const enroll = useEnroll();

  const enrollmentMap = new Map(enrollments?.map((e) => [e.courseId, e]));

  const handleEnroll = async (courseId: string) => {
    try {
      await enroll.mutateAsync(courseId);
      toast.success("Inscription réussie !");
      navigate({ to: "/courses/$courseId", params: { courseId } });
    } catch {
      toast.error("Erreur lors de l'inscription.");
    }
  };

  const hasActiveFilters =
    activeCategory !== ALL_CATEGORY ||
    activeDifficulty !== ALL_DIFFICULTY ||
    search !== "";

  const resetFilters = () => {
    setInputValue("");
    setSearch("");
    setActiveCategory(ALL_CATEGORY);
    setActiveDifficulty(ALL_DIFFICULTY);
  };

  return (
    <Layout>
      <div className="space-y-8" data-ocid="catalog.page">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-foreground">
            Catalogue de formations
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez nos formations professionnelles et développez vos
            compétences
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher une formation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 pr-10 h-11 text-base"
            data-ocid="catalog.search_input"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer la recherche"
              data-ocid="catalog.search_clear_button"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-3">
          {/* Category tabs */}
          <div
            className="flex items-center gap-1.5 flex-wrap"
            data-ocid="catalog.categories"
          >
            {[ALL_CATEGORY, ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`catalog.category_${cat.toLowerCase().replace(/[\s&/]+/g, "_")}_tab`}
              >
                <Badge
                  variant={activeCategory === cat ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-smooth text-xs py-1 px-3 whitespace-nowrap"
                >
                  {cat}
                </Badge>
              </button>
            ))}
          </div>

          {/* Difficulty chips */}
          <div
            className="flex items-center gap-1.5 flex-wrap"
            data-ocid="catalog.difficulty_filters"
          >
            {DIFFICULTIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveDifficulty(value)}
                data-ocid={`catalog.difficulty_${value}_tab`}
                className={[
                  "text-xs font-medium px-3 py-1 rounded-full border transition-smooth",
                  activeDifficulty === value
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground bg-transparent",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary + reset */}
        {!isLoading && (
          <div className="flex items-center justify-between min-h-[1.5rem]">
            <p className="text-sm text-muted-foreground">
              {courses?.length ?? 0} formation
              {(courses?.length ?? 0) !== 1 ? "s" : ""} trouvée
              {(courses?.length ?? 0) !== 1 ? "s" : ""}
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground h-7 gap-1"
                data-ocid="catalog.reset_filters_button"
              >
                <X className="size-3.5" />
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        )}

        {/* EDUCERT Courses Results */}
        {isLoading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="catalog.loading_state"
          >
            <LoadingSpinner size="lg" />
          </div>
        ) : !courses?.length ? (
          <div data-ocid="catalog.empty_state">
            <EmptyState
              title="Aucune formation trouvée"
              description="Essayez de modifier vos critères de recherche ou explorez d'autres catégories."
              action={{
                label: "Réinitialiser les filtres",
                onClick: resetFilters,
              }}
            />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="catalog.courses_list"
          >
            {courses.map((course, i) => {
              const enrollment = enrollmentMap.get(course.id);
              return (
                <CourseCard
                  key={course.id}
                  {...course}
                  difficulty={course.difficulty as Difficulty}
                  progress={enrollment?.progress}
                  enrolled={!!enrollment}
                  index={i}
                  onEnroll={handleEnroll}
                />
              );
            })}
          </div>
        )}

        {/* Divider before external courses */}
        <div className="border-t border-border/60" />

        {/* External Courses Section */}
        <ExternalCoursesSection />
      </div>
    </Layout>
  );
}
