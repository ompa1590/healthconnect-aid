
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import MedicalHistory from "@/components/dashboard/MedicalHistory";

const MedicalHistoryPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-normal mb-6">Medical History</h1>
      
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <MedicalHistory />
        </CardContent>
      </Card>
    </main>
  );
};

export default MedicalHistoryPage;
