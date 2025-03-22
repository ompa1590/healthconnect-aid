
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AccountInfoStep from "@/components/signup/AccountInfoStep";
import ProvinceStep from "@/components/signup/ProvinceStep";
import HealthCardStep from "@/components/signup/HealthCardStep";
import InsuranceInfoStep from "@/components/signup/InsuranceInfoStep";
import AIHistoryStep from "@/components/signup/AIHistoryStep";
import DocumentUploadStep from "@/components/signup/DocumentUploadStep";
import SignupComplete from "@/components/signup/SignupComplete";
import { supabase } from "@/integrations/supabase/client";

export type SignupFormData = {
  email: string;
  password: string;
  name: string;
  province: string;
  healthCardNumber: string;
  healthCardProvince?: string;
  healthCardExpiry?: string;
  isHealthCardValid?: boolean;
  hasPrivateInsurance?: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceCoverageDetails?: string;
  insuranceCards?: string[];
  insuranceCardFiles?: File[];
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    pastTreatments: string[];
  };
  documents?: string[];
  documentFiles?: File[];
};

const PatientSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    name: "",
    province: "",
    healthCardNumber: "",
    healthCardProvince: "",
    healthCardExpiry: "",
    isHealthCardValid: false,
    hasPrivateInsurance: undefined,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceCoverageDetails: "",
    insuranceCards: [],
    insuranceCardFiles: [],
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: [],
      pastTreatments: [],
    },
    documents: [],
    documentFiles: [],
  });
  const [stepErrors, setStepErrors] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Validate current step
  const validateCurrentStep = (): boolean => {
    setStepErrors(null);
    
    switch (currentStep) {
      case 0: // Account Info
        if (!formData.name || !formData.name.trim()) {
          setStepErrors("Full name is required");
          return false;
        }
        if (!formData.email || !formData.email.trim()) {
          setStepErrors("Email address is required");
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setStepErrors("Password must be at least 8 characters");
          return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
          setStepErrors("Password must include at least one uppercase letter");
          return false;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
          setStepErrors("Password must include at least one special character");
          return false;
        }
        break;
        
      case 1: // Province
        if (!formData.province) {
          setStepErrors("Please select your province");
          return false;
        }
        break;
        
      case 2: // Health Card
        if (!formData.healthCardNumber || !formData.healthCardNumber.trim()) {
          setStepErrors("Health card number is required");
          return false;
        }
        if (!formData.healthCardProvince) {
          setStepErrors("Health card issuing province/territory is required");
          return false;
        }
        if (!formData.healthCardExpiry) {
          setStepErrors("Health card expiry date is required");
          return false;
        }
        if (!formData.isHealthCardValid) {
          setStepErrors("Please confirm your health card is valid");
          return false;
        }
        break;
        
      case 3: // Insurance Info
        if (formData.hasPrivateInsurance === undefined) {
          setStepErrors("Please indicate whether you have private insurance");
          return false;
        }
        if (formData.hasPrivateInsurance === true) {
          if (!formData.insuranceProvider || !formData.insuranceProvider.trim()) {
            setStepErrors("Insurance provider name is required");
            return false;
          }
          if (!formData.insurancePolicyNumber || !formData.insurancePolicyNumber.trim()) {
            setStepErrors("Policy/group number is required");
            return false;
          }
          if (!formData.insuranceCards || formData.insuranceCards.length === 0) {
            setStepErrors("Please upload a copy of your insurance card");
            return false;
          }
        }
        break;
    }
    
    return true;
  };

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
      title: "Insurance Information",
      component: (
        <InsuranceInfoStep 
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
      title: "Upload Documents",
      component: (
        <DocumentUploadStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
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
              description: "Welcome to Vyra Health! You can now log in.",
            });
            navigate("/dashboard");
          }}
        />
      ),
    }
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: "Please check your information",
          description: stepErrors,
          variant: "destructive",
        });
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setStepErrors(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-primary text-4xl font-bold tracking-tight">Vyra</span>
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

          {stepErrors && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
              {stepErrors}
            </div>
          )}

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
