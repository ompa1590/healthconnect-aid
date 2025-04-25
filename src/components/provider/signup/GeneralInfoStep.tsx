import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { format } from "date-fns";

interface GeneralInfoStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ formData, updateFormData }) => {
  const handleProviderTypeChange = (value: string) => {
    updateFormData({ 
      providerType: value,
      customProviderType: value === 'other' ? formData.customProviderType : ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">General Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us a bit about your professional background
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="providerType">Provider Type *</Label>
            <Select onValueChange={handleProviderTypeChange} value={formData.providerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physician">Physician</SelectItem>
                <SelectItem value="dietician">Dietician</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="physiotherapist">Physiotherapist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.providerType === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customProviderType">Specify Provider Type *</Label>
              <Input
                id="customProviderType"
                type="text"
                placeholder="e.g., Psychologist, Nurse Practitioner"
                value={formData.customProviderType}
                onChange={(e) => updateFormData({ customProviderType: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              placeholder="Enter years of experience"
              value={formData.yearsOfExperience}
              onChange={(e) => updateFormData({ yearsOfExperience: e.target.value })}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
