
import React from "react";
import MyPrescriptions from "@/components/dashboard/MyPrescriptions";
import CurrentPlans from "@/components/dashboard/CurrentPlans";
import SupportOptions from "@/components/dashboard/SupportOptions";
import MedicationReminders from "@/components/dashboard/MedicationReminders";
import QuickHelp from "@/components/dashboard/QuickHelp";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PrescriptionsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-medium mb-6">My Healthcare</h1>
      
      <Tabs defaultValue="prescriptions" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
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
