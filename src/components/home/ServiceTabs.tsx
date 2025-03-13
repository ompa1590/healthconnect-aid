
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";

interface Service {
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
}

interface ServiceTabsProps {
  services: Service[];
}

const ServiceTabs = ({ services }: ServiceTabsProps) => {
  return (
    <Tabs defaultValue="chronic-care" className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8 bg-transparent">
        {services.map((service) => (
          <TabsTrigger
            key={service.id}
            value={service.id}
            className="data-[state=active]:glass data-[state=active]:shadow-sm text-base py-3 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <service.icon className={`h-5 w-5 mr-2 text-${service.color} relative z-10 group-data-[state=active]:text-${service.color} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <span>{service.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {services.map((service) => (
        <TabsContent
          key={service.id}
          value={service.id}
          className="pt-4 animate-fade-in"
        >
          <ServiceCard service={service} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ServiceTabs;
