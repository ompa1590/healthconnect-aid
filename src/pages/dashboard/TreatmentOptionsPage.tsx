
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TreatmentOptions from "@/components/dashboard/TreatmentOptions";

const TreatmentOptionsPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-normal mb-6">Treatment Options</h1>
      
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Available Treatment Options</h2>
          <TreatmentOptions />
        </CardContent>
      </Card>
    </main>
  );
};

export default TreatmentOptionsPage;
