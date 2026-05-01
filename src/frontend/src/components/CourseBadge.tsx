import { cn } from "@/lib/utils";
import { Award, BookOpen, Star, Zap } from "lucide-react";

type BadgeType = "completion" | "excellence" | "speed" | "explorer";

interface CourseBadgeProps {
  type: BadgeType;
  label: string;
  size?: "sm" | "md" | "lg";
}

const badgeConfig: Record<
  BadgeType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  completion: { icon: Award, color: "text-accent", bg: "bg-accent/10" },
  excellence: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  speed: { icon: Zap, color: "text-primary", bg: "bg-primary/10" },
  explorer: {
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
};

const sizeClasses = {
  sm: { wrapper: "p-1.5", icon: "size-4", text: "text-xs" },
  md: { wrapper: "p-2", icon: "size-5", text: "text-sm" },
  lg: { wrapper: "p-3", icon: "size-6", text: "text-sm" },
};

export function CourseBadge({ type, label, size = "md" }: CourseBadgeProps) {
  const config = badgeConfig[type];
  const sizes = sizeClasses[size];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("rounded-full", config.bg, sizes.wrapper)}>
        <Icon className={cn(config.color, sizes.icon)} />
      </div>
      <span
        className={cn(
          "text-muted-foreground font-medium text-center",
          sizes.text,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default CourseBadge;
