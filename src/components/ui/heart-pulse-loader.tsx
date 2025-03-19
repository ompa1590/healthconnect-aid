
import React from "react";
import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react";

interface HeartPulseLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function HeartPulseLoader({
  size = "md",
  color = "text-primary",
  className,
  ...props
}: HeartPulseLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="animate-pulse">
        <HeartPulse className={cn(sizeClasses[size], color, "animate-pulse")} />
      </div>
    </div>
  );
}

export function AppointmentSkeleton() {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
        <div className="h-9 w-28 bg-muted rounded"></div>
      </div>
      <div className="flex gap-6 mt-3">
        <div className="h-4 w-32 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
      </div>
    </div>
  );
}
