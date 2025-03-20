
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface AvailabilityStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ formData, updateFormData }) => {
  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const handleToggleDay = (day: string, isAvailable: boolean) => {
    const updatedAvailability = {
      ...formData.availability,
      [day]: {
        ...formData.availability[day],
        isAvailable
      }
    };
    
    updateFormData({ availability: updatedAvailability });
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedAvailability = {
      ...formData.availability,
      [day]: {
        ...formData.availability[day],
        [field]: value
      }
    };
    
    updateFormData({ availability: updatedAvailability });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Weekly Availability</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set your available days and hours for appointments
        </p>

        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {days.map((day) => (
            <div 
              key={day.id}
              className={`p-4 rounded-lg border transition-all ${
                formData.availability[day.id].isAvailable 
                  ? "border-primary" 
                  : "border-input"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor={`available-${day.id}`} className="text-md font-medium">
                  {day.label}
                </Label>
                <Switch
                  id={`available-${day.id}`}
                  checked={formData.availability[day.id].isAvailable}
                  onCheckedChange={(checked) => handleToggleDay(day.id, checked)}
                />
              </div>
              
              {formData.availability[day.id].isAvailable && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`start-${day.id}`} className="text-sm">
                      Start Time
                    </Label>
                    <Input
                      id={`start-${day.id}`}
                      type="time"
                      value={formData.availability[day.id].startTime}
                      onChange={(e) => handleTimeChange(day.id, 'startTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-${day.id}`} className="text-sm">
                      End Time
                    </Label>
                    <Input
                      id={`end-${day.id}`}
                      type="time"
                      value={formData.availability[day.id].endTime}
                      onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityStep;
