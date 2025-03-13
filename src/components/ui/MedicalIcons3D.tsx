
import React from "react";

type MedicalIcon3DProps = {
  type: "stethoscope" | "pill" | "heart" | "brain" | "doctor" | "patient" | "monitor";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "muted";
  animate?: boolean;
  className?: string;
};

export const MedicalIcon3D: React.FC<MedicalIcon3DProps> = ({
  type,
  size = "md",
  color = "primary",
  animate = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    muted: "text-muted-foreground",
  };

  const renderIcon = () => {
    switch (type) {
      case "stethoscope":
        return (
          <div className="relative">
            {/* Stethoscope head */}
            <div className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1/3 h-1/3 rounded-full bg-${color} shadow-lg`}></div>
            
            {/* Stethoscope tube */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 w-1/6 h-1/2 bg-${color}/80 rounded-full`}></div>
            
            {/* Stethoscope earpieces */}
            <div className="absolute top-0 w-full h-1/4 flex justify-between">
              <div className={`w-1/4 h-full rounded-full bg-${color}/90 shadow-md transform ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.1s" }}></div>
              <div className={`w-1/4 h-full rounded-full bg-${color}/90 shadow-md transform ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.3s" }}></div>
            </div>
            
            {/* Connecting piece */}
            <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/6 bg-${color}/80 rounded-full`}></div>
          </div>
        );
      
      case "heart":
        return (
          <div className="relative">
            <div className={`w-full h-full bg-${color}/20 rounded-full`}></div>
            
            {/* Heart shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-3/4 h-3/4 relative ${animate ? 'animate-pulse' : ''}`} style={{ animationDuration: "2s" }}>
                <div className={`absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full bg-${color}/60 shadow-md`}></div>
                <div className={`absolute top-0 right-1/4 w-1/2 h-1/2 rounded-full bg-${color}/60 shadow-md`}></div>
                <div className={`absolute bottom-0 w-full h-1/2 bg-${color}/60 rounded-b-lg transform rotate-45 origin-top`}></div>
              </div>
            </div>
          </div>
        );
      
      case "pill":
        return (
          <div className="relative">
            <div className={`w-full h-1/2 bg-${color}/50 rounded-full transform rotate-45 shadow-md ${animate ? 'floating' : ''}`}></div>
            
            {/* Pill divider */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[2px] h-[70%] bg-white/80 rotate-45`}></div>
          </div>
        );
      
      case "brain":
        return (
          <div className="relative">
            <div className={`w-full h-full rounded-t-full bg-${color}/20`}></div>
            
            {/* Brain folds */}
            <div className="absolute inset-[10%] rounded-t-full">
              <div className={`absolute top-1/4 left-0 w-1/3 h-1/4 rounded-full bg-${color}/50 ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.1s" }}></div>
              <div className={`absolute top-1/4 right-0 w-1/3 h-1/4 rounded-full bg-${color}/50 ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.3s" }}></div>
              <div className={`absolute top-1/2 left-1/6 w-1/3 h-1/4 rounded-full bg-${color}/50 ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.5s" }}></div>
              <div className={`absolute top-1/2 right-1/6 w-1/3 h-1/4 rounded-full bg-${color}/50 ${animate ? 'floating-fast' : ''}`} style={{ animationDelay: "0.7s" }}></div>
            </div>
          </div>
        );
      
      case "doctor":
        return (
          <div className="relative">
            {/* Head */}
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 rounded-full bg-${color}/70 shadow-md`}></div>
            
            {/* Body */}
            <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-${color}/50 rounded-md`}></div>
            
            {/* Stethoscope */}
            <div className={`absolute top-1/3 left-1/4 w-1/6 h-1/6 rounded-full bg-secondary/70 shadow-sm ${animate ? 'floating-slow' : ''}`}></div>
            
            {/* Arms */}
            <div className="absolute top-1/3 w-full flex justify-between">
              <div className={`w-1/6 h-1/3 bg-${color}/40 rounded-full transform rotate-12 origin-top ${animate ? 'floating-slow' : ''}`} style={{ animationDelay: "0.2s" }}></div>
              <div className={`w-1/6 h-1/3 bg-${color}/40 rounded-full transform -rotate-12 origin-top ${animate ? 'floating-slow' : ''}`} style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        );
      
      case "monitor":
        return (
          <div className="relative">
            {/* Monitor */}
            <div className={`w-full h-3/4 bg-${color}/20 rounded-md shadow-md`}></div>
            
            {/* Screen */}
            <div className="absolute inset-[10%] h-1/2 bg-white/30 rounded-sm">
              {/* Heartbeat line */}
              <div className={`absolute top-1/2 left-0 w-full h-[2px] bg-secondary/70 ${animate ? '' : ''}`}>
                <div className={`absolute top-0 left-1/4 w-1/6 h-[10px] border-[2px] border-secondary/70 border-b-0 rounded-t-full transform -translate-y-full ${animate ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
            
            {/* Stand */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/6 h-1/4 bg-${color}/40 rounded-md`}></div>
          </div>
        );
        
      case "patient":
        return (
          <div className="relative">
            {/* Head */}
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 rounded-full bg-${color}/70 shadow-md`}></div>
            
            {/* Body */}
            <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2 bg-${color}/50 rounded-md`}></div>
            
            {/* Arms */}
            <div className="absolute top-1/3 w-full flex justify-between">
              <div className={`w-1/6 h-1/3 bg-${color}/40 rounded-full transform rotate-45 origin-top ${animate ? 'floating-slow' : ''}`} style={{ animationDelay: "0.2s" }}></div>
              <div className={`w-1/6 h-1/3 bg-${color}/40 rounded-full transform -rotate-45 origin-top ${animate ? 'floating-slow' : ''}`} style={{ animationDelay: "0.4s" }}></div>
            </div>
            
            {/* Medical symbols */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 rounded-full border-2 border-white/60 flex items-center justify-center ${animate ? 'pulse-dot' : ''}`}>
              <div className="w-3/4 h-[2px] bg-white/60"></div>
              <div className="absolute w-[2px] h-3/4 bg-white/60"></div>
            </div>
          </div>
        );

      default:
        return <div className={`w-full h-full rounded-full bg-${color}/20`}></div>;
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} relative ${className}`}>
      {renderIcon()}
    </div>
  );
};
