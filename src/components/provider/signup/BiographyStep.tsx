
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface BiographyStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const BiographyStep: React.FC<BiographyStepProps> = ({ formData, updateFormData }) => {
  const minChars = 50;
  const maxChars = 1000;
  const charCount = formData.biography.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Professional Biography</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Write a short bio highlighting your experience, specialties, and approach to patient care
        </p>

        <div className="space-y-2">
          <Label htmlFor="biography">Biography *</Label>
          <Textarea
            id="biography"
            placeholder="Share information about your education, experience, specialties, and approach to care..."
            className="min-h-[200px] resize-none"
            value={formData.biography}
            onChange={(e) => updateFormData({ biography: e.target.value })}
          />
          
          <div className="flex justify-between text-xs">
            <span 
              className={`${
                charCount < minChars ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              Minimum {minChars} characters
            </span>
            <span 
              className={`${
                charCount > maxChars ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {charCount}/{maxChars}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiographyStep;
