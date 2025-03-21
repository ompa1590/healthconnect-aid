import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import GeneralInfoStep from "@/components/provider/signup/GeneralInfoStep";
import RegistrationNumberStep from "@/components/provider/signup/RegistrationNumberStep";
import ProviderTypeStep from "@/components/provider/signup/ProviderTypeStep";
import SpecializationStep from "@/components/provider/signup/SpecializationStep";
import ServicesOfferedStep from "@/components/provider/signup/ServicesOfferedStep";
import DocumentUploadStep from "@/components/provider/signup/DocumentUploadStep";
import BiographyStep from "@/components/provider/signup/BiographyStep";
import SignupComplete from "@/components/provider/signup/SignupComplete";
import AvailabilityStep from "@/components/provider/signup/AvailabilityStep";
import { CheckIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";

interface DayAvailability {
  isAvailable: boolean;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
}

interface WeeklyAvailability {
  [key: string]: DayAvailability;
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface ProviderFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: string;

  address: string;
  city: string;
  province: string;
  postalCode: string;

  providerType: string;
  registrationNumber: string;
  registrationExpiry?: Date;
  specializations: string[] | string;
  servicesOffered: string[];
  biography: string;
  
  documents: File[];
  profilePicture?: File;
  certificateFile?: File;
  
  availability: WeeklyAvailability;
}

const defaultAvailability = {
  monday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  tuesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  wednesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  thursday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  friday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  saturday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
  sunday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
};

const ProviderSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProviderFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: undefined,
    gender: undefined,
    address: "",
    city: "",
    province: "",
    postalCode: "",
    providerType: "",
    registrationNumber: "",
    specializations: [],
    servicesOffered: [],
    biography: "",
    documents: [],
    availability: defaultAvailability,
  });
  const [stepErrors, setStepErrors] = useState<string | null>(null);
  
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

  const validateCurrentStep = (): boolean => {
    setStepErrors(null);
    
    switch (currentStep) {
      case 0:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setStepErrors("Please fill in all required fields");
          return false;
        }
        if (formData.password.length < 8) {
          setStepErrors("Password must be at least 8 characters");
          return false;
        }
        break;
        
      case 1:
        if (!formData.providerType) {
          setStepErrors("Please select a provider type");
          return false;
        }
        break;
        
      case 2:
        if (!formData.registrationNumber) {
          setStepErrors("Registration number is required");
          return false;
        }
        if (formData.providerType === "physician" && !formData.registrationExpiry) {
          setStepErrors("Registration expiry date is required for physicians");
          return false;
        }
        break;
        
      case 3:
        if (formData.providerType === "physician" && formData.specializations.length === 0) {
          setStepErrors("Please select at least one specialization");
          return false;
        }
        break;
        
      case 4:
        if (formData.servicesOffered.length === 0) {
          setStepErrors("Please select at least one service");
          return false;
        }
        break;
        
      case 5:
        if (!formData.biography || formData.biography.trim().length < 50) {
          setStepErrors("Please provide a biography (minimum 50 characters)");
          return false;
        }
        break;
        
      case 6:
        const hasAvailability = Object.values(formData.availability).some(day => day.isAvailable);
        if (!hasAvailability) {
          setStepErrors("Please set availability for at least one day");
          return false;
        }
        break;
        
      case 7:
        if (!formData.profilePicture) {
          setStepErrors("Please upload a profile picture");
          return false;
        }
        if (!formData.certificateFile) {
          setStepErrors("Please upload your professional certificate");
          return false;
        }
        break;
    }
    
    return true;
  };

  const steps = [
    {
      title: "General Information",
      component: (
        <GeneralInfoStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Provider Type",
      component: (
        <ProviderTypeStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Registration Number",
      component: (
        <RegistrationNumberStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Specialization",
      component: (
        <SpecializationStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
          providerType={formData.providerType}
        />
      ),
    },
    {
      title: "Services Offered",
      component: (
        <ServicesOfferedStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
          providerType={formData.providerType}
        />
      ),
    },
    {
      title: "Professional Biography",
      component: (
        <BiographyStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Availability",
      component: (
        <AvailabilityStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
        />
      ),
    },
    {
      title: "Document Upload",
      component: (
        <DocumentUploadStep 
          formData={formData} 
          updateFormData={(data) => setFormData({ ...formData, ...data })} 
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
