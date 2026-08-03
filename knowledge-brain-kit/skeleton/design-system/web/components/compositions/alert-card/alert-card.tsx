import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { Button } from "~/components/primitives/button";

const alertCardVariants = cva(
  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
  {
    variants: {
      severity: {
        urgent: "bg-destructive/10 border-destructive/20",
        warning: "bg-warning/10 border-warning/20",
        info: "bg-info/10 border-info/20",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

const alertCardTitleVariants = cva("text-sm font-medium truncate", {
  variants: {
    severity: {
      urgent: "text-destructive",
      warning: "text-warning",
      info: "text-info",
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

const alertCardDotVariants = cva("h-2.5 w-2.5 rounded-full", {
  variants: {
    severity: {
      urgent: "bg-destructive",
      warning: "bg-warning",
      info: "bg-info",
    },
  },
  defaultVariants: {
    severity: "info",
  },
});

type AlertCardSeverity = "urgent" | "warning" | "info";

export interface AlertCardProps {
  /** Severity level of the alert */
  severity: AlertCardSeverity;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Timestamp text to display (pre-formatted) */
  timestamp?: string;
  /** Click handler */
  onClick?: () => void;
  /** Accessible label override */
  "aria-label"?: string;
  /** Optional className */
  className?: string;
}

function AlertCard({
  severity,
  title,
  description,
  timestamp,
  onClick,
  "aria-label": ariaLabel,
  className,
}: AlertCardProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        alertCardVariants({ severity }),
        "h-auto whitespace-normal hover:bg-accent/50",
        className
      )}
      aria-label={ariaLabel ?? `${severity} alert: ${title} — ${description}`}
    >
      <span className="flex items-center justify-center shrink-0" aria-hidden="true">
        <span className={cn(alertCardDotVariants({ severity }))} />
      </span>

      <div className="flex-1 min-w-0">
        <p className={cn(alertCardTitleVariants({ severity }))}>{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>

      {timestamp && (
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {timestamp}
        </span>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground shrink-0"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Button>
  );
}
AlertCard.displayName = "AlertCard";

export { AlertCard, alertCardVariants, alertCardTitleVariants, alertCardDotVariants };
