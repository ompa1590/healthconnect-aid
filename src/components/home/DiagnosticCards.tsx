
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DiagnosticDetailsDialog from "./DiagnosticDetailsDialog";

const DiagnosticCards = () => {
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const diagnosticCategories = [
    {
      id: 1,
      title: "Metabolic Health",
      color: "from-red-200 to-red-100",
      darkBorder: "dark:border-red-400",
      isAvailable: true,
      tags: ["Diabetes", "Prediabetes", "High Cholesterol"],
      link: "/services/metabolic-health",
      description: "Comprehensive testing and monitoring of your metabolic health markers, including blood glucose, insulin resistance, cholesterol profiles, and other key indicators.",
      benefits: ["Early detection of metabolic disorders", "Personalized treatment plans", "Ongoing monitoring", "Lifestyle recommendations"],
      features: ["Complete lipid panel", "Fasting blood glucose", "HbA1c testing", "Insulin resistance assessment", "Personalized report with recommendations"]
    },
    {
      id: 2,
      title: "Heart Health",
      color: "from-blue-200 to-blue-100",
      darkBorder: "dark:border-blue-400",
      isAvailable: false,
      comingSoon: true,
      tags: ["Heart Disease", "Blood Pressure", "Cholesterol"],
      link: "/services/heart-health",
      description: "Advanced cardiovascular screening to assess your heart health, identify risk factors, and develop preventative strategies for long-term cardiovascular wellness.",
      benefits: ["Cardiovascular risk assessment", "Early detection", "Preventative strategies", "Heart-healthy recommendations"],
      features: ["Blood pressure monitoring", "ECG assessment", "Cholesterol and triglyceride testing", "Cardiac risk calculation", "Personalized heart health plan"]
    },
    {
      id: 3,
      title: "360° Health",
      color: "from-amber-200 to-green-100",
      darkBorder: "dark:border-green-400",
      isAvailable: false,
      comingSoon: true,
      tags: ["Vitamins", "Hormones", "20+ tests", "Biological age"],
      link: "/services/holistic-health",
      description: "Our most comprehensive health assessment covering multiple systems including metabolic, cardiovascular, hormonal, nutritional, and inflammatory markers for a complete health overview.",
      benefits: ["Complete health snapshot", "Multiple system assessment", "Biological age calculation", "Comprehensive wellness plan"],
      features: ["Over 20 health markers tested", "Hormone balance assessment", "Vitamin and mineral levels", "Inflammatory markers", "Detailed health report and recommendations"]
    },
  ];

  const handleLearnMore = (diagnostic: any, e: React.MouseEvent) => {
    e.preventDefault(); // This prevents navigation to the link
    setSelectedDiagnostic(diagnostic);
    setDialogOpen(true);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="text-3xl font-bold">Diagnostic tests</h2>
            <Badge variant="outline" className="ml-3 bg-primary/10 text-primary border-primary/20">New</Badge>
          </div>
          <p className="text-lg text-muted-foreground">Get insights about your health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diagnosticCategories.map((category) => (
            <GlassCard 
              key={category.id}
              className={`overflow-hidden transform transition-all duration-300 hover:translate-y-[-4px] relative bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:shadow-lg ${category.darkBorder}`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${category.color} dark:from-gray-800 dark:to-gray-700 opacity-50 rounded-2xl`}></div>
              
              <div className="relative h-full flex flex-col justify-between p-6">
                {category.comingSoon && (
                  <div className="text-sm text-blue-500 dark:text-blue-300 font-medium mb-2">Coming soon</div>
                )}
                
                <h3 className="text-2xl font-bold mb-6">{category.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {category.tags.map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className={`bg-white/80 dark:bg-gray-800/80 text-black dark:text-white backdrop-blur-sm rounded-full`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  variant={category.isAvailable ? "default" : "outline"} 
                  className="rounded-full mt-auto w-full justify-between"
                  onClick={(e) => handleLearnMore(category, e)}
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <DiagnosticDetailsDialog 
        diagnostic={selectedDiagnostic}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
};

export default DiagnosticCards;
