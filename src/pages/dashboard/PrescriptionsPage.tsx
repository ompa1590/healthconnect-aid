
import React from "react";
import { useNavigate } from "react-router-dom";
import MyPrescriptions from "@/components/dashboard/MyPrescriptions";
import CurrentPlans from "@/components/dashboard/CurrentPlans";
import SupportOptions from "@/components/dashboard/SupportOptions";
import MedicationReminders from "@/components/dashboard/MedicationReminders";
import QuickHelp from "@/components/dashboard/QuickHelp";
import BillingManagement from "@/components/dashboard/BillingManagement";
import PatientDoctorChat from "@/components/dashboard/PatientDoctorChat";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Pill, MessageSquare, CreditCard, LifeBuoy, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const PrescriptionsPage = () => {
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
        <h1 className="text-3xl font-medium flex items-center">
          My Healthcare
          <Sparkles className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>
      
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/30 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <p className="text-muted-foreground max-w-2xl">
            Manage all aspects of your healthcare journey in one place - from prescriptions and treatment plans to billing and support.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="prescriptions" className="mb-8">
        <TabsList className="mb-6 bg-white/70 backdrop-blur-sm p-1 rounded-lg border border-border/30">
          <TabsTrigger value="prescriptions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Pill className="h-4 w-4 mr-2" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="treatment-plans" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            Treatment Plans
          </TabsTrigger>
          <TabsTrigger value="chat" id="chat-tab" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with Doctor
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <LifeBuoy className="h-4 w-4 mr-2" />
            Support & Help
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions" className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <GlassCard className="rounded-xl" variant="elevated" borderEffect>
                <MyPrescriptions />
              </GlassCard>
            </div>
            <div>
              <GlassCard className="rounded-xl" variant="accent" borderEffect>
                <MedicationReminders />
              </GlassCard>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="treatment-plans" className="space-y-8 animate-fade-in">
          <GlassCard className="rounded-xl" variant="colored" borderEffect>
            <CurrentPlans />
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-8 animate-fade-in">
          <GlassCard className="rounded-xl" variant="elevated" borderEffect>
            <PatientDoctorChat />
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-8 animate-fade-in">
          <GlassCard className="rounded-xl" variant="gradient" borderEffect>
            <BillingManagement />
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="support" className="space-y-8 animate-fade-in">
          <GlassCard className="rounded-xl" variant="colored" borderEffect>
            <SupportOptions />
          </GlassCard>
          <Separator className="my-8" />
          <GlassCard className="rounded-xl" variant="accent" borderEffect>
            <QuickHelp />
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionsPage;
