
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noAnimation?: boolean;
  variant?: "default" | "elevated" | "subtle";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = true, noAnimation = false, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6 backdrop-blur-md border border-border/30",
          variant === "default" && "bg-white/70 dark:bg-black/20",
          variant === "elevated" && "bg-white/80 dark:bg-black/30 shadow-lg",
          variant === "subtle" && "bg-white/50 dark:bg-black/10",
          hoverEffect && "hover:translate-y-[-2px] hover:shadow-lg",
          !noAnimation && "animate-fade-in",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
