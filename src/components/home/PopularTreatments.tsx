
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { popularTreatments } from "@/data/serviceCategories";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopularTreatments = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">
            Most Popular
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Popular Treatment Options
          </h2>
          <p className="text-muted-foreground text-lg">
            Our most requested virtual healthcare services, designed to address your most common health concerns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="relative"
              onMouseEnter={() => setHoveredId(treatment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <GlassCard 
                className={`overflow-hidden transform transition-all duration-300 hover:translate-y-[-4px] relative cursor-pointer h-full`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-b from-${treatment.color}/20 to-${treatment.color}/5 opacity-50 rounded-2xl`}></div>
                
                <div className="relative h-full flex flex-col justify-between p-6">
                  <div className={`rounded-full bg-${treatment.color}/10 w-14 h-14 flex items-center justify-center mb-5`}>
                    <treatment.icon className={`h-7 w-7 text-${treatment.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{treatment.title}</h3>
                    <p className="text-muted-foreground">{treatment.tagline}</p>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="rounded-full mt-6 w-full justify-between"
                    asChild
                  >
                    <Link to={treatment.path}>
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </GlassCard>

              <AnimatePresence>
                {hoveredId === treatment.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10 overflow-hidden"
                  >
                    <GlassCard className="h-full p-6 border shadow-lg backdrop-blur-md">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`rounded-full bg-${treatment.color}/10 p-2`}>
                            <treatment.icon className={`h-6 w-6 text-${treatment.color}`} />
                          </div>
                          <h4 className="text-xl font-semibold">{treatment.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{treatment.description}</p>
                        
                        <Button 
                          variant="default" 
                          className="rounded-full mt-auto w-full justify-between"
                          asChild
                        >
                          <Link to={treatment.path}>
                            <span>Learn more</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTreatments;
