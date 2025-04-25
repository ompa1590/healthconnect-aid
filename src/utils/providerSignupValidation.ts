
import { ProviderFormData } from "@/pages/login/ProviderSignup";

export const validateStep = (
  step: number, 
  formData: ProviderFormData
): { isValid: boolean; error: string | null } => {
  switch (step) {
    case 0:
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        return { isValid: false, error: "Please fill in all required fields" };
      }
      if (formData.password.length < 8) {
        return { isValid: false, error: "Password must be at least 8 characters" };
      }
      break;
      
    case 1:
      if (!formData.providerType) {
        return { isValid: false, error: "Please select a provider type" };
      }
      break;
      
    case 2:
      if (!formData.registrationNumber) {
        return { isValid: false, error: "Registration number is required" };
      }
      if (formData.providerType === "physician" && !formData.registrationExpiry) {
        return { isValid: false, error: "Registration expiry date is required for physicians" };
      }
      break;
      
    case 3:
      if (formData.providerType === "physician" && formData.specializations.length === 0) {
        return { isValid: false, error: "Please select at least one specialization" };
      }
      break;
      
    case 4:
      if (formData.servicesOffered.length === 0) {
        return { isValid: false, error: "Please select at least one service" };
      }
      break;
      
    case 5:
      if (!formData.biography || formData.biography.trim().length < 50) {
        return { isValid: false, error: "Please provide a biography (minimum 50 characters)" };
      }
      break;
      
    case 6:
      const hasAvailability = Object.values(formData.availability).some(day => day.isAvailable);
      if (!hasAvailability) {
        return { isValid: false, error: "Please set availability for at least one day" };
      }
      break;
      
    case 7:
      if (!formData.profilePicture) {
        return { isValid: false, error: "Please upload a profile picture" };
      }
      if (!formData.certificateFile) {
        return { isValid: false, error: "Please upload your professional certificate" };
      }
      if (!formData.signatureImage) {
        return { isValid: false, error: "Please provide your e-signature" };
      }
      if (formData.certificateSummary && !formData.certificateVerified) {
        return { isValid: false, error: "Please verify that the certificate summary is accurate" };
      }
      break;
  }
  
  return { isValid: true, error: null };
};
