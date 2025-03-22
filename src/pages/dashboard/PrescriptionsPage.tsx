
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
import { ArrowLeft, Home } from "lucide-react";

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center mb-6">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-medium">My Healthcare</h1>
      </div>
      
      <Tabs defaultValue="prescriptions" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="chat" id="chat-tab">Chat with Doctor</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="support">Support & Help</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <MyPrescriptions />
            </div>
            <div>
              <MedicationReminders />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="treatment-plans" className="space-y-8">
          <CurrentPlans />
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-8">
          <PatientDoctorChat />
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-8">
          <BillingManagement />
        </TabsContent>
        
        <TabsContent value="support" className="space-y-8">
          <SupportOptions />
          <Separator className="my-8" />
          <QuickHelp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionsPage;
