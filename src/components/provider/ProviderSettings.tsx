
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Camera, FileSignature, User, Calendar as CalendarIcon, Mail, MapPin, Phone, Check, RefreshCw, X, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProviderSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);

  // Provider data states
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: undefined as Date | undefined,
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
    providerType: "",
    registrationNumber: "",
    registrationExpiry: undefined as Date | undefined,
    specializations: [] as string[],
    servicesOffered: [] as string[],
    biography: "",
    availability: {
      monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
      sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    },
    profilePicture: null as File | null,
    certificateFile: null as File | null,
    signatureFile: null as File | null,
  });

  // Load user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.user_metadata) {
          const metadata = user.user_metadata;
          
          setUserData({
            firstName: metadata.firstName || "",
            lastName: metadata.lastName || "",
            email: user.email || "",
            dateOfBirth: metadata.dateOfBirth ? new Date(metadata.dateOfBirth) : undefined,
            address: metadata.address || "",
            city: metadata.city || "",
            province: metadata.province || "",
            postalCode: metadata.postalCode || "",
            phoneNumber: metadata.phoneNumber || "",
            providerType: metadata.providerType || "",
            registrationNumber: metadata.registrationNumber || "",
            registrationExpiry: metadata.registrationExpiry ? new Date(metadata.registrationExpiry) : undefined,
            specializations: metadata.specialization ? metadata.specialization.split(',') : [],
            servicesOffered: metadata.servicesOffered ? metadata.servicesOffered.split(',') : [],
            biography: metadata.biography || "",
            availability: metadata.availability ? JSON.parse(metadata.availability) : {
              monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
            },
            profilePicture: null,
            certificateFile: null,
            signatureFile: null,
          });

          // Fetch profile picture
          if (user.id) {
            try {
              const { data: profileData } = await supabase.storage
                .from('provider-files')
                .createSignedUrl(`${user.id}/profile-picture.jpg`, 60);
              
              if (profileData) {
                setProfilePreview(profileData.signedUrl);
              }
            } catch (error) {
              console.log('No profile picture found or error fetching it');
            }

            // Check if certificate exists
            try {
              const { data: certData } = await supabase.storage
                .from('provider-files')
                .list(`${user.id}`, {
                  search: 'certificate'
                });
              
              if (certData && certData.length > 0) {
                setCertificateFileName(certData[0].name);
              }
            } catch (error) {
              console.log('No certificate found or error fetching it');
            }

            // Check if signature exists and load it into canvas
            try {
              const { data: signatureData } = await supabase.storage
                .from('provider-files')
                .createSignedUrl(`${user.id}/signature.png`, 60);
              
              if (signatureData && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  const img = new Image();
                  img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                    setHasSignature(true);
                  };
                  img.src = signatureData.signedUrl;
                }
              }
            } catch (error) {
              console.log('No signature found or error fetching it');
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);

  // Signature canvas methods
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position for both mouse and touch events
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    
    setHasSignature(true);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    
    if (hasSignature) {
      saveSignature();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setUserData({...userData, signatureFile: null});
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "signature.png", { type: "image/png" });
        setUserData({...userData, signatureFile: file});
      }
    });
  };

  // Handle file changes
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserData({...userData, profilePicture: file});
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserData({...userData, certificateFile: file});
      setCertificateFileName(file.name);
    }
  };

  // Handle checkbox changes for specializations and services
  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    let updatedSpecializations = [...userData.specializations];
    
    if (checked) {
      updatedSpecializations.push(specializationId);
    } else {
      updatedSpecializations = updatedSpecializations.filter(id => id !== specializationId);
    }
    
    setUserData({...userData, specializations: updatedSpecializations});
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    let updatedServices = [...userData.servicesOffered];
    
    if (checked) {
      updatedServices.push(serviceId);
    } else {
      updatedServices = updatedServices.filter(id => id !== serviceId);
    }
    
    setUserData({...userData, servicesOffered: updatedServices});
  };

  // Handle availability changes
  const handleToggleDay = (day: string, isAvailable: boolean) => {
    const updatedAvailability = {
      ...userData.availability,
      [day]: {
        ...userData.availability[day],
        isAvailable
      }
    };
    
    setUserData({...userData, availability: updatedAvailability});
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedAvailability = {
      ...userData.availability,
      [day]: {
        ...userData.availability[day],
        [field]: value
      }
    };
    
    setUserData({...userData, availability: updatedAvailability});
  };

  // Provider type options
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

  // Days of the week
  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  // Define specializations based on provider type
  const getSpecializations = () => {
    switch (userData.providerType) {
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
    
    switch (userData.providerType) {
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

  // Get the appropriate label for registration number based on provider type
  const getRegistrationLabel = () => {
    switch (userData.providerType) {
      case "physician":
        return "CPSO Number";
      case "dietician":
        return "Dietitian Registration Number";
      case "pharmacist":
        return "CCAP Number";
      case "physiotherapist":
        return "Physiotherapy Registration Number";
      default:
        return "Professional Registration Number";
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.toISOString() : null,
          address: userData.address,
          city: userData.city,
          province: userData.province,
          postalCode: userData.postalCode,
          phoneNumber: userData.phoneNumber,
          providerType: userData.providerType,
          registrationNumber: userData.registrationNumber,
          registrationExpiry: userData.registrationExpiry ? userData.registrationExpiry.toISOString() : null,
          specialization: userData.specializations.join(','),
          servicesOffered: userData.servicesOffered.join(','),
          biography: userData.biography,
          availability: JSON.stringify(userData.availability),
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Upload files if they exist
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const userId = user.id;
        
        // Upload profile picture
        if (userData.profilePicture) {
          const fileExt = userData.profilePicture.name.split('.').pop();
          const filePath = `${userId}/profile-picture.${fileExt}`;
          
          await supabase.storage
            .from('provider-files')
            .upload(filePath, userData.profilePicture, { 
              upsert: true 
            });
        }
        
        // Upload certificate
        if (userData.certificateFile) {
          const fileExt = userData.certificateFile.name.split('.').pop();
          const filePath = `${userId}/certificate.${fileExt}`;
          
          await supabase.storage
            .from('provider-files')
            .upload(filePath, userData.certificateFile, {
              upsert: true
            });
        }
        
        // Upload signature
        if (userData.signatureFile) {
          const filePath = `${userId}/signature.png`;
          
          await supabase.storage
            .from('provider-files')
            .upload(filePath, userData.signatureFile, {
              upsert: true
            });
        }
      }
      
      toast({
        title: "Success",
        description: "Your settings have been updated",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save your settings",
        variant: "destructive"
      });
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and provider settings
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <div className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="provider">Provider Info</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>
        
        {/* General Information Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstName"
                        type="text"
                        className="pl-10"
                        value={userData.firstName}
                        onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="lastName"
                        type="text"
                        className="pl-10"
                        value={userData.lastName}
                        onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={userData.email}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal relative pl-10",
                          !userData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        {userData.dateOfBirth ? (
                          format(userData.dateOfBirth, "PPP")
                        ) : (
                          <span>Select date of birth</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={userData.dateOfBirth}
                        onSelect={(date) => setUserData({...userData, dateOfBirth: date})}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="address"
                      type="text"
                      className="pl-10"
                      value={userData.address}
                      onChange={(e) => setUserData({...userData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={userData.city}
                      onChange={(e) => setUserData({...userData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      type="text"
                      value={userData.province}
                      onChange={(e) => setUserData({...userData, province: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={userData.postalCode}
                      onChange={(e) => setUserData({...userData, postalCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        className="pl-10"
                        value={userData.phoneNumber}
                        onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provider Information Tab */}
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Provider Information</CardTitle>
              <CardDescription>Update your professional details and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Provider Type</Label>
                  <RadioGroup 
                    value={userData.providerType}
                    onValueChange={(value) => setUserData({...userData, providerType: value})}
                    className="space-y-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {providerTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`flex items-center p-4 rounded-lg border transition-colors ${
                            userData.providerType === type.id 
                              ? "border-primary bg-primary/5" 
                              : "border-input hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem 
                            value={type.id} 
                            id={`provider-${type.id}`} 
                            className="mr-2"
                          />
                          <Label 
                            htmlFor={`provider-${type.id}`} 
                            className="flex-1 cursor-pointer"
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">{getRegistrationLabel()}</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter your registration number"
                    value={userData.registrationNumber}
                    onChange={(e) => setUserData({...userData, registrationNumber: e.target.value})}
                  />
                </div>

                {userData.providerType === "physician" && (
                  <div className="space-y-2">
                    <Label htmlFor="registrationExpiry">Registration Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !userData.registrationExpiry && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {userData.registrationExpiry ? (
                            format(userData.registrationExpiry, "PPP")
                          ) : (
                            <span>Select expiry date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={userData.registrationExpiry}
                          onSelect={(date) => setUserData({...userData, registrationExpiry: date})}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {userData.providerType === "physician" && (
                  <div>
                    <Label className="mb-2 block">Specializations</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                      {getSpecializations().map((specialization) => (
                        <div
                          key={specialization.id}
                          className={`flex items-center space-x-2 p-3 rounded-md border ${
                            userData.specializations.includes(specialization.id) 
                              ? "border-primary bg-primary/5" 
                              : "border-input"
                          }`}
                        >
                          <Checkbox
                            id={`spec-${specialization.id}`}
                            checked={userData.specializations.includes(specialization.id)}
                            onCheckedChange={(checked) => 
                              handleSpecializationChange(specialization.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`spec-${specialization.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {specialization.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="biography">Professional Biography</Label>
                  <Textarea
                    id="biography"
                    placeholder="Share information about your education, experience, specialties, and approach to care..."
                    className="min-h-[150px] resize-none"
                    value={userData.biography}
                    onChange={(e) => setUserData({...userData, biography: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>Select the healthcare services you provide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {getServices().map((service) => (
                  <div
                    key={service.id}
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      userData.servicesOffered.includes(service.id) 
                        ? "border-primary bg-primary/5" 
                        : "border-input"
                    }`}
                  >
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={userData.servicesOffered.includes(service.id)}
                      onCheckedChange={(checked) => 
                        handleServiceChange(service.id, checked as boolean)
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Set your weekly availability schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {days.map((day) => (
                  <div 
                    key={day.id}
                    className={`p-4 rounded-lg border transition-all ${
                      userData.availability[day.id].isAvailable 
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
                        checked={userData.availability[day.id].isAvailable}
                        onCheckedChange={(checked) => handleToggleDay(day.id, checked)}
                      />
                    </div>
                    
                    {userData.availability[day.id].isAvailable && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor={`start-${day.id}`} className="text-sm">
                            Start Time
                          </Label>
                          <Input
                            id={`start-${day.id}`}
                            type="time"
                            value={userData.availability[day.id].startTime}
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
                            value={userData.availability[day.id].endTime}
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

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Media</CardTitle>
              <CardDescription>Update your profile picture, certificate, and signature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  
                  {profilePreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img 
                        src={profilePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        onClick={() => {
                          setProfilePreview(null);
                          setUserData({...userData, profilePicture: null});
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-32 h-32 bg-muted rounded-full mb-2">
                        <Camera className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                      <Label 
                        htmlFor="profile-picture" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                      >
                        Select Photo
                      </Label>
                    </div>
                  )}
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
                          setCertificateFileName(null);
                          setUserData({...userData, certificateFile: null});
                        }}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center border-2 border-dashed border-muted-foreground/20 rounded-md p-8">
                      <File className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your certificate, or click to browse
                      </p>
                      <Input
                        id="certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleCertificateChange}
                      />
                      <Label 
                        htmlFor="certificate" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                      >
                        Upload Certificate
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>E-Signature</Label>
                  
                  <div className="border-2 border-dashed rounded-md p-2 bg-white">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="w-full h-48 touch-none cursor-crosshair border border-muted"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={endDrawing}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      disabled={!hasSignature}
                      className="flex items-center"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Clear
                    </Button>
                    
                    {hasSignature && (
                      <div className="flex items-center text-sm text-emerald-600">
                        <Check className="h-4 w-4 mr-1" /> Signature captured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProviderSettings;
