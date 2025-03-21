import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, Upload, Eye, Trash2, PenLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProviderSettingsProps {
  providerData?: any;
}

const ProviderSettings: React.FC<ProviderSettingsProps> = ({ providerData }) => {
  const { toast } = useToast();
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("demographics");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: new Date(),
    gender: "male",
    
    // Address information
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Professional information
    providerType: "physician",
    registrationNumber: "",
    registrationExpiry: new Date(),
    specializations: [] as string[],
    
    // Additional information
    biography: "",
    
    // Availability
    availability: {
      monday: { isAvailable: true, isFullDay: true },
      tuesday: { isAvailable: true, isFullDay: true },
      wednesday: { isAvailable: true, isFullDay: true },
      thursday: { isAvailable: true, isFullDay: true },
      friday: { isAvailable: true, isFullDay: true },
      saturday: { isAvailable: true, isFullDay: true },
      sunday: { isAvailable: true, isFullDay: true }
    },
    
    // Documents
    profilePicture: null,
    certificateFile: null,
    signatureFile: null,
    documents: [] as {id: number, name: string, type: string}[]
  });

  // Fetch provider profile from Supabase
  useEffect(() => {
    const fetchProviderProfile = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Not authenticated",
            description: "Please log in to view your profile",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Get provider profile from the new provider_profiles table
        const { data: providerProfile, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching provider profile:", error);
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive"
          });
        }
        
        // If we have provider profile data in the database, use it
        if (providerProfile) {
          // Parse dates
          const dob = providerProfile.date_of_birth ? new Date(providerProfile.date_of_birth) : new Date();
          const regExpiry = providerProfile.registration_expiry ? new Date(providerProfile.registration_expiry) : new Date();
          
          // Initialize form data from the database
          setFormData({
            firstName: providerProfile.first_name || "",
            lastName: providerProfile.last_name || "",
            email: providerProfile.email || session.user.email || "",
            phoneNumber: providerProfile.phone_number || "",
            dateOfBirth: dob,
            gender: providerProfile.gender || "male",
            
            // Address information
            addressLine1: providerProfile.address_line1 || "",
            addressLine2: providerProfile.address_line2 || "",
            landmark: providerProfile.landmark || "",
            city: providerProfile.city || "",
            state: providerProfile.state || "",
            zipCode: providerProfile.zip_code || "",
            
            // Professional information
            providerType: providerProfile.provider_type || "physician",
            registrationNumber: providerProfile.registration_number || "",
            registrationExpiry: regExpiry,
            specializations: providerProfile.specializations || [],
            
            // Additional information
            biography: providerProfile.biography || "",
            
            // Availability
            availability: providerProfile.availability || {
              monday: { isAvailable: true, isFullDay: true },
              tuesday: { isAvailable: true, isFullDay: true },
              wednesday: { isAvailable: true, isFullDay: true },
              thursday: { isAvailable: true, isFullDay: true },
              friday: { isAvailable: true, isFullDay: true },
              saturday: { isAvailable: true, isFullDay: true },
              sunday: { isAvailable: true, isFullDay: true }
            },
            
            // Documents (just demo data for now)
            profilePicture: null,
            certificateFile: null,
            signatureFile: null,
            documents: [
              { id: 1, name: "P-56476957512-wEJD.pdf", type: "pdf" },
              { id: 2, name: "M-56476947012JD-logo.png", type: "image" }
            ]
          });
        } 
        // Otherwise use the data passed via props or fallback to demo data
        else if (providerData) {
          const userMetadata = providerData;
          
          setFormData(prev => ({
            ...prev,
            firstName: userMetadata.firstName || "Demo",
            lastName: userMetadata.lastName || "Provider",
            email: userMetadata.email || "demo-provider@vyzahealth.ca",
            // Keep other demo values
          }));
        }
        
        setProfileData(providerProfile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchProviderProfile:", error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data. Please try again later.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchProviderProfile();
  }, [toast, providerData]);

  // Handle input change
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox change for specializations
  const toggleSpecialization = (specializationId: string) => {
    setFormData(prev => {
      const currentSpecializations = [...prev.specializations];
      
      if (currentSpecializations.includes(specializationId)) {
        return {
          ...prev,
          specializations: currentSpecializations.filter(id => id !== specializationId)
        };
      } else {
        return {
          ...prev,
          specializations: [...currentSpecializations, specializationId]
        };
      }
    });
  };

  // Handle availability change
  const toggleDayAvailability = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          isAvailable: checked
        }
      }
    }));
  };

  const toggleFullDayAvailability = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          isFullDay: checked
        }
      }
    }));
  };

  // File upload handlers
  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleRemoveDocument = (documentId: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  // Signature pad related functions
  const initializeSignaturePad = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      lastX = x;
      lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
      isDrawing = false;
    });
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    // Convert canvas to file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "signature.png", { type: "image/png" });
        handleFileUpload('signatureFile', file);
        toast({
          title: "Signature saved",
          description: "Your signature has been saved successfully.",
        });
      }
    }, "image/png");
  };

  // Save all settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please log in to save your profile",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Prepare data for database
      const providerProfileData = {
        id: session.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth.toISOString().split('T')[0],
        gender: formData.gender,
        
        // Address information
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        
        // Professional information
        provider_type: formData.providerType,
        registration_number: formData.registrationNumber,
        registration_expiry: formData.registrationExpiry.toISOString().split('T')[0],
        specializations: formData.specializations,
        
        // Additional information
        biography: formData.biography,
        
        // Availability
        availability: formData.availability
      };
      
      // Update the provider profile in the database with upsert
      const { error } = await supabase
        .from('provider_profiles')
        .upsert(providerProfileData);
      
      if (error) {
        console.error("Error saving provider profile:", error);
        toast({
          title: "Error saving profile",
          description: error.message,
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Update user metadata in Supabase auth to reflect changes
      await supabase.auth.updateUser({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          specialization: formData.specializations.length > 0 ? formData.specializations[0] : "General Practice"
        }
      });
      
      // If signature has been updated, you would upload it to storage here
      // Similarly for other files
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
      
      // Refresh profile data
      setProfileData(providerProfileData);
      
      // Update user session to reflect changes
      await supabase.auth.refreshSession();
      
      setIsEditMode(false);
    } catch (error) {
      console.error("Error in handleSaveSettings:", error);
      toast({
        title: "Error saving settings",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize signature pad on component mount
  useEffect(() => {
    initializeSignaturePad();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-2"></div>
          <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-36 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dr. {formData.lastName}'s Profile</h1>
        {!isEditMode ? (
          <Button onClick={() => setIsEditMode(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="specialization">Specialization</TabsTrigger>
          <TabsTrigger value="shortBio">Short Bio</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Demographics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number*</Label>
                <Input 
                  id="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input 
                  id="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date Of Birth*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                      disabled={!isEditMode}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => date && handleInputChange('dateOfBirth', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Gender*</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex space-x-2"
                  disabled={!isEditMode}
                >
                  <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-md flex-1 justify-center">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md flex-1 justify-center">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md flex-1 justify-center">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Profile Picture</h2>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {/* If there's a profile picture, show it here */}
                <PenLine className="h-12 w-12 text-gray-500" />
              </div>
              <Button disabled={!isEditMode}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Picture
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1*</Label>
                <Input 
                  id="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input 
                  id="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Land Mark</Label>
                <Input 
                  id="landmark" 
                  value={formData.landmark} 
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input 
                  id="state" 
                  value={formData.state} 
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input 
                  id="zipCode" 
                  value={formData.zipCode} 
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Specialization Tab */}
        <TabsContent value="specialization" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Specialization</h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "reproductive_health_counselling", label: "Reproductive health counselling" },
                { id: "sti_management", label: "Sexually-transmitted infection (STI) management" },
                { id: "psychological_counselling", label: "Psychological counselling" },
                { id: "general_practitioner_consultation", label: "General Practitioner consultation" },
                { id: "specialist_consultation", label: "Specialist consultation" },
                { id: "psychiatry_consultation", label: "Psychiatry consultation" },
                { id: "genetic_counselling", label: "Genetic counselling" },
                { id: "family_planning_counselling", label: "Family Planning counselling" }
              ].map((specialization) => (
                <div key={specialization.id} className="flex items-center space-x-2">
                  <div className="flex items-center h-5">
                    <Checkbox 
                      id={specialization.id}
                      checked={formData.specializations.includes(specialization.id)}
                      onCheckedChange={() => isEditMode && toggleSpecialization(specialization.id)}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label htmlFor={specialization.id}>{specialization.label}</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Professional College Certificate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">License Number*</Label>
                <Input 
                  id="registrationNumber" 
                  value={formData.registrationNumber} 
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationExpiry">Expire Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.registrationExpiry && "text-muted-foreground"
                      )}
                      disabled={!isEditMode}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.registrationExpiry ? format(formData.registrationExpiry, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.registrationExpiry}
                      onSelect={(date) => date && handleInputChange('registrationExpiry', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <h3 className="text-md font-medium mb-2">Attachment</h3>
            <div className="space-y-2">
              {formData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded mr-2 ${doc.type === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {doc.type.toUpperCase()}
                    </span>
                    <span>{doc.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isEditMode && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditMode && (
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Certificate
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Short Bio Tab */}
        <TabsContent value="shortBio" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Short Bio</h2>
            <div className="space-y-2">
              <Label htmlFor="biography">Added Bio</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                className="min-h-[200px]"
                disabled={!isEditMode}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">E-Signature</h2>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <canvas 
                  ref={signatureCanvasRef} 
                  width={600} 
                  height={200} 
                  className="border w-full touch-none"
                  style={{ backgroundColor: '#fff' }}
                ></canvas>
              </div>
              
              {isEditMode && (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={clearSignature}>
                    Clear
                  </Button>
                  <Button onClick={saveSignature}>
                    Save Signature
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Manage Availability</h2>
            <div className="mb-4">
              <p className="text-sm mb-1">Set your availability</p>
              <p className="text-xs text-gray-500">Select what time slots you are available for consultation.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { id: "monday", label: "MONDAY" },
                { id: "tuesday", label: "TUESDAY" },
                { id: "wednesday", label: "WEDNESDAY" },
                { id: "thursday", label: "THURSDAY" },
                { id: "friday", label: "FRIDAY" },
                { id: "saturday", label: "SATURDAY" },
                { id: "sunday", label: "SUNDAY" }
              ].map((day) => (
                <div key={day.id} className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`${day.id}-available`}
                      checked={formData.availability[day.id as keyof typeof formData.availability]?.isAvailable}
                      onCheckedChange={(checked) => isEditMode && toggleDayAvailability(day.id, !!checked)}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor={`${day.id}-available`} className="ml-2 font-medium">
                      {day.label}
                    </Label>
                    
                    {formData.availability[day.id as keyof typeof formData.availability]?.isAvailable && (
                      <div className="ml-4 flex items-center">
                        <Checkbox 
                          id={`${day.id}-fullday`}
                          checked={formData.availability[day.id as keyof typeof formData.availability]?.isFullDay}
                          onCheckedChange={(checked) => isEditMode && toggleFullDayAvailability(day.id, !!checked)}
                          disabled={!isEditMode}
                        />
                        <Label htmlFor={`${day.id}-fullday`} className="ml-2">
                          Full Day
                        </Label>
                      </div>
                    )}
                  </div>
                  
                  {formData.availability[day.id as keyof typeof formData.availability]?.isAvailable && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">Full day availability</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {isEditMode && (
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Apply To All
              </Button>
            )}
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Description</h3>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>Providing your availability allows Telehealth Virtual admin staff to trigger patient appointments accordingly.</li>
                <li>Patients are also able to book follow-up appointments per set availability.</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4 text-blue-600">Documents</h2>
            <div className="space-y-4">
              <h3 className="text-md font-medium">Uploaded Documents</h3>
              {formData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded mr-2 ${doc.type === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {doc.type.toUpperCase()}
                    </span>
                    <span>{doc.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isEditMode && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditMode && (
                <div className="mt-4">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {isEditMode && (
        <div className="mt-6 flex justify-center">
          <Button 
            className="w-64 py-4" 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProviderSettings;

