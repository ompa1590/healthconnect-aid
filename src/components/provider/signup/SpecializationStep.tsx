
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface SpecializationStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  providerType: string;
}

const SpecializationStep: React.FC<SpecializationStepProps> = ({ 
  formData, 
  updateFormData, 
  providerType 
}) => {
  // Define specializations based on provider type
  const getSpecializations = () => {
    switch (providerType) {
      case "physician":
        return [
          { id: "family_medicine", label: "Family Medicine" },
          { id: "internal_medicine", label: "Internal Medicine" },
          { id: "cardiology", label: "Cardiology" },
          { id: "dermatology", label: "Dermatology" },
          { id: "endocrinology", label: "Endocrinology" },
          { id: "gastroenterology", label: "Gastroenterology" },
          { id: "neurology", label: "Neurology" },
          { id: "obstetrics_gynecology", label: "Obstetrics & Gynecology" },
          { id: "oncology", label: "Oncology" },
          { id: "pediatrics", label: "Pediatrics" },
          { id: "psychiatry", label: "Psychiatry" },
          { id: "radiology", label: "Radiology" },
          { id: "surgery", label: "Surgery" },
          { id: "urology", label: "Urology" },
          { id: "other", label: "Other" },
        ];
      case "dietician":
        return [
          { id: "clinical_nutrition", label: "Clinical Nutrition" },
          { id: "sports_nutrition", label: "Sports Nutrition" },
          { id: "pediatric_nutrition", label: "Pediatric Nutrition" },
          { id: "geriatric_nutrition", label: "Geriatric Nutrition" },
          { id: "diabetes_management", label: "Diabetes Management" },
          { id: "weight_management", label: "Weight Management" },
          { id: "other", label: "Other" },
        ];
      case "pharmacist":
        return [
          { id: "community_pharmacy", label: "Community Pharmacy" },
          { id: "hospital_pharmacy", label: "Hospital Pharmacy" },
          { id: "clinical_pharmacy", label: "Clinical Pharmacy" },
          { id: "ambulatory_care", label: "Ambulatory Care" },
          { id: "long_term_care", label: "Long-term Care" },
          { id: "other", label: "Other" },
        ];
      default:
        return [];
    }
  };

  const specializations = getSpecializations();
  
  // Handle checkbox change
  const handleCheckboxChange = (specializationId: string, checked: boolean) => {
    let updatedSpecializations = [...formData.specializations];
    
    if (checked) {
      updatedSpecializations.push(specializationId);
    } else {
      updatedSpecializations = updatedSpecializations.filter(id => id !== specializationId);
    }
    
    updateFormData({ specializations: updatedSpecializations });
  };

  if (specializations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Specialization</h3>
          <p className="text-sm text-muted-foreground">
            No specializations required for this provider type. Click Next to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Specialization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all specializations that apply to your practice
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
          {specializations.map((specialization) => (
            <div
              key={specialization.id}
              className={`flex items-center space-x-2 p-3 rounded-md border ${
                formData.specializations.includes(specialization.id) 
                  ? "border-primary bg-primary/5" 
                  : "border-input"
              }`}
            >
              <Checkbox
                id={specialization.id}
                checked={formData.specializations.includes(specialization.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(specialization.id, checked as boolean)
                }
              />
              <Label
                htmlFor={specialization.id}
                className="flex-1 cursor-pointer"
              >
                {specialization.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecializationStep;
