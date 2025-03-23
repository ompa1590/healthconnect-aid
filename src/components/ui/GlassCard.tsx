
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noAnimation?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = true, noAnimation = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6 backdrop-blur-sm border border-border/30 bg-white/70 dark:bg-black/20",
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
