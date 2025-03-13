
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { healthCategories } from "@/data/serviceCategories";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HealthCategories = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {healthCategories.map((category) => (
        <div
          key={category.id}
          className="relative"
          onMouseEnter={() => setHoveredId(category.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
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

          <AnimatePresence>
            {hoveredId === category.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-10 overflow-hidden"
              >
                <GlassCard className="h-full p-4 border shadow-lg backdrop-blur-md">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`rounded-full bg-${category.color}/10 p-2`}>
                        <category.icon className={`h-5 w-5 text-${category.color}`} />
                      </div>
                      <h4 className="text-base font-semibold">{category.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {category.treatments.map((treatment, idx) => (
                        <Badge key={idx} variant="outline" className="bg-background/50 backdrop-blur-sm">
                          {treatment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default HealthCategories;
