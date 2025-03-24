
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noAnimation?: boolean;
  variant?: "default" | "elevated" | "subtle" | "gradient";
  borderEffect?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    children, 
    className, 
    hoverEffect = true, 
    noAnimation = false, 
    variant = "default", 
    borderEffect = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6 backdrop-blur-md border border-border/30 transition-all duration-300",
          variant === "default" && "bg-white/70 dark:bg-black/20",
          variant === "elevated" && "bg-white/80 dark:bg-black/30 shadow-md",
          variant === "subtle" && "bg-white/50 dark:bg-black/10",
          variant === "gradient" && "bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-black/20 dark:via-black/15 dark:to-black/10",
          hoverEffect && "hover:translate-y-[-2px] hover:shadow-lg",
          borderEffect && "hover:border-primary/50",
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
