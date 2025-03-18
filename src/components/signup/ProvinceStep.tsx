
import React from "react";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface ProvinceStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const ProvinceStep: React.FC<ProvinceStepProps> = ({ formData, updateFormData }) => {
  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 mb-6">
        <h3 className="text-lg font-medium mb-2">Why we need your province</h3>
        <p className="text-muted-foreground text-sm">
          Healthcare regulations vary across Canada. We need to know your province to ensure 
          we provide services in compliance with your local healthcare regulations and connect 
          you with licensed providers in your region.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="province">Select Your Province *</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <MapPin className="text-muted-foreground h-5 w-5" />
          </div>
          <Select 
            value={formData.province} 
            onValueChange={(value) => updateFormData({ province: value })}
            required
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Your province information helps us ensure compliance with 
          regional healthcare regulations and connect you with local providers.
        </p>
      </div>
    </div>
  );
};

export default ProvinceStep;
