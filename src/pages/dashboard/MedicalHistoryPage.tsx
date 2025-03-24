
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import MedicalHistory from "@/components/dashboard/MedicalHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const MedicalHistoryPage = () => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
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
          Medical History
          <FileText className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>
      
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/30 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 text-primary/70 mr-2" />
            <h2 className="text-xl font-medium">Your Health Timeline</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            View and manage your complete medical history. This information helps your healthcare providers deliver personalized care tailored to your specific needs.
          </p>
        </div>
      </div>
      
      <GlassCard className="rounded-xl shadow-sm" variant="elevated">
        <MedicalHistory />
      </GlassCard>
    </main>
  );
};

export default MedicalHistoryPage;
