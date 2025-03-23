
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck, Calendar, MapPin, AlertCircle } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HealthCardStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const HealthCardStep: React.FC<HealthCardStepProps> = ({ formData, updateFormData }) => {
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  
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
  
  const handleExpiryDate = (date: Date | undefined) => {
    if (date) {
      updateFormData({ healthCardExpiry: format(date, "yyyy-MM-dd") });
      
      // Check if expiry date is in the past
      const today = new Date();
      setShowExpiryWarning(date < today);
    } else {
      updateFormData({ healthCardExpiry: '' });
      setShowExpiryWarning(false);
    }
  };

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
      
      <div className="space-y-2">
        <Label htmlFor="healthCardProvince">Issuing Province/Territory *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground h-5 w-5" />
          <Select 
            value={formData.healthCardProvince} 
            onValueChange={(value) => updateFormData({ healthCardProvince: value })}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select province/territory" />
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
      
      <div className="space-y-2">
        <Label htmlFor="healthCardExpiry">Expiry Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="healthCardExpiry"
              className={cn(
                "w-full justify-start text-left font-normal relative pl-10",
                !formData.healthCardExpiry && "text-muted-foreground"
              )}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              {formData.healthCardExpiry ? (
                format(new Date(formData.healthCardExpiry), "MMMM d, yyyy")
              ) : (
                <span>Select expiry date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 pointer-events-auto">
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.healthCardExpiry}
                onChange={(e) => handleExpiryDate(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {showExpiryWarning && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your health card appears to be expired. Please make sure your coverage is up to date, especially if you've recently moved.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="validCard"
          checked={formData.isHealthCardValid}
          onCheckedChange={(checked) => 
            updateFormData({ isHealthCardValid: checked === true })
          }
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="validCard"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm my health card is valid and not expired
          </label>
          <p className="text-xs text-muted-foreground">
            This confirmation helps ensure your eligibility for healthcare services
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm">Your information is encrypted and secure</span>
      </div>
    </div>
  );
};

export default HealthCardStep;
