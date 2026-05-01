import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
      data-ocid="empty_state"
    >
      {Icon && (
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="size-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid="empty_state.action_button"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
