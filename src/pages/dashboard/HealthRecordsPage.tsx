
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const HealthRecordsPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-normal mb-6">Health Records</h1>
      
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Your Health Records</h2>
          <p className="text-muted-foreground mb-4">
            Access and download your complete health records from Vyra Health.
          </p>
          
          <div className="border rounded-md p-4 text-center">
            <p className="text-gray-500">Your health records will appear here after your first appointment.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default HealthRecordsPage;
