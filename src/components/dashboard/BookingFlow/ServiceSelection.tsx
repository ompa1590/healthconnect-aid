import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/serviceCategories";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ServiceSelectionProps {
  selectedService: string | null;
  onSelectService: (service: string, serviceName: string) => void;
  onNext: () => void;
}

// Define the service type to ensure proper type checking
interface EnhancedService {
  title: string;
  description: string;
  price: string;
  iconColor?: string;
  benefits?: string[];
  features?: string[]; // Making features optional since not all services have it
  categoryId: string;
  categoryTitle: string;
  categoryIcon: React.ComponentType<any>;
}

const ServiceSelection = ({ 
  selectedService, 
  onSelectService, 
  onNext 
}: ServiceSelectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const lastSelectedRef = useRef<string | null>(null);

  // Flatten all services from all categories and cast to EnhancedService type
  const allServices: EnhancedService[] = serviceCategories.flatMap(category => 
    category.services.map(service => ({
      ...service,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryIcon: category.icon
    }))
  );

  // Handle service selection with proper debouncing and event handling
  const handleServiceSelect = useCallback((e: React.MouseEvent, serviceKey: string, serviceName: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent double selection or rapid clicking
    if (processingRef.current || isProcessing || lastSelectedRef.current === serviceKey) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    lastSelectedRef.current = serviceKey;

    try {
      // Small delay to prevent rapid state changes
      setTimeout(() => {
        onSelectService(serviceKey, serviceName);
        processingRef.current = false;
        setIsProcessing(false);
      }, 100);
    } catch (error) {
      console.error("Error selecting service:", error);
      processingRef.current = false;
      setIsProcessing(false);
      lastSelectedRef.current = null;
    }
  }, [onSelectService, isProcessing]);

  // Handle next button with proper event handling
  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (processingRef.current || isProcessing || !selectedService) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      setTimeout(() => {
        onNext();
        processingRef.current = false;
        setIsProcessing(false);
      }, 100);
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [onNext, selectedService, isProcessing]);

  // Reset processing state when selectedService changes
  React.useEffect(() => {
    if (selectedService && lastSelectedRef.current === selectedService) {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [selectedService]);
  
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[700px]">
      {/* Header section - sticky */}
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-medium mb-3">Select a Service</h2>
          <p className="text-muted-foreground">Choose the service you'd like to book for your appointment</p>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-grow px-2 py-4 hide-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
          {allServices.map((service, index) => {
            const serviceKey = `${service.categoryId}-${index}`;
            const isSelected = selectedService === serviceKey;
            
            return (
              <HoverCard key={serviceKey}>
                <HoverCardTrigger asChild>
                  <Card 
                    className={`cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-md animate-fade-in ${
                      isSelected 
                        ? "border-primary shadow-sm bg-primary/5" 
                        : "border-muted/50 hover:border-muted"
                    } ${isProcessing ? "pointer-events-none opacity-75" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={(e) => handleServiceSelect(e, serviceKey, service.title)}
                  >
                    <CardContent className="p-4 flex flex-col h-full relative">
                      {isSelected && (
                        <div className="absolute top-2 right-2 animate-scale-in">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div className="flex items-center mb-3">
                        <div className={`p-2 w-fit rounded-md bg-${service.iconColor || 'primary'}/10 mr-3 transition-all duration-300`}>
                          {service.categoryIcon && (
                            <service.categoryIcon 
                              className={`h-4 w-4 text-${service.iconColor || 'primary'}`} 
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{service.categoryTitle}</div>
                          <h3 className="font-medium text-base">{service.title}</h3>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="text-sm font-medium text-primary">{service.price}</div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                            isSelected 
                              ? 'bg-primary scale-125' 
                              : 'bg-muted'
                          }`}></div>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{service.title}</h4>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                    
                    {/* Check if service has features property and it has items */}
                    {service.features && service.features.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-medium">Includes:</span>
                        <ul className="mt-1 space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="text-xs flex items-start">
                              <span className="h-1 w-1 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* If no features but has benefits, show them instead */}
                    {(!service.features || service.features.length === 0) && 
                     service.benefits && service.benefits.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-medium">Benefits:</span>
                        <ul className="mt-1 space-y-1">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-xs flex items-start">
                              <span className="h-1 w-1 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-2 text-xs text-right text-primary font-medium">
                      {service.price}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
      
      {/* Footer with action button - sticky */}
      <div className="sticky bottom-0 bg-background pt-4 flex justify-end border-t mt-auto">
        <Button 
          onClick={handleNext}
          disabled={!selectedService || isProcessing}
          className="flex items-center gap-2 px-6 transition-all duration-300 hover:shadow-md"
          type="button"
        >
          {isProcessing ? "Processing..." : "Choose Specialist"}
          <ArrowRight className="h-4 w-4 animate-slide-left" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;