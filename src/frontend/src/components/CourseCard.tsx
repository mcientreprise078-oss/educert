import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  lessonCount: number;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  progress?: number;
  enrolled?: boolean;
  index?: number;
  onEnroll?: (id: string) => void;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function CourseCard({
  id,
  title,
  description,
  instructor,
  thumbnail,
  category,
  difficulty,
  duration,
  lessonCount,
  enrollmentCount,
  rating,
  ratingCount,
  progress,
  enrolled,
  index = 0,
  onEnroll,
}: CourseCardProps) {
  const isEnrolled = enrolled || (progress !== undefined && progress > 0);

  return (
    <article
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
      data-ocid={`course_card.item.${index + 1}`}
    >
      {/* Thumbnail */}
      <Link
        to="/courses/$courseId"
        params={{ courseId: id }}
        className="block overflow-hidden relative aspect-video"
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              DIFFICULTY_COLORS[difficulty],
            )}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </span>
        </div>
        {isEnrolled && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar
              value={progress}
              showLabel={false}
              className="h-1 rounded-none"
            />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-xs font-normal">
            {category}
          </Badge>
        </div>

        <Link to="/courses/$courseId" params={{ courseId: id }}>
          <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        <p className="text-sm text-muted-foreground">
          par <span className="font-medium text-foreground">{instructor}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-accent text-accent" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
            <span>({ratingCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(duration)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {lessonCount} leçons
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Users className="size-3.5" />
            {enrollmentCount.toLocaleString()}
          </span>
        </div>

        {/* Progress or CTA */}
        {isEnrolled && progress !== undefined ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <ProgressBar value={progress} showLabel={false} className="h-2" />
            <Button
              asChild
              size="sm"
              className="w-full mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid={`course_card.continue_button.${index + 1}`}
            >
              <Link to="/courses/$courseId" params={{ courseId: id }}>
                Continuer
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full mt-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => onEnroll?.(id)}
            data-ocid={`course_card.enroll_button.${index + 1}`}
          >
            S'inscrire gratuitement
          </Button>
        )}
      </div>
    </article>
  );
}

export default CourseCard;
