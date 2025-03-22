
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import MedicalHistory from "@/components/dashboard/MedicalHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MedicalHistoryPage = () => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
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
        <h1 className="text-3xl font-normal">Medical History</h1>
      </div>
      
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <MedicalHistory />
        </CardContent>
      </Card>
    </main>
  );
};

export default MedicalHistoryPage;
