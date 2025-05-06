
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { popularTreatments } from "@/data/serviceCategories";
import { useState } from "react";
import { motion } from "framer-motion";
import TreatmentDetailsDialog from "./TreatmentDetailsDialog";

const PopularTreatments = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLearnMore = (treatment: any) => {
    setSelectedTreatment(treatment);
    setDialogOpen(true);
  };

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
              className="relative h-full"
              onMouseEnter={() => setHoveredId(treatment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.div
                animate={{
                  height: hoveredId === treatment.id ? "auto" : "initial",
                  transition: { duration: 0.3 }
                }}
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
                    
                    {/* Expanded content that appears on hover */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredId === treatment.id ? 1 : 0,
                        height: hoveredId === treatment.id ? "auto" : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <p className="text-sm text-muted-foreground mb-4">{treatment.description}</p>
                    </motion.div>
                    
                    <Button 
                      variant="default" 
                      className="rounded-full mt-6 w-full justify-between"
                      onClick={() => handleLearnMore(treatment)}
                    >
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <TreatmentDetailsDialog 
        treatment={selectedTreatment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
};

export default PopularTreatments;
