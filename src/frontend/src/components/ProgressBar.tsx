import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  label?: string;
  className?: string;
  variant?: "primary" | "accent" | "success";
}

const variantClasses = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-primary",
};

export function ProgressBar({
  value,
  showLabel = true,
  label,
  className,
  variant = "primary",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
          <span className="text-xs font-semibold text-foreground ml-auto">
            {clamped}%
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full overflow-hidden h-2">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant],
          )}
          style={{ width: `${clamped}%` }}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
