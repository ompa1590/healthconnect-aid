
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { healthCategories } from "@/data/serviceCategories";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const HealthCategories = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {healthCategories.map((category) => (
        <div
          key={category.id}
          className="relative h-full"
          onMouseEnter={() => setHoveredId(category.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Link to={`/services/${category.id}`}>
            <motion.div
              animate={{
                height: hoveredId === category.id ? "auto" : "initial",
                transition: { duration: 0.3 }
              }}
            >
              <GlassCard 
                className={`p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer ${
                  hoveredId === category.id ? "h-full" : ""
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`rounded-full bg-${category.color}/10 p-3`}>
                    <category.icon className={`h-6 w-6 text-${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                
                {/* Expanded content that appears on hover */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: hoveredId === category.id ? 1 : 0,
                    height: hoveredId === category.id ? "auto" : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.treatments.map((treatment, idx) => (
                      <Badge key={idx} variant="outline" className="bg-background/50 backdrop-blur-sm">
                        {treatment}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </GlassCard>
            </motion.div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HealthCategories;
