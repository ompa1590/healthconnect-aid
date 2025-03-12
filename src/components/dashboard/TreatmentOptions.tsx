
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, Stethoscope, ShieldPlus } from "lucide-react";

const treatments = [
  {
    icon: ShieldPlus,
    name: "General Consultation",
    description: "On-demand medical advice for common health concerns",
    price: "$45/consultation",
  },
  {
    icon: Heart,
    name: "Chronic Disease Management",
    description: "Comprehensive care for diabetes, hypertension, and other chronic conditions",
    price: "$70/month",
  },
  {
    icon: Brain,
    name: "Mental Health Therapy",
    description: "Professional counseling and therapy sessions",
    price: "$90/session",
  },
  {
    icon: Activity,
    name: "Wellness Program",
    description: "Personalized nutrition and fitness coaching",
    price: "$50/month",
  },
  {
    icon: Stethoscope,
    name: "Respiratory Care",
    description: "Specialized care for asthma and respiratory conditions",
    price: "$85/consultation",
  },
];

const TreatmentOptions = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {treatments.map((treatment) => (
        <GlassCard key={treatment.name} className="flex flex-col">
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
      ))}
    </div>
  );
};

export default TreatmentOptions;
