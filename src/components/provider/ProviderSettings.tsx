import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyAvailability, DayAvailability, weeklyAvailabilityToJson, jsonToWeeklyAvailability } from "@/types/supabase";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  zipCode: string;
  
  providerType: string;
  registrationNumber: string;
  specializations: string[];
  biography: string;
  
  availability: WeeklyAvailability;
}

interface ProviderSettingsProps {
  providerData: any;
  onSettingsSaved: () => void;
}

const ProviderSettings: React.FC<ProviderSettingsProps> = ({ providerData, onSettingsSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("personal");
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male',
    
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    zipCode: '',
    
    providerType: 'physician',
    registrationNumber: '',
    specializations: [],
    biography: '',
    
    availability: {
      monday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
      sunday: { isAvailable: false, isFullDay: false, startTime: "09:00", endTime: "17:00" },
    }
  });
  
  // Initialize form data from provider data
  useEffect(() => {
    if (providerData) {
      // Initialize from full profile if available
      if (providerData.fullProfile) {
        // Convert availability from JSON to our interface
        const availability = jsonToWeeklyAvailability(providerData.fullProfile.availability);
        
        setFormData({
          firstName: providerData.fullProfile.first_name || providerData.firstName || '',
          lastName: providerData.fullProfile.last_name || providerData.lastName || '',
          email: providerData.fullProfile.email || providerData.email || '',
          phoneNumber: providerData.fullProfile.phone_number || '',
          dateOfBirth: providerData.fullProfile.date_of_birth || '',
          gender: providerData.fullProfile.gender || 'male',
          
          addressLine1: providerData.fullProfile.address_line1 || '',
          addressLine2: providerData.fullProfile.address_line2 || '',
          landmark: providerData.fullProfile.landmark || '',
          city: providerData.fullProfile.city || '',
          state: providerData.fullProfile.state || '',
          zipCode: providerData.fullProfile.zip_code || '',
          
          providerType: providerData.fullProfile.provider_type || 'physician',
          registrationNumber: providerData.fullProfile.registration_number || '',
          specializations: Array.isArray(providerData.fullProfile.specializations) 
            ? providerData.fullProfile.specializations 
            : [],
          biography: providerData.fullProfile.biography || '',
          
          availability
        });
      } 
      // Otherwise use the basic user data
      else {
        setFormData(prevFormData => ({
          ...prevFormData,
          firstName: providerData.firstName || '',
          lastName: providerData.lastName || '',
          email: providerData.email || '',
        }));
      }
    }
  }, [providerData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update user metadata
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
      });
      
      if (updateUserError) {
        throw updateUserError;
      }
      
      // Prepare the availability data for Supabase (convert to JSON)
      const availabilityJson = weeklyAvailabilityToJson(formData.availability);
      
      // Check if provider profile exists
      const { data: existingProfile } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      // Create or update provider profile
      if (existingProfile) {
        // Update existing profile
        const { error: profileUpdateError } = await supabase
          .from('provider_profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            address_line1: formData.addressLine1,
            address_line2: formData.addressLine2,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            provider_type: formData.providerType,
            registration_number: formData.registrationNumber,
            specializations: formData.specializations,
            biography: formData.biography,
            availability: availabilityJson
          })
          .eq('id', user.id);
          
        if (profileUpdateError) {
          throw profileUpdateError;
        }
      } else {
        // Create new profile
        const { error: profileInsertError } = await supabase
          .from('provider_profiles')
          .insert({
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            address_line1: formData.addressLine1,
            address_line2: formData.addressLine2,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            provider_type: formData.providerType,
            registration_number: formData.registrationNumber,
            specializations: formData.specializations,
            biography: formData.biography,
            availability: availabilityJson
          });
          
        if (profileInsertError) {
          throw profileInsertError;
        }
      }
      
      // Show success message
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      });
      
      // Call the callback to refresh user data in parent component
      if (onSettingsSaved) {
        onSettingsSaved();
      }
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error.message || "Could not save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleDay = (day: string, isAvailable: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      availability: {
        ...prevData.availability,
        [day]: {
          ...prevData.availability[day as keyof WeeklyAvailability],
          isAvailable
        }
      }
    }));
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setFormData(prevData => ({
      ...prevData,
      availability: {
        ...prevData.availability,
        [day]: {
          ...prevData.availability[day as keyof WeeklyAvailability],
          [field]: value
        }
      }
    }));
  };

  const handleFullDayToggle = (day: string, isFullDay: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      availability: {
        ...prevData.availability,
        [day]: {
          ...prevData.availability[day as keyof WeeklyAvailability],
          isFullDay
        }
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Update your address and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal/ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Professional Information Tab */}
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Update your professional details and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providerType">Provider Type</Label>
                  <select
                    id="providerType"
                    name="providerType"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.providerType}
                    onChange={handleInputChange}
                  >
                    <option value="physician">Physician</option>
                    <option value="nurse_practitioner">Nurse Practitioner</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="dietician">Dietician</option>
                    <option value="physiotherapist">Physiotherapist</option>
                    <option value="mental_health">Mental Health Professional</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations</Label>
                <Input
                  id="specializations"
                  name="specializations"
                  value={formData.specializations.join(', ')}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      specializations: value.split(',').map(item => item.trim()).filter(Boolean)
                    });
                  }}
                  placeholder="Enter specializations separated by commas"
                />
                <p className="text-xs text-muted-foreground">
                  E.g., Cardiology, Pediatrics, Family Medicine
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="biography">Professional Biography</Label>
                <Textarea
                  id="biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Write a brief professional biography..."
                />
                <p className="text-xs text-muted-foreground">
                  Describe your professional background, experience, and approach to patient care
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>
                Set your weekly availability for patient appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(formData.availability).map(([day, dayData]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`available-${day}`}
                          checked={dayData.isAvailable}
                          onChange={(e) => handleToggleDay(day, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`available-${day}`} className="font-medium capitalize">
                          {day}
                        </Label>
                      </div>
                      
                      {dayData.isAvailable && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`fullday-${day}`}
                            checked={dayData.isFullDay}
                            onChange={(e) => handleFullDayToggle(day, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`fullday-${day}`} className="text-sm">
                            Full Day
                          </Label>
                        </div>
                      )}
                    </div>
                    
                    {dayData.isAvailable && !dayData.isFullDay && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`start-${day}`} className="text-sm">
                            Start Time
                          </Label>
                          <Input
                            id={`start-${day}`}
                            type="time"
                            value={dayData.startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`end-${day}`} className="text-sm">
                            End Time
                          </Label>
                          <Input
                            id={`end-${day}`}
                            type="time"
                            value={dayData.endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
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
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ProviderSettings;
