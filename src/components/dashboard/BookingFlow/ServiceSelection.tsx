
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-2">Select a Service</h2>
        <p className="text-muted-foreground">Choose the service you'd like to book</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
        {allServices.map((service, index) => (
          <Card 
            key={`${service.categoryId}-${index}`} 
            className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
              selectedService === `${service.categoryId}-${index}` 
                ? "border-primary" 
                : "border-muted/50"
            }`}
            onClick={() => onSelectService(`${service.categoryId}-${index}`)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              {selectedService === `${service.categoryId}-${index}` && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              )}
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">{service.categoryTitle}</div>
                <h3 className="font-medium mb-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                <div className="mt-2 text-sm font-medium">{service.price}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!selectedService}
          className="flex items-center"
        >
          Choose Specialist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
