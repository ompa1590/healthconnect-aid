import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
const DashboardServices = () => {
  return <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-normal mb-6">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {serviceCategories.flatMap(category => category.services.slice(0, 2).map((service, idx) => <Card key={`${category.id}-${idx}`} className="overflow-hidden border-muted/50 hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className={`rounded-full bg-${service.iconColor}/10 w-12 h-12 flex items-center justify-center mb-4`}>
                    {category.icon && <category.icon className={`h-6 w-6 text-${service.iconColor}`} />}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-medium">Price:</span>
                    <span className="text-primary font-semibold">{service.price}</span>
                  </div>
                  
                  <Button className="w-full mt-2">
                    Book Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>))}
      </div>
      
      <Card className="mb-8 border rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button variant="outline" size="lg" className="mx-auto">
          View All Services
        </Button>
      </div>
    </div>;
};
export default DashboardServices;