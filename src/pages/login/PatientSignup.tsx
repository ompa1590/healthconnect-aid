
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AccountInfoStep from "@/components/signup/AccountInfoStep";
import ProvinceStep from "@/components/signup/ProvinceStep";
import HealthCardStep from "@/components/signup/HealthCardStep";
import AIHistoryStep from "@/components/signup/AIHistoryStep";
import SignupComplete from "@/components/signup/SignupComplete";

export type SignupFormData = {
  email: string;
  password: string;
  name: string;
  province: string;
  healthCardNumber: string;
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    pastTreatments: string[];
  };
};

const PatientSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    name: "",
    province: "",
    healthCardNumber: "",
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
      pastTreatments: [],
    },
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define the steps in the sign-up process
  const steps = [
    {
      title: "Create Your Account",
      component: (
        <AccountInfoStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Select Your Province",
      component: (
        <ProvinceStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Health Card Information",
      component: (
        <HealthCardStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Medical History",
      component: (
        <AIHistoryStep 
          formData={formData} 
          updateFormData={(data) => setFormData({
            ...formData,
            medicalHistory: {
              ...formData.medicalHistory,
              ...data,
            },
          })} 
        />
      ),
    },
    {
      title: "All Set!",
      component: (
        <SignupComplete 
          formData={formData}
          onComplete={() => {
            toast({
              title: "Account created successfully",
              description: "Welcome to Altheo Health! You can now log in.",
            });
            navigate("/login");
          }}
        />
      ),
    },
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-primary text-4xl font-bold tracking-tight">Altheo</span>
            <span className="text-secondary text-4xl font-bold tracking-tight">Health</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">{steps[currentStep].title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <GlassCard className="px-6 py-8 mt-8">
          <div className="mb-6">
            <div className="w-full bg-muted/30 h-2 rounded-full">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {steps[currentStep].component}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={goToNextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </GlassCard>

        {currentStep === 0 && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSignup;
