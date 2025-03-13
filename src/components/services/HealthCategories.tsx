
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { healthCategories } from "@/data/serviceCategories";
import { Link } from "react-router-dom";

const HealthCategories = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {healthCategories.map((category) => (
        <HoverCard key={category.id} openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Link to={`/services/${category.id}`}>
              <GlassCard 
                className="p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-full bg-${category.color}/10 p-3`}>
                    <category.icon className={`h-6 w-6 text-${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
              </GlassCard>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`rounded-full bg-${category.color}/10 p-2`}>
                  <category.icon className={`h-5 w-5 text-${category.color}`} />
                </div>
                <h4 className="text-base font-semibold">{category.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
              <div className="flex flex-wrap gap-2">
                {category.treatments.map((treatment, idx) => (
                  <Badge key={idx} variant="outline" className="bg-background">
                    {treatment}
                  </Badge>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default HealthCategories;
