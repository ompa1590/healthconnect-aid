
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BodyMapProps {
  markers: any[];
  onSelectMarker: (marker: any) => void;
  onAddMarker: (bodyPart: string, position: { x: number, y: number }, view: string) => void;
}

interface BodyPart {
  id: string;
  name: string;
  path: string;
  viewBox: string;
  view: string;
}

export const BodyMap: React.FC<BodyMapProps> = ({ markers, onSelectMarker, onAddMarker }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [realisticBodySvg, setRealisticBodySvg] = useState<{front: string | null, back: string | null, side: string | null}>({
    front: null,
    back: null,
    side: null
  });
  const [isLoading, setIsLoading] = useState({front: true, back: true, side: true});
  const [activeView, setActiveView] = useState<"front" | "back" | "side">("front");
  
  // Define body parts with their SVG paths (used as fallback and for interactions)
  const getFrontBodyParts = (): BodyPart[] => [
    {
      id: "head",
      name: "Head",
      viewBox: "0 0 100 100",
      path: "M50,15 C67,15 80,30 80,50 C80,70 67,85 50,85 C33,85 20,70 20,50 C20,30 33,15 50,15 Z",
      view: "front"
    },
    {
      id: "chest",
      name: "Chest",
      viewBox: "0 0 100 100",
      path: "M30,85 L70,85 L70,120 L30,120 Z",
      view: "front"
    },
    {
      id: "abdomen",
      name: "Abdomen",
      viewBox: "0 0 100 100",
      path: "M30,120 L70,120 L70,155 L30,155 Z",
      view: "front"
    },
    {
      id: "left-arm",
      name: "Left Arm",
      viewBox: "0 0 100 100",
      path: "M15,85 L30,85 L30,140 L15,155 Z",
      view: "front"
    },
    {
      id: "right-arm",
      name: "Right Arm",
      viewBox: "0 0 100 100",
      path: "M70,85 L85,85 L85,155 L70,140 Z",
      view: "front"
    },
    {
      id: "left-leg",
      name: "Left Leg",
      viewBox: "0 0 100 100",
      path: "M30,155 L45,155 L45,210 L30,210 Z",
      view: "front"
    },
    {
      id: "right-leg",
      name: "Right Leg",
      viewBox: "0 0 100 100",
      path: "M55,155 L70,155 L70,210 L55,210 Z",
      view: "front"
    }
  ];
  
  const getBackBodyParts = (): BodyPart[] => [
    {
      id: "head-back",
      name: "Head (back)",
      viewBox: "0 0 100 100",
      path: "M50,15 C67,15 80,30 80,50 C80,70 67,85 50,85 C33,85 20,70 20,50 C20,30 33,15 50,15 Z",
      view: "back"
    },
    {
      id: "upper-back",
      name: "Upper Back",
      viewBox: "0 0 100 100",
      path: "M30,85 L70,85 L70,120 L30,120 Z",
      view: "back"
    },
    {
      id: "lower-back",
      name: "Lower Back",
      viewBox: "0 0 100 100",
      path: "M30,120 L70,120 L70,155 L30,155 Z",
      view: "back"
    },
    {
      id: "left-arm-back",
      name: "Left Arm (back)",
      viewBox: "0 0 100 100",
      path: "M15,85 L30,85 L30,140 L15,155 Z",
      view: "back"
    },
    {
      id: "right-arm-back",
      name: "Right Arm (back)",
      viewBox: "0 0 100 100",
      path: "M70,85 L85,85 L85,155 L70,140 Z",
      view: "back"
    },
    {
      id: "left-leg-back",
      name: "Left Leg (back)",
      viewBox: "0 0 100 100",
      path: "M30,155 L45,155 L45,210 L30,210 Z",
      view: "back"
    },
    {
      id: "right-leg-back",
      name: "Right Leg (back)",
      viewBox: "0 0 100 100",
      path: "M55,155 L70,155 L70,210 L55,210 Z",
      view: "back"
    }
  ];
  
  const getSideBodyParts = (): BodyPart[] => [
    {
      id: "head-side",
      name: "Head (side)",
      viewBox: "0 0 100 100",
      path: "M60,15 C77,15 85,30 85,50 C85,70 77,85 60,85 C50,85 45,70 45,50 C45,30 50,15 60,15 Z",
      view: "side"
    },
    {
      id: "torso-side",
      name: "Torso (side)",
      viewBox: "0 0 100 100",
      path: "M45,85 L75,85 L75,155 L45,155 Z",
      view: "side"
    },
    {
      id: "leg-side",
      name: "Leg (side)",
      viewBox: "0 0 100 100",
      path: "M45,155 L75,155 L75,210 L45,210 Z",
      view: "side"
    }
  ];

  const getBodyParts = (): BodyPart[] => {
    switch (activeView) {
      case "front": return getFrontBodyParts();
      case "back": return getBackBodyParts();
      case "side": return getSideBodyParts();
      default: return getFrontBodyParts();
    }
  };

  // Generate realistic body map based on markers
  useEffect(() => {
    const fetchRealisticBody = async (view: "front" | "back" | "side") => {
      setIsLoading(prev => ({...prev, [view]: true}));
      try {
        // Extract diagnoses from markers
        const diagnoses = markers
          .filter(marker => marker.diagnosis)
          .map(marker => `${marker.bodyPart}: ${marker.diagnosis}`);
        
        // Generate the realistic body svg
       
      } catch (error) {
        console.error(`Error generating realistic body map for ${view} view:`, error);
        setRealisticBodySvg(prev => ({...prev, [view]: null}));
      } finally {
        setIsLoading(prev => ({...prev, [view]: false}));
      }
    };

    // Only fetch if we have at least one marker with a diagnosis
    if (markers.some(marker => marker.diagnosis)) {
      fetchRealisticBody(activeView);
    } else {
      setRealisticBodySvg(prev => ({...prev, [activeView]: null}));
      setIsLoading(prev => ({...prev, [activeView]: false}));
    }
  }, [markers.filter(marker => marker.diagnosis).length > 0, activeView]);

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
    onAddMarker(bodyPart, { x: svgPoint.x, y: svgPoint.y }, activeView);
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

  // Create interactive layer on top of the realistic body map
  const renderInteractiveLayer = () => (
    <g className="interactive-layer">
      {getBodyParts().map((part) => (
        <path
          key={part.id}
          d={part.path}
          fill="transparent"
          stroke="transparent"
          strokeWidth="0.5"
          onMouseEnter={() => setHoveredPart(part.id)}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={(e) => handleBodyPartClick(e, part.name)}
          style={{ cursor: "pointer" }}
          data-body-part={part.name}
        />
      ))}
    </g>
  );

  // Filter markers for the current view
  const viewMarkers = markers.filter(marker => 
    (activeView === "front" && !marker.view) || marker.view === activeView
  );

  return (
    <div className="relative">
      <Tabs 
        value={activeView} 
        onValueChange={(value) => setActiveView(value as "front" | "back" | "side")}
        className="mb-4"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="front">Anterior View</TabsTrigger>
          <TabsTrigger value="back">Posterior View</TabsTrigger>
          <TabsTrigger value="side">Lateral View</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading[activeView] ? (
        <Skeleton className="w-full h-[70vh] rounded-lg" />
      ) : (
        <div className="relative">
          <svg 
            viewBox="0 0 100 230" 
            className="w-full max-h-[70vh]"
            style={{ border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#FFFFFF" }}
            dangerouslySetInnerHTML={
              realisticBodySvg[activeView] 
                ? { __html: realisticBodySvg[activeView] as string } 
                : undefined
            }
          >
            {!realisticBodySvg[activeView] && (
              /* Fallback body outline if AI generation fails */
              <g>
                {getBodyParts().map((part) => (
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
                
                {/* Face details for front view */}
                {activeView === "front" && (
                  <>
                    <ellipse cx="40" cy="40" rx="3" ry="4" fill="#1f2937" /> {/* Left eye */}
                    <ellipse cx="60" cy="40" rx="3" ry="4" fill="#1f2937" /> {/* Right eye */}
                    <path d="M45,60 Q50,65 55,60" stroke="#1f2937" strokeWidth="1" fill="none" /> {/* Mouth */}
                  </>
                )}
                
                {/* Face details for side view */}
                {activeView === "side" && (
                  <ellipse cx="70" cy="40" rx="3" ry="4" fill="#1f2937" /> /* Side eye */
                )}
              </g>
            )}
            
            {/* Add the interactive layer if using realistic body map */}
            {realisticBodySvg[activeView] && renderInteractiveLayer()}
            
            {/* Markers - only show markers for current view */}
            {viewMarkers.map((marker) => (
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
          </svg>
          
          {/* Body part labels that appear on hover */}
          {hoveredPart && (
            <div 
              className="absolute bg-black/70 text-white px-2 py-1 text-xs rounded pointer-events-none"
              style={{ 
                left: `${hoveredPart.includes("left") ? 15 : hoveredPart.includes("right") ? 85 : 50}%`,
                top: hoveredPart.includes("head") ? "15%" : 
                    hoveredPart.includes("chest") || hoveredPart.includes("upper") ? "40%" :
                    hoveredPart.includes("abdomen") || hoveredPart.includes("lower") ? "50%" :
                    hoveredPart.includes("leg") ? "75%" :
                    hoveredPart.includes("ear") ? "25%" : "60%",
                transform: "translate(-50%, -50%)"
              }}
            >
              {getBodyParts().find(part => part.id === hoveredPart)?.name || ""}
            </div>
          )}
        </div>
      )}
      
      {/* Hovered marker info */}
      {viewMarkers.map((marker) => (
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
