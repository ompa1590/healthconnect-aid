import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck, Calendar as CalendarIcon, MapPin, AlertCircle } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addYears, isBefore, isAfter } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface HealthCardStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const HealthCardStep: React.FC<HealthCardStepProps> = ({ formData, updateFormData }) => {
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    formData.healthCardExpiry ? new Date(formData.healthCardExpiry) : undefined
  );

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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const today = new Date();
      const maxDate = addYears(today, 30);

      if (isBefore(selectedDate, today)) {
        setShowExpiryWarning(true);
        return;
      }

      if (isAfter(selectedDate, maxDate)) {
        setShowExpiryWarning(true);
        return;
      }

      setDate(selectedDate);
      setShowExpiryWarning(false);
      updateFormData({ healthCardExpiry: format(selectedDate, "yyyy-MM-dd") });
    }
  };

  const handleManualDateEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = new Date(e.target.value);
    if (!isNaN(inputDate.getTime())) {
      handleDateSelect(inputDate);
    }
  };

  const handleHealthCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 10); // Limit to 10 characters
    updateFormData({ healthCardNumber: value });
  };

  const handleVersionCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 2); // Limit to 2 characters and convert to uppercase
    updateFormData({ healthCardVersion: value });
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

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="healthCardNumber">Health Card Number *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="healthCardNumber"
              type="text"
              maxLength={10}
              placeholder="Enter your health card number"
              className="pl-10"
              value={formData.healthCardNumber}
              onChange={handleHealthCardNumber}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 w-24">
          <Label htmlFor="versionCode">Version *</Label>
          <Input
            id="versionCode"
            type="text"
            maxLength={2}
            placeholder="XX"
            className="text-center uppercase"
            value={formData.healthCardVersion || ''}
            onChange={handleVersionCode}
            required
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Format: Enter the number and version code as they appear on your provincial health card
      </p>

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
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              {date ? format(date, "MMMM d, yyyy") : <span>Select expiry date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3">
              <div className="space-y-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  onChange={handleManualDateEntry}
                  value={date ? format(date, "yyyy-MM-dd") : ''}
                  min={new Date().toISOString().split('T')[0]}
                  max={addYears(new Date(), 30).toISOString().split('T')[0]}
                />
                <div className="border-t pt-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      const maxDate = addYears(today, 30);
                      return isBefore(date, today) || isAfter(date, maxDate);
                    }}
                    initialFocus
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {showExpiryWarning && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a valid expiry date between today and 30 years from now.
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
