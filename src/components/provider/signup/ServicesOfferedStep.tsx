
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface ServicesOfferedStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  providerType: string;
}

const ServicesOfferedStep: React.FC<ServicesOfferedStepProps> = ({ 
  formData, 
  updateFormData, 
  providerType 
}) => {
  // Define services based on provider type
  const getServices = () => {
    const commonServices = [
      { id: "virtual_consultation", label: "Virtual Consultation" },
      { id: "follow_up_appointment", label: "Follow-up Appointment" },
    ];
    
    switch (providerType) {
      case "physician":
        return [
          ...commonServices,
          { id: "prescription_renewal", label: "Prescription Renewal" },
          { id: "lab_order", label: "Lab Order" },
          { id: "referral_to_specialist", label: "Referral to Specialist" },
          { id: "diagnostic_imaging", label: "Diagnostic Imaging" },
          { id: "preventive_care", label: "Preventive Care" },
          { id: "chronic_disease_management", label: "Chronic Disease Management" },
        ];
      case "dietician":
        return [
          ...commonServices,
          { id: "nutrition_assessment", label: "Nutrition Assessment" },
          { id: "meal_planning", label: "Meal Planning" },
          { id: "diet_therapy", label: "Diet Therapy" },
          { id: "nutrition_education", label: "Nutrition Education" },
          { id: "weight_management", label: "Weight Management" },
        ];
      case "pharmacist":
        return [
          ...commonServices,
          { id: "medication_review", label: "Medication Review" },
          { id: "prescription_renewal", label: "Prescription Renewal" },
          { id: "medication_counseling", label: "Medication Counseling" },
          { id: "immunization", label: "Immunization" },
          { id: "minor_ailment_assessment", label: "Minor Ailment Assessment" },
        ];
      case "fitness_coach":
        return [
          ...commonServices,
          { id: "fitness_assessment", label: "Fitness Assessment" },
          { id: "exercise_prescription", label: "Exercise Prescription" },
          { id: "workout_planning", label: "Workout Planning" },
          { id: "weight_management", label: "Weight Management" },
          { id: "injury_prevention", label: "Injury Prevention" },
        ];
      case "psychiatrist":
      case "psychologist":
        return [
          ...commonServices,
          { id: "mental_health_assessment", label: "Mental Health Assessment" },
          { id: "therapy_session", label: "Therapy Session" },
          { id: "medication_management", label: "Medication Management" },
          { id: "crisis_intervention", label: "Crisis Intervention" },
        ];
      case "physiotherapist":
        return [
          ...commonServices,
          { id: "physical_assessment", label: "Physical Assessment" },
          { id: "manual_therapy", label: "Manual Therapy" },
          { id: "exercise_prescription", label: "Exercise Prescription" },
          { id: "rehabilitation_program", label: "Rehabilitation Program" },
          { id: "pain_management", label: "Pain Management" },
        ];
      case "nurse_practitioner":
        return [
          ...commonServices,
          { id: "health_assessment", label: "Health Assessment" },
          { id: "prescription_renewal", label: "Prescription Renewal" },
          { id: "immunization", label: "Immunization" },
          { id: "chronic_disease_management", label: "Chronic Disease Management" },
          { id: "health_education", label: "Health Education" },
        ];
      default:
        return commonServices;
    }
  };

  const services = getServices();
  
  // Handle checkbox change
  const handleCheckboxChange = (serviceId: string, checked: boolean) => {
    let updatedServices = [...formData.servicesOffered];
    
    if (checked) {
      updatedServices.push(serviceId);
    } else {
      updatedServices = updatedServices.filter(id => id !== serviceId);
    }
    
    updateFormData({ servicesOffered: updatedServices });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Services Offered</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all services that you will provide through Vyra Health
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
          {services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center space-x-2 p-3 rounded-md border ${
                formData.servicesOffered.includes(service.id) 
                  ? "border-primary bg-primary/5" 
                  : "border-input"
              }`}
            >
              <Checkbox
                id={service.id}
                checked={formData.servicesOffered.includes(service.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(service.id, checked as boolean)
                }
              />
              <Label
                htmlFor={service.id}
                className="flex-1 cursor-pointer"
              >
                {service.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesOfferedStep;
