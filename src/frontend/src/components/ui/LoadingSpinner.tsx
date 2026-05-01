import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-border border-t-primary animate-spin",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Chargement..."
    />
  );
}

export default LoadingSpinner;
