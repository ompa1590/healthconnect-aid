
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText } from "lucide-react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface RegistrationNumberStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const RegistrationNumberStep: React.FC<RegistrationNumberStepProps> = ({ formData, updateFormData }) => {
  // Get the appropriate label based on provider type
  const getRegistrationLabel = () => {
    switch (formData.providerType) {
      case "physician":
        return "CPSO Number";
      case "dietician":
        return "Dietitian Registration Number";
      case "pharmacist":
        return "CCAP Number";
      case "physiotherapist":
        return "Physiotherapy Registration Number";
      case "other":
        return formData.customProviderType ? `${formData.customProviderType} Registration Number` : "Professional Registration Number";
      default:
        return "Professional Registration Number";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Professional Registration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide your professional registration details for verification
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">{getRegistrationLabel()} *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="registrationNumber"
                type="text"
                placeholder="Enter your registration number"
                className="pl-10"
                value={formData.registrationNumber}
                onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.providerType === "physician" && (
            <div className="space-y-2">
              <Label htmlFor="registrationExpiry">Registration Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal relative pl-10",
                      !formData.registrationExpiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {formData.registrationExpiry ? (
                      format(formData.registrationExpiry, "PPP")
                    ) : (
                      <span>Select expiry date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.registrationExpiry}
                    onSelect={(date) => updateFormData({ registrationExpiry: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationNumberStep;
