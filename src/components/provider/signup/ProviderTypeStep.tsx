
import React, { useState } from "react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProviderTypeStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const ProviderTypeStep: React.FC<ProviderTypeStepProps> = ({ formData, updateFormData }) => {
  // Provider types categorized by importance
  const primaryProviders = [
    { value: "physician", label: "Physician / Doctor", description: "Medical doctors including GPs and specialists" },
    { value: "nurse_practitioner", label: "Nurse Practitioner", description: "Advanced practice registered nurses" },
    { value: "psychiatrist", label: "Psychiatrist", description: "Specialized medical doctors for mental health" },
  ];
  
  const specialistProviders = [
    { value: "psychologist", label: "Psychologist", description: "Mental health professionals specializing in therapy" },
    { value: "physiotherapist", label: "Physiotherapist", description: "Physical rehabilitation specialists" },
    { value: "dentist", label: "Dentist", description: "Oral health specialists" },
    { value: "optometrist", label: "Optometrist", description: "Eye care professionals" },
  ];
  
  const supportProviders = [
    { value: "pharmacist", label: "Pharmacist", description: "Medication experts" },
    { value: "nutritionist", label: "Nutritionist", description: "Nutrition and diet specialists" },
    { value: "social_worker", label: "Social Worker", description: "Support for social and emotional needs" },
    { value: "occupational_therapist", label: "Occupational Therapist", description: "Help with daily activities and skills" },
    { value: "speech_therapist", label: "Speech Therapist", description: "Speech and communication specialists" },
    { value: "other", label: "Other Healthcare Provider", description: "Specify your healthcare provider type" },
  ];

  const renderProviderGroup = (
    providers, 
    title, 
    icon, 
    badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default"
  ) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-medium">{title}</h3>
        <Badge variant={badgeVariant} className="ml-1">{providers.length} types</Badge>
      </div>
      <div className="space-y-2 pl-2">
        {providers.map((provider) => (
          <label
            key={provider.value}
            className={`flex items-start p-3 border rounded-md cursor-pointer transition-all ${
              formData.providerType === provider.value 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-muted-foreground/20"
            }`}
            htmlFor={provider.value}
          >
            <RadioGroupItem 
              value={provider.value} 
              id={provider.value}
              className="mt-1" 
            />
            <div className="ml-3 w-full">
              <p className="font-medium">{provider.label}</p>
              <p className="text-sm text-muted-foreground">{provider.description}</p>
              
              {provider.value === "other" && formData.providerType === "other" && (
                <div className="mt-3">
                  <Label htmlFor="customProviderType" className="text-sm">Please specify your provider type</Label>
                  <Input
                    id="customProviderType"
                    type="text"
                    className="mt-1"
                    placeholder="Enter your provider type"
                    value={formData.customProviderType || ""}
                    onChange={(e) => updateFormData({ customProviderType: e.target.value })}
                  />
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 bg-muted/20 p-4 rounded-lg border">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
          <div>
            <h3 className="font-medium">Important Information</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select the provider type that best describes your professional role. 
              This will determine the requirements for verification and the services you can offer on our platform.
            </p>
          </div>
        </div>
      </div>

      <RadioGroup
        value={formData.providerType}
        onValueChange={(value) => updateFormData({ providerType: value })}
        className="space-y-4"
      >
        {renderProviderGroup(
          primaryProviders, 
          "Primary Care Providers", 
          <ShieldCheck className="h-5 w-5 text-primary" />,
          "secondary"
        )}
        
        {renderProviderGroup(
          specialistProviders, 
          "Specialist Providers", 
          <UserCheck className="h-5 w-5 text-blue-500" />,
          "outline"
        )}
        
        {renderProviderGroup(
          supportProviders, 
          "Supporting Care Providers", 
          <UserCheck className="h-5 w-5 text-green-500" />,
          "outline"
        )}
      </RadioGroup>
    </div>
  );
};

export default ProviderTypeStep;
