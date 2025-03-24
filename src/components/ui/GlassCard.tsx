
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noAnimation?: boolean;
  variant?: "default" | "elevated" | "subtle" | "gradient" | "colored" | "accent";
  borderEffect?: boolean;
  glowEffect?: boolean;
  accentColor?: string;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    children, 
    className, 
    hoverEffect = true, 
    noAnimation = false, 
    variant = "default", 
    borderEffect = false,
    glowEffect = false,
    accentColor,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6 backdrop-blur-md border border-border/30 transition-all duration-300 relative overflow-hidden",
          variant === "default" && "bg-white/70 dark:bg-black/20",
          variant === "elevated" && "bg-white/80 dark:bg-black/30 shadow-md",
          variant === "subtle" && "bg-white/50 dark:bg-black/10",
          variant === "gradient" && "bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-black/20 dark:via-black/15 dark:to-black/10",
          variant === "colored" && "bg-gradient-to-br from-health-50/80 to-health-100/40",
          variant === "accent" && "bg-gradient-to-br from-primary/10 to-primary/5",
          hoverEffect && "hover:translate-y-[-2px] hover:shadow-lg",
          borderEffect && "hover:border-primary/50",
          glowEffect && "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-primary/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none",
          !noAnimation && "animate-fade-in",
          className
        )}
        style={accentColor ? {
          '--card-accent-color': accentColor,
          borderColor: `color-mix(in srgb, var(--card-accent-color) 30%, transparent)`,
        } as React.CSSProperties : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
