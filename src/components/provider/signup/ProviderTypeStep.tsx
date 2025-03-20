
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface ProviderTypeStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const ProviderTypeStep: React.FC<ProviderTypeStepProps> = ({ formData, updateFormData }) => {
  const providerTypes = [
    { id: "physician", label: "Physician" },
    { id: "dietician", label: "Dietician" },
    { id: "pharmacist", label: "Pharmacist" },
    { id: "fitness_coach", label: "Fitness Coach" },
    { id: "psychiatrist", label: "Psychiatrist" },
    { id: "psychologist", label: "Psychologist" },
    { id: "physiotherapist", label: "Physiotherapist" },
    { id: "nurse_practitioner", label: "Nurse Practitioner" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">What type of provider are you?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the provider type that best describes your professional role
        </p>

        <RadioGroup 
          value={formData.providerType}
          onValueChange={(value) => updateFormData({ providerType: value })}
          className="space-y-2"
        >
          {providerTypes.map((type) => (
            <div
              key={type.id}
              className={`flex items-center p-4 rounded-lg border transition-colors ${
                formData.providerType === type.id 
                  ? "border-primary bg-primary/5" 
                  : "border-input hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem 
                value={type.id} 
                id={type.id} 
                className="mr-2"
              />
              <Label 
                htmlFor={type.id} 
                className="flex-1 cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ProviderTypeStep;
