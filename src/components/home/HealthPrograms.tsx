
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const HealthPrograms = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const programs = [
    {
      id: 1,
      tag: "Weight Management",
      title: "Achieve your health goals",
      description: "Personalized weight management programs with medical supervision and ongoing support.",
      ctaText: "Learn more",
      ctaLink: "/services/weight-management",
    },
    {
      id: 2,
      tag: "Smoking Cessation",
      title: "Commit to quitting",
      description: "Smoke-free nicotine replacement therapies with professional support every step of the way.",
      ctaText: "Get started",
      ctaLink: "/services/smoking-cessation",
    },
    {
      id: 3,
      tag: "Mental Wellness",
      title: "Prioritize your mental health",
      description: "Evidence-based therapy approaches with licensed professionals for better mental wellness.",
      ctaText: "Explore options",
      ctaLink: "/services/mental-health",
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Discover</h2>
        
        <div className="relative">
          <GlassCard className="overflow-hidden p-0">
            <div className="flex flex-col md:flex-row">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                <div className="text-primary font-medium mb-2">
                  {programs[activeSlide].tag}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {programs[activeSlide].title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {programs[activeSlide].description}
                </p>
                <Button className="rounded-full w-fit px-6">
                  {programs[activeSlide].ctaText}
                </Button>
              </div>
              
              <div className="md:w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 h-[300px] md:h-auto flex items-center justify-center">
                <div className="text-gray-400 text-lg">Program Image Placeholder</div>
              </div>
            </div>
          </GlassCard>
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              size="icon" 
              variant="outline"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              size="icon" 
              variant="outline"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          {programs.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeSlide ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
              onClick={() => setActiveSlide(idx)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthPrograms;
