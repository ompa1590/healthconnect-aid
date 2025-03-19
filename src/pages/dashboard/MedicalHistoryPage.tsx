
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MedicalHistory from "@/components/dashboard/MedicalHistory";

const MedicalHistoryPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar userName="Patient" />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-normal mb-6">Medical History</h1>
        
        <Card className="border rounded-xl shadow-sm">
          <CardContent className="p-6">
            <MedicalHistory />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MedicalHistoryPage;
