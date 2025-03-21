
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { User, Mail, Lock, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface GeneralInfoStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="pl-10"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="pl-10"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            className="pl-10"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal relative pl-10",
                !formData.dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {formData.dateOfBirth ? (
                format(formData.dateOfBirth, "PPP")
              ) : (
                <span>Select date of birth</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.dateOfBirth}
              onSelect={(date) => updateFormData({ dateOfBirth: date })}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="address"
            type="text"
            placeholder="Street Address"
            className="pl-10"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Province *</Label>
          <Input
            id="province"
            type="text"
            placeholder="Province"
            value={formData.province}
            onChange={(e) => updateFormData({ province: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            type="text"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={(e) => updateFormData({ postalCode: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              className="pl-10"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
