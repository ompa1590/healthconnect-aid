
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

interface ServiceProps {
  service: {
    title: string;
    description: string;
    benefits: string[];
    price: string;
    iconColor: string;
  };
  categoryIcon: React.ElementType;
  index: number;
}

export const ServiceCard = ({ service, categoryIcon: Icon, index }: ServiceProps) => {
  return (
    <GlassCard 
      key={index} 
      className="p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`rounded-full ${service.iconColor}/10 w-14 h-14 flex items-center justify-center mb-5`}>
        <Icon className={service.iconColor} size={24} />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
      <p className="text-muted-foreground mb-4">{service.description}</p>
      
      <div className="mb-5">
        <h4 className="font-medium mb-2">Benefits:</h4>
        <ul className="grid grid-cols-1 gap-2">
          {service.benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-center text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="font-semibold text-primary">{service.price}</span>
        <Button className="rounded-full">
          Book Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
};
