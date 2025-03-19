
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/serviceCategories";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
        <div>
          <h2 className="text-2xl font-medium mb-3">Select a Service</h2>
          <p className="text-muted-foreground">Choose the service you'd like to book for your appointment</p>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-grow px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
          {allServices.map((service, index) => {
            const serviceKey = `${service.categoryId}-${index}`;
            const isSelected = selectedService === serviceKey;
            
            return (
              <Card 
                key={serviceKey} 
                className={`cursor-pointer transition-all overflow-hidden hover:shadow-md ${
                  isSelected 
                    ? "border-primary/50 shadow-sm bg-primary/5" 
                    : "border-muted/50 hover:border-muted"
                }`}
                onClick={() => onSelectService(serviceKey)}
              >
                <CardContent className="p-5 flex flex-col h-full">
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className={`p-2 w-fit rounded-md bg-${service.iconColor || 'primary'}/10 mb-3`}>
                      {service.categoryIcon && <service.categoryIcon className={`h-5 w-5 text-${service.iconColor || 'primary'}`} />}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{service.categoryTitle}</div>
                    <h3 className="font-medium text-lg mb-1">{service.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{service.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-sm font-medium text-primary">{service.price}</div>
                    <div className={`h-3 w-3 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'}`}></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Footer with action button - sticky */}
      <div className="sticky bottom-0 bg-background pt-4 flex justify-end border-t mt-auto">
        <Button 
          onClick={onNext}
          disabled={!selectedService}
          className="flex items-center gap-2 px-6"
        >
          Choose Specialist
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
