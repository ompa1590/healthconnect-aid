
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles, PlusCircle } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { GlassCard } from "../ui/GlassCard";

const DashboardServices = () => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-normal flex items-center">
          Our Services
          <Sparkles className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>
      
      <div className="mb-8 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/40 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <h2 className="text-xl font-medium mb-2">Comprehensive Healthcare Solutions</h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore our range of specialized medical services designed to meet your unique healthcare needs.
            Book appointments with expert practitioners in various fields of medicine.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {serviceCategories.flatMap(category => category.services.slice(0, 2).map((service, idx) => (
          <GlassCard 
            key={`${category.id}-${idx}`} 
            className="overflow-hidden hover:-translate-y-1 transition-all"
            variant={idx % 2 === 0 ? "colored" : "elevated"}
            borderEffect
          >
            <div className="p-6">
              <div className={`rounded-full bg-${service.iconColor}/10 w-12 h-12 flex items-center justify-center mb-4`}>
                {category.icon && <category.icon className={`h-6 w-6 text-${service.iconColor}`} />}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              
              <div className="flex items-center gap-2 text-sm mb-3 bg-muted/10 px-3 py-1 rounded-full inline-block">
                <span className="font-medium">Price:</span>
                <span className="text-primary font-semibold">{service.price}</span>
              </div>
              
              <Button className="w-full mt-2 group">
                Book Now 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </GlassCard>
        )))}
      </div>
      
      <GlassCard 
        className="mb-8 rounded-xl overflow-hidden p-0" 
        variant="gradient"
        borderEffect
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-medium">Custom Treatment Plans</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Our healthcare professionals can create personalized treatment plans tailored to your specific needs.
            Contact us to learn more about custom healthcare solutions.
          </p>
          <Button variant="outline" className="bg-white/50 hover:bg-white/70 group">
            Request Custom Plan
            <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </GlassCard>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          size="lg" 
          className="mx-auto bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md transition-all group"
        >
          View All Services
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardServices;
