
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";

interface HealthCardStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const HealthCardStep: React.FC<HealthCardStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 mb-6">
        <div className="flex items-start mb-2">
          <ShieldCheck className="text-primary h-5 w-5 mr-2 mt-1" />
          <h3 className="text-lg font-medium">Secure Health Card Verification</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Your health card information is encrypted and securely stored. We use this information 
          to verify your eligibility for healthcare services and to process insurance claims when applicable.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="healthCardNumber">Health Card Number *</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="healthCardNumber"
            type="text"
            placeholder="Enter your health card number"
            className="pl-10"
            value={formData.healthCardNumber}
            onChange={(e) => updateFormData({ healthCardNumber: e.target.value })}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Format: Enter the number exactly as it appears on your provincial health card
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm">Your information is encrypted and secure</span>
      </div>
    </div>
  );
};

export default HealthCardStep;
