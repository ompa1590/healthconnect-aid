
import { useState } from "react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

const defaultAvailability = {
  monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
};

export const useProviderSignupForm = () => {
  const [formData, setFormData] = useState<ProviderFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
    providerType: "",
    registrationNumber: "",
    registrationExpiry: undefined,
    specializations: [],
    servicesOffered: [],
    biography: "",
    availability: defaultAvailability,
  });

  const updateFormData = (data: Partial<ProviderFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return { formData, updateFormData };
};
