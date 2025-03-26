
import React, { useState } from "react";
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
  onSelectService: (service: string) => void;
  onNext: () => void;
}

const ServiceSelection = ({ 
  selectedService, 
  onSelectService, 
  onNext 
}: ServiceSelectionProps) => {
  // Flatten all services from all categories
  const allServices = serviceCategories.flatMap(category => 
    category.services.map(service => ({
      ...service,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryIcon: category.icon
    }))
  );
  
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
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => onSelectService(serviceKey)}
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
          onClick={onNext}
          disabled={!selectedService}
          className="flex items-center gap-2 px-6 transition-all duration-300 hover:shadow-md"
        >
          Choose Specialist
          <ArrowRight className="h-4 w-4 animate-slide-left" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
