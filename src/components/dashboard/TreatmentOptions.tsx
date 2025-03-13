
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, Stethoscope, ShieldPlus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const treatments = [
  {
    id: 1,
    icon: ShieldPlus,
    name: "General Consultation",
    description: "On-demand medical advice for common health concerns",
    price: "$45/consultation",
    details: "Access a licensed healthcare provider within minutes for common illnesses, prescription refills, and medical questions."
  },
  {
    id: 2,
    icon: Heart,
    name: "Chronic Disease Management",
    description: "Comprehensive care for diabetes, hypertension, and other chronic conditions",
    price: "$70/month",
    details: "Ongoing care and monitoring for chronic conditions with regular check-ins, medication management, and personalized care plans."
  },
  {
    id: 3,
    icon: Brain,
    name: "Mental Health Therapy",
    description: "Professional counseling and therapy sessions",
    price: "$90/session",
    details: "Connect with licensed therapists and counselors for ongoing mental health support, including cognitive behavioral therapy and stress management."
  },
  {
    id: 4,
    icon: Activity,
    name: "Wellness Program",
    description: "Personalized nutrition and fitness coaching",
    price: "$50/month",
    details: "Receive customized diet and exercise plans, along with regular coaching sessions to help you achieve your health and fitness goals."
  },
  {
    id: 5,
    icon: Stethoscope,
    name: "Respiratory Care",
    description: "Specialized care for asthma and respiratory conditions",
    price: "$85/consultation",
    details: "Expert care for respiratory concerns with treatment plans, inhaler technique assessment, and ongoing management for optimal breathing."
  },
];

const TreatmentOptions = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {treatments.map((treatment) => (
        <div
          key={treatment.id}
          className="relative"
          onMouseEnter={() => setHoveredId(treatment.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <GlassCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <treatment.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">{treatment.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow">
              {treatment.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium">{treatment.price}</span>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </GlassCard>

          <AnimatePresence>
            {hoveredId === treatment.id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-10"
              >
                <GlassCard className="h-full p-6 border shadow-md backdrop-blur-md">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <treatment.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">{treatment.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {treatment.details}
                    </p>
                    <div className="mt-auto">
                      <span className="block text-sm font-medium mb-2">{treatment.price}</span>
                      <Button variant="default" size="sm" className="w-full">
                        Get Started
                      </Button>
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

export default TreatmentOptions;
