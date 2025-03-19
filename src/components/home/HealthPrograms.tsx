import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, ArrowRight, Heart, Cigarette, Brain, PanelRight, Clock, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HealthPrograms = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const programs = [
    {
      id: 1,
      tag: "Weight Management",
      title: "Virtual Weight Management Programs",
      description: "Get personalized guidance and ongoing support from certified healthcare providers through our secure telehealth platform.",
      ctaText: "Start your journey",
      ctaLink: "/services/weight-management",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop",
      icon: PanelRight,
      bgColor: "from-primary/20 to-primary/5"
    },
    {
      id: 2,
      tag: "Smoking Cessation",
      title: "Virtual Smoking Cessation Support",
      description: "Connect with specialists who provide evidence-based therapies and personalized plans to help you quit for good.",
      ctaText: "Breathe easier",
      ctaLink: "/services/smoking-cessation",
      image: "public/lovable-uploads/ca9bf6d1-7eb8-48e1-a631-f8a0ce3bde57.png",
      icon: Cigarette,
      bgColor: "from-secondary/20 to-secondary/5"
    },
    {
      id: 3,
      tag: "Mental Wellness",
      title: "Virtual Mental Health Therapy",
      description: "Access licensed mental health professionals from the comfort of your home through our secure, HIPAA-compliant platform.",
      ctaText: "Feel better today",
      ctaLink: "/services/mental-health",
      image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=1470&auto=format&fit=crop",
      icon: Brain,
      bgColor: "from-wellness/20 to-wellness/5"
    },
    {
      id: 4,
      tag: "Chronic Care",
      title: "Virtual Chronic Condition Management",
      description: "Receive ongoing care and monitoring for chronic health conditions with regular telehealth check-ins and digital health tracking.",
      ctaText: "Manage effectively",
      ctaLink: "/services/chronic-care",
      image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=1470&auto=format&fit=crop",
      icon: Heart,
      bgColor: "from-care/20 to-care/5"
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };
  
  return (
    <section className="py-20 health-pattern-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <span className="text-primary font-medium text-sm">TELEHEALTH PROGRAMS</span>
            </div>
            <h2 className="text-3xl font-bold">Virtual Healthcare Programs</h2>
          </div>
          <p className="text-muted-foreground max-w-md mt-4 md:mt-0">
            Expert-led telehealth programs delivered through our secure virtual platform, designed to help you achieve your health goals.
          </p>
        </div>
        
        <div className="relative">
          <GlassCard className="overflow-hidden p-0 border-none shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className={`p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-gradient-to-br ${programs[activeSlide].bgColor}`}>
                <div className="mb-6">
                  <span className="telehealth-badge">
                    {React.createElement(programs[activeSlide].icon, { className: "h-3.5 w-3.5 mr-1" })}
                    {programs[activeSlide].tag}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {programs[activeSlide].title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {programs[activeSlide].description}
                </p>
                <Button className="rounded-full w-fit px-6 group" asChild>
                  <Link to={programs[activeSlide].ctaLink}>
                    {programs[activeSlide].ctaText}
                    <ArrowRightCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden">
                <img 
                  src={programs[activeSlide].image} 
                  alt={programs[activeSlide].title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:bg-gradient-to-l" />
                
                <div className="absolute bottom-6 right-6 bg-background/80 backdrop-blur-md px-4 py-3 rounded-lg text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Available 24/7
                </div>
              </div>
            </div>
          </GlassCard>
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              size="icon" 
              variant="outline"
              className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-white"
              onClick={prevSlide}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              size="icon" 
              variant="outline"
              className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-white"
              onClick={nextSlide}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-6 gap-2">
          {programs.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeSlide ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthPrograms;
