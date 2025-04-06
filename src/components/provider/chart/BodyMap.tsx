
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface BodyMapProps {
  markers: any[];
  onSelectMarker: (marker: any) => void;
  onAddMarker: (bodyPart: string, position: { x: number, y: number }) => void;
}

interface BodyPart {
  id: string;
  name: string;
  path: string;
  viewBox: string;
}

export const BodyMap: React.FC<BodyMapProps> = ({ markers, onSelectMarker, onAddMarker }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  // Define body parts with their SVG paths
  const bodyParts: BodyPart[] = [
    {
      id: "head",
      name: "Head",
      viewBox: "0 0 100 100",
      path: "M50,15 C67,15 80,30 80,50 C80,70 67,85 50,85 C33,85 20,70 20,50 C20,30 33,15 50,15 Z"
    },
    {
      id: "chest",
      name: "Chest",
      viewBox: "0 0 100 100",
      path: "M30,85 L70,85 L70,120 L30,120 Z"
    },
    {
      id: "abdomen",
      name: "Abdomen",
      viewBox: "0 0 100 100",
      path: "M30,120 L70,120 L70,155 L30,155 Z"
    },
    {
      id: "left-arm",
      name: "Left Arm",
      viewBox: "0 0 100 100",
      path: "M15,85 L30,85 L30,140 L15,155 Z"
    },
    {
      id: "right-arm",
      name: "Right Arm",
      viewBox: "0 0 100 100",
      path: "M70,85 L85,85 L85,155 L70,140 Z"
    },
    {
      id: "left-leg",
      name: "Left Leg",
      viewBox: "0 0 100 100",
      path: "M30,155 L45,155 L45,210 L30,210 Z"
    },
    {
      id: "right-leg",
      name: "Right Leg",
      viewBox: "0 0 100 100",
      path: "M55,155 L70,155 L70,210 L55,210 Z"
    },
    {
      id: "left-shoulder",
      name: "Left Shoulder",
      viewBox: "0 0 100 100",
      path: "M30,85 L15,85 L15,95 L30,95 Z"
    },
    {
      id: "right-shoulder",
      name: "Right Shoulder",
      viewBox: "0 0 100 100",
      path: "M70,85 L85,85 L85,95 L70,95 Z"
    },
    {
      id: "left-ear",
      name: "Left Ear",
      viewBox: "0 0 100 100",
      path: "M23,50 C18,40 20,30 25,25 C30,30 33,40 28,50 Z"
    },
    {
      id: "right-ear",
      name: "Right Ear",
      viewBox: "0 0 100 100",
      path: "M77,50 C82,40 80,30 75,25 C70,30 67,40 72,50 Z"
    },
    {
      id: "pelvis",
      name: "Pelvis",
      viewBox: "0 0 100 100",
      path: "M30,155 L70,155 L70,170 L30,170 Z"
    },
  ];

  // Handle clicking on a body part
  const handleBodyPartClick = (e: React.MouseEvent<SVGPathElement>, bodyPart: string) => {
    // Calculate position relative to the SVG
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    // Transform to SVG coordinates
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Add new marker
    onAddMarker(bodyPart, { x: svgPoint.x, y: svgPoint.y });
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "fill-red-500";
      case "moderate": return "fill-amber-500";
      case "low": return "fill-green-500";
      default: return "fill-blue-500";
    }
  };

  return (
    <div className="relative">
      <svg 
        viewBox="0 0 100 230" 
        className="w-full max-h-[70vh]"
        style={{ border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#FFFFFF" }}
      >
        {/* Body outline */}
        <g>
          {bodyParts.map((part) => (
            <path
              key={part.id}
              d={part.path}
              fill={hoveredPart === part.id ? "#e6f7ff" : "#f3f4f6"}
              stroke="#1f2937"
              strokeWidth="0.5"
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={(e) => handleBodyPartClick(e, part.name)}
              style={{ cursor: "pointer" }}
            />
          ))}
          
          {/* Face details */}
          <ellipse cx="40" cy="40" rx="3" ry="4" fill="#1f2937" /> {/* Left eye */}
          <ellipse cx="60" cy="40" rx="3" ry="4" fill="#1f2937" /> {/* Right eye */}
          <path d="M45,60 Q50,65 55,60" stroke="#1f2937" strokeWidth="1" fill="none" /> {/* Mouth */}
        </g>
        
        {/* Markers */}
        {markers.map((marker) => (
          <g key={marker.id} onClick={() => onSelectMarker(marker)} style={{ cursor: "pointer" }}>
            <circle
              cx={marker.position.x}
              cy={marker.position.y}
              r="4"
              className={cn(
                getSeverityColor(marker.severity),
                "stroke-white stroke-1 hover:stroke-2"
              )}
            />
          </g>
        ))}
        
        {/* Body part labels that appear on hover */}
        {hoveredPart && (
          <foreignObject x="0" y="0" width="100" height="230">
            <div 
              className="absolute bg-black/70 text-white px-2 py-1 text-xs rounded pointer-events-none"
              style={{ 
                left: `${hoveredPart === "left-arm" ? 15 : hoveredPart === "right-arm" ? 85 : 50}%`,
                top: hoveredPart === "head" ? "15%" : 
                     hoveredPart === "chest" ? "40%" :
                     hoveredPart === "abdomen" ? "50%" :
                     hoveredPart.includes("leg") ? "75%" :
                     hoveredPart.includes("ear") ? "25%" : "60%",
                transform: "translate(-50%, -50%)"
              }}
            >
              {bodyParts.find(part => part.id === hoveredPart)?.name || ""}
            </div>
          </foreignObject>
        )}
      </svg>
      
      {/* Hovered marker info */}
      {markers.map((marker, index) => (
        <div
          key={`tooltip-${marker.id}`}
          className="absolute hidden group-hover:block bg-white p-2 rounded-md shadow-lg border z-10"
          style={{
            left: `${marker.position.x}px`,
            top: `${marker.position.y}px`,
            transform: "translate(-50%, -100%)",
            maxWidth: "200px"
          }}
        >
          <div className="font-medium">{marker.bodyPart}</div>
          <div className="text-sm">{marker.diagnosis || "Undiagnosed"}</div>
          <div className="text-xs text-muted-foreground">
            Severity: {marker.severity}
          </div>
        </div>
      ))}
    </div>
  );
};
