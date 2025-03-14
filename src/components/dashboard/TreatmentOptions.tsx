
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, Stethoscope, ShieldPlus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
            <GlassCard className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <treatment.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">{treatment.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {treatment.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium">{treatment.price}</span>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
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
                <p className="text-sm text-muted-foreground mb-3">{treatment.details}</p>
                <Button variant="default" size="sm" className="w-full mt-2">
                  Get Started
                </Button>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default TreatmentOptions;
