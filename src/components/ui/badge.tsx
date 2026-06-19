import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const variants = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  neutral: "bg-card text-text-secondary border-border",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
