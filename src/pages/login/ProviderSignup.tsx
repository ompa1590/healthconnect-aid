
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProviderSignupForm } from "@/hooks/useProviderSignupForm";
import { validateStep } from "@/utils/providerSignupValidation";
import { SignupProgressBar } from "@/components/provider/signup/SignupProgressBar";
import GeneralInfoStep from "@/components/provider/signup/GeneralInfoStep";
import ProviderTypeStep from "@/components/provider/signup/ProviderTypeStep";
import RegistrationNumberStep from "@/components/provider/signup/RegistrationNumberStep";
import SpecializationStep from "@/components/provider/signup/SpecializationStep";
import ServicesOfferedStep from "@/components/provider/signup/ServicesOfferedStep";
import BiographyStep from "@/components/provider/signup/BiographyStep";
import AvailabilityStep from "@/components/provider/signup/AvailabilityStep";
import DocumentUploadStep from "@/components/provider/signup/DocumentUploadStep";
import SignupComplete from "@/components/provider/signup/SignupComplete";

export type ProviderFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  providerType: string;
  customProviderType?: string; // Added for "Other" provider type
  registrationNumber: string;
  registrationExpiry: Date | undefined;
  specializations: string[];
  servicesOffered: string[];
  biography: string;
  availability: {
    [key: string]: {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    };
  };
  profilePicture?: File;
  certificateFile?: File;
  certificateSummary?: string;
  certificateVerified?: boolean;
  signatureImage?: string;
};

const ProviderSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<string | null>(null);
  const { formData, updateFormData } = useProviderSignupForm();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/provider/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const steps = [
    {
      title: "General Information",
      component: (
        <GeneralInfoStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Provider Type",
      component: (
        <ProviderTypeStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Registration Number",
      component: (
        <RegistrationNumberStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Specialization",
      component: (
        <SpecializationStep 
          formData={formData} 
          updateFormData={updateFormData} 
          providerType={formData.providerType}
        />
      ),
    },
    {
      title: "Services Offered",
      component: (
        <ServicesOfferedStep 
          formData={formData} 
          updateFormData={updateFormData} 
          providerType={formData.providerType}
        />
      ),
    },
    {
      title: "Professional Biography",
      component: (
        <BiographyStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Availability",
      component: (
        <AvailabilityStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Document Upload",
      component: (
        <DocumentUploadStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      ),
    },
    {
      title: "Complete Registration",
      component: (
        <SignupComplete 
          formData={formData}
          onComplete={() => {
            toast({
              title: "Registration process completed",
              description: "You can now sign in with your provider account.",
            });
          }}
        />
      ),
    }
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      const { isValid, error } = validateStep(currentStep, formData);
      if (isValid) {
        setCurrentStep(currentStep + 1);
        setStepErrors(null);
      } else {
        setStepErrors(error);
        toast({
          title: "Please check your information",
          description: error,
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
          <SignupProgressBar currentStep={currentStep} totalSteps={steps.length} />

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
              <Link to="/provider-login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderSignup;
