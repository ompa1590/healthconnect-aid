
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Camera, File, Pen, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import SignatureCanvas from "react-signature-canvas";

const ProviderSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [registrationExpiry, setRegistrationExpiry] = useState<Date | undefined>(undefined);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [availability, setAvailability] = useState<any>({
    monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  });
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const providerType = watch("providerType");

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Set provider data from user metadata
        const providerData = userData.user.user_metadata;
        setProvider(providerData);
        
        // Set form values
        setValue("firstName", providerData.firstName || "");
        setValue("lastName", providerData.lastName || "");
        setValue("email", userData.user.email || "");
        setValue("address", providerData.address || "");
        setValue("city", providerData.city || "");
        setValue("province", providerData.province || "");
        setValue("postalCode", providerData.postalCode || "");
        setValue("phoneNumber", providerData.phoneNumber || "");
        setValue("providerType", providerData.providerType || "");
        setValue("registrationNumber", providerData.registrationNumber || "");
        setValue("biography", providerData.biography || "");
        
        // Set date of birth if available
        if (providerData.dateOfBirth) {
          setDateOfBirth(new Date(providerData.dateOfBirth));
        }
        
        // Set registration expiry if available
        if (providerData.registrationExpiry) {
          setRegistrationExpiry(new Date(providerData.registrationExpiry));
        }
        
        // Set specializations if available
        if (providerData.specialization) {
          const specs = providerData.specialization.split(',');
          setSpecializations(specs);
        }
        
        // Set services offered if available
        if (providerData.servicesOffered) {
          const services = providerData.servicesOffered.split(',');
          setServicesOffered(services);
        }
        
        // Set availability if available
        if (providerData.availability) {
          try {
            const availabilityData = JSON.parse(providerData.availability);
            setAvailability(availabilityData);
          } catch (error) {
            console.error("Error parsing availability:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
      toast({
        title: "Error fetching profile",
        description: "There was an error loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          providerType: data.providerType,
          registrationNumber: data.registrationNumber,
          registrationExpiry: registrationExpiry ? registrationExpiry.toISOString() : null,
          specialization: specializations.join(','),
          servicesOffered: servicesOffered.join(','),
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          phoneNumber: data.phoneNumber,
          biography: data.biography,
          availability: JSON.stringify(availability),
          dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
          hasSignature: signatureFile ? true : false,
        }
      });
      
      if (error) throw error;
      
      // Refresh provider data
      await fetchProviderData();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCertificateFile(file);
      setCertificateFileName(file.name);
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef && !signatureRef.isEmpty()) {
      // Get the signature as a PNG data URL
      const dataURL = signatureRef.toDataURL('image/png');
      
      // Convert data URL to a File object
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "provider-signature.png", { type: "image/png" });
      
      // Update signature file state
      setSignatureFile(file);
      
      // Set preview
      setSignaturePreview(dataURL);
    }
  };

  const handleClearSignature = () => {
    if (signatureRef) {
      signatureRef.clear();
      setSignaturePreview(null);
      setSignatureFile(null);
    }
  };

  const handleToggleDay = (day: string, isAvailable: boolean) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        isAvailable
      }
    });
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value
      }
    });
  };

  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    if (checked) {
      setSpecializations([...specializations, specializationId]);
    } else {
      setSpecializations(specializations.filter(id => id !== specializationId));
    }
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setServicesOffered([...servicesOffered, serviceId]);
    } else {
      setServicesOffered(servicesOffered.filter(id => id !== serviceId));
    }
  };

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

  const providerTypes = [
    { id: "physician", label: "Physician" },
    { id: "dietician", label: "Dietician" },
    { id: "pharmacist", label: "Pharmacist" },
    { id: "fitness_coach", label: "Fitness Coach" },
    { id: "psychiatrist", label: "Psychiatrist" },
    { id: "psychologist", label: "Psychologist" },
    { id: "physiotherapist", label: "Physiotherapist" },
    { id: "nurse_practitioner", label: "Nurse Practitioner" },
  ];

  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Provider Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="provider">Provider Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName", { required: true })} />
                    {errors.firstName && <p className="text-destructive text-sm">First name is required</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName", { required: true })} />
                    {errors.lastName && <p className="text-destructive text-sm">Last name is required</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register("email")} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" {...register("phoneNumber")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register("address")} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input id="province" {...register("province")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" {...register("postalCode")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="provider">
            <Card>
              <CardHeader>
                <CardTitle>Provider Information</CardTitle>
                <CardDescription>Update your professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Provider Type</Label>
                  <RadioGroup 
                    value={providerType}
                    onValueChange={(value) => setValue("providerType", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {providerTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`flex items-center p-3 rounded-lg border transition-colors ${
                          providerType === type.id 
                            ? "border-primary bg-primary/5" 
                            : "border-input hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem 
                          value={type.id} 
                          id={`provider-type-${type.id}`} 
                          className="mr-2"
                        />
                        <Label 
                          htmlFor={`provider-type-${type.id}`} 
                          className="flex-1 cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input id="registrationNumber" {...register("registrationNumber")} />
                </div>

                {providerType === "physician" && (
                  <div className="space-y-2">
                    <Label htmlFor="registrationExpiry">Registration Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !registrationExpiry && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {registrationExpiry ? format(registrationExpiry, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={registrationExpiry}
                          onSelect={setRegistrationExpiry}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {getSpecializations().length > 0 && (
                  <div className="space-y-4">
                    <Label>Specializations</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getSpecializations().map((specialization) => (
                        <div
                          key={specialization.id}
                          className={`flex items-center space-x-2 p-3 rounded-md border ${
                            specializations.includes(specialization.id) 
                              ? "border-primary bg-primary/5" 
                              : "border-input"
                          }`}
                        >
                          <Checkbox
                            id={`specialization-${specialization.id}`}
                            checked={specializations.includes(specialization.id)}
                            onCheckedChange={(checked) => 
                              handleSpecializationChange(specialization.id, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`specialization-${specialization.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {specialization.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="biography">Professional Biography</Label>
                  <Textarea
                    id="biography"
                    {...register("biography")}
                    className="min-h-32"
                    placeholder="Share information about your education, experience, specialties, and approach to care..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
                <CardDescription>Update the services you offer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Services Offered</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getServices().map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center space-x-2 p-3 rounded-md border ${
                          servicesOffered.includes(service.id) 
                            ? "border-primary bg-primary/5" 
                            : "border-input"
                        }`}
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={servicesOffered.includes(service.id)}
                          onCheckedChange={(checked) => 
                            handleServiceChange(service.id, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Update your available days and hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {days.map((day) => (
                    <div 
                      key={day.id}
                      className={`p-4 rounded-lg border transition-all ${
                        availability[day.id].isAvailable 
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
                          checked={availability[day.id].isAvailable}
                          onCheckedChange={(checked) => handleToggleDay(day.id, checked)}
                        />
                      </div>
                      
                      {availability[day.id].isAvailable && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor={`start-${day.id}`} className="text-sm">
                              Start Time
                            </Label>
                            <Input
                              id={`start-${day.id}`}
                              type="time"
                              value={availability[day.id].startTime}
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
                              value={availability[day.id].endTime}
                              onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Signature</CardTitle>
                <CardDescription>Update your profile picture, professional documents, and signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      {profilePictureURL ? (
                        <img 
                          src={profilePictureURL} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-32 h-32 bg-muted rounded-full">
                          <Camera className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                      <Label 
                        htmlFor="profile-picture" 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer"
                      >
                        <Pen className="h-4 w-4" />
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Professional Certificate</Label>
                  
                  {certificateFileName ? (
                    <div className="p-4 border rounded-md bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center">
                        <File className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px]">{certificateFileName}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setCertificateFile(null);
                          setCertificateFileName(null);
                        }}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        id="certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleCertificateChange}
                      />
                      <Label 
                        htmlFor="certificate" 
                        className="flex flex-col items-center border-2 border-dashed border-muted-foreground/20 rounded-md p-8 cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <File className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload your certificate (PDF, JPG, PNG)
                        </p>
                        <Button variant="secondary" type="button" size="sm">
                          Select File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>E-Signature</Label>
                  
                  {signaturePreview ? (
                    <div className="border rounded-md p-4 bg-white relative">
                      <img 
                        src={signaturePreview} 
                        alt="Your signature" 
                        className="max-h-48 mx-auto"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleClearSignature}
                        type="button"
                      >
                        <X className="h-4 w-4 mr-1" /> Clear
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-4 bg-white">
                        <SignatureCanvas
                          ref={(ref) => setSignatureRef(ref)}
                          canvasProps={{
                            className: 'w-full h-48',
                          }}
                          backgroundColor="white"
                        />
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={handleClearSignature}
                          type="button"
                        >
                          <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                        
                        <Button
                          onClick={handleSaveSignature}
                          type="button"
                        >
                          <Save className="h-4 w-4 mr-1" /> Save Signature
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    This signature will be used for digital prescriptions and official documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" size="lg">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default ProviderSettings;
