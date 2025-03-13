
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    icon: LucideIcon;
    name: string;
    description: string;
    price: string;
    features: string[];
    conditions?: string[];
    specialists?: string[];
    areas?: string[];
    color: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const Icon = service.icon;
  
  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Service Info */}
        <div className={`bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} p-8 lg:p-10 relative overflow-hidden`}>
          {/* Abstract shape decorations */}
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/5 to-transparent"></div>
          
          <Icon className={`h-14 w-14 text-${service.color} mb-6 transform transition-transform hover:scale-110 duration-300`} />
          <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
          <p className="text-muted-foreground mb-4">{service.description}</p>
          <div className="mb-6">
            <span className={`text-3xl font-bold text-${service.color}`}>{service.price}</span>
          </div>
          <Button className={`w-full rounded-full bg-${service.color} hover:bg-${service.color}/90 transition-transform duration-300 hover:scale-105`}>
            Get Started
          </Button>
        </div>

        {/* Service Details */}
        <div className="col-span-2 p-8 lg:p-10">
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">What's Included</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center group">
                  <div className={`h-5 w-5 rounded-full bg-${service.color}/20 flex items-center justify-center mr-3 group-hover:bg-${service.color}/30 transition-colors duration-300`}>
                    <span className={`h-2 w-2 rounded-full bg-${service.color} group-hover:scale-125 transition-transform duration-300`}></span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {service.conditions && (
            <div>
              <h4 className="text-lg font-medium mb-4">Conditions Covered</h4>
              <div className="flex flex-wrap gap-2">
                {service.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.specialists && (
            <div>
              <h4 className="text-lg font-medium mb-4">Available Specialists</h4>
              <div className="flex flex-wrap gap-2">
                {service.specialists.map((specialist, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
                  >
                    {specialist}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.areas && (
            <div>
              <h4 className="text-lg font-medium mb-4">Wellness Areas</h4>
              <div className="flex flex-wrap gap-2">
                {service.areas.map((area, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full bg-muted text-foreground text-sm hover:bg-${service.color}/10 hover:border-${service.color}/20 transition-colors duration-300 cursor-pointer`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default ServiceCard;
