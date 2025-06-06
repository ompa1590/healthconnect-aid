
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Bot, MessageCircle, Stethoscope, CalendarClock, PanelRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import FeatureDetailsDialog from "./FeatureDetailsDialog";

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const features = [
    {
      icon: Stethoscope,
      title: "Virtual Consultations",
      description:
        "Connect with healthcare professionals instantly for medical advice, prescriptions, and follow-ups.",
      delay: "0.1s",
      color: "primary",
      details: "Our virtual consultation platform allows you to connect with healthcare professionals from the comfort of your home. Get medical advice, prescriptions, and follow-ups without the need to travel to a clinic.",
      benefits: ["No travel required", "Same-day appointments", "Access to specialists", "Secure and private"],
      features: ["HD video consultations", "Secure messaging", "Digital prescriptions", "Medical record access"]
    },
    {
      icon: CalendarClock,
      title: "Chronic Care Management",
      description:
        "Personalized programs for conditions like diabetes, hypertension, and weight management.",
      delay: "0.2s",
      color: "secondary",
      details: "Our chronic care management programs are designed to help you manage long-term health conditions effectively. We provide personalized care plans, regular check-ins, and continuous support.",
      benefits: ["Personalized care plans", "Regular monitoring", "Medication management", "Lifestyle support"],
      features: ["Condition-specific programs", "Remote monitoring tools", "Regular virtual check-ins", "Educational resources"]
    },
    {
      icon: PanelRight,
      title: "Specialist Services",
      description:
        "Access to dermatologists, endocrinologists, mental health professionals, and more.",
      delay: "0.3s",
      color: "primary",
      details: "Our network includes a wide range of specialists who can provide expert care for specific health concerns. Get access to dermatologists, endocrinologists, mental health professionals, and more without long wait times.",
      benefits: ["Reduced wait times", "Expert opinions", "Comprehensive care", "Convenient scheduling"],
      features: ["Dermatology consultations", "Endocrinology services", "Mental health support", "Cardiology assessments"]
    },
    {
      icon: Bot,
      title: "AI Symptom Checker",
      description:
        "Advanced technology to assess symptoms and guide you to appropriate care options.",
      delay: "0.4s",
      color: "secondary",
      details: "Our AI-powered symptom checker uses advanced algorithms to help you understand your symptoms and determine the most appropriate next steps. It's available 24/7 to provide initial guidance before connecting with a healthcare provider.",
      benefits: ["24/7 availability", "Quick initial assessment", "Guided care recommendations", "Continuous learning"],
      features: ["Comprehensive symptom analysis", "Evidence-based recommendations", "Integration with medical records", "Follow-up care suggestions"]
    },
    {
      icon: MessageCircle,
      title: "Secure Messaging",
      description:
        "HIPAA-compliant communication with your healthcare team for ongoing support.",
      delay: "0.5s",
      color: "primary",
      details: "Our secure messaging platform ensures that all communications with your healthcare team are protected and private. Send messages, ask questions, and receive ongoing support between appointments.",
      benefits: ["HIPAA compliance", "Continuous care", "Quick responses", "Reduced communication barriers"],
      features: ["End-to-end encryption", "File sharing", "Notification alerts", "Message history"]
    },
    {
      icon: ShieldCheck,
      title: "Second Opinion Service",
      description:
        "Consult specialist physicians within the network for additional medical perspectives.",
      delay: "0.6s",
      color: "secondary",
      details: "Our second opinion service gives you access to specialist physicians who can provide additional perspectives on your diagnosis or treatment plan. This can help you make more informed decisions about your healthcare.",
      benefits: ["Expert validation", "Alternative perspectives", "Treatment comparisons", "Peace of mind"],
      features: ["Medical record review", "Specialist consultations", "Comprehensive reports", "Treatment recommendations"]
    },
  ];

  const handleLearnMore = (feature: any, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFeature(feature);
    setDialogOpen(true);
  };

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl -z-10 blob-animation-slow"></div>
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl -z-10 blob-animation"></div>

      {/* 3D-like decorative elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-xl transform rotate-12 floating-slow"></div>
      <div className="absolute top-1/2 right-24 w-16 h-16 bg-gradient-to-br from-secondary/20 to-transparent rounded-xl transform -rotate-12 floating" style={{ animationDelay: "1.2s" }}></div>
      <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl transform rotate-45 floating-fast" style={{ animationDelay: "0.8s" }}></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-muted text-primary mb-4">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Comprehensive Healthcare Services</h2>
          <p className="text-muted-foreground text-lg">
            Our platform offers a wide range of virtual healthcare services designed to meet your needs from anywhere, anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              className="flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`rounded-full bg-${feature.color}/10 w-14 h-14 flex items-center justify-center mb-6 transform transition-transform duration-500 hover:scale-110 hover:bg-${feature.color}/20`}>
                <feature.icon className={`h-7 w-7 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground flex-grow">{feature.description}</p>
              <Button
                variant="ghost"
                className="mt-6 p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent justify-start group"
                onClick={(e) => handleLearnMore(feature, e)}
              >
                Learn more 
                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
      
      <FeatureDetailsDialog 
        feature={selectedFeature}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
};

export default FeaturesSection;
