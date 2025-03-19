
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserRound, 
  Phone, 
  Calendar, 
  User2, 
  UserCog, 
  Mail, 
  BadgeInfo,
  ShieldAlert,
  SaveIcon
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  province: string;
  health_card_number: string;
  phone?: string;
  date_of_birth?: string;
  family_doctor?: string;
  emergency_contact?: string;
  data_consent?: boolean;
  created_at: string;
  updated_at: string;
}

const ProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  
  useEffect(() => {
    // Simulate fetching user data from Supabase
    setTimeout(() => {
      const mockUserData: UserProfile = {
        id: "user-123",
        name: "John Doe",
        email: "john.doe@example.com",
        province: "Ontario",
        health_card_number: "1234-567-890-AB",
        phone: "416-555-0123",
        date_of_birth: "1985-06-15",
        family_doctor: "Dr. Sarah Johnson",
        emergency_contact: "Jane Doe (Wife) - 416-555-0124",
        data_consent: true,
        created_at: "2023-01-15T12:00:00Z",
        updated_at: "2023-01-15T12:00:00Z"
      };
      
      setProfile(mockUserData);
      setFormData(mockUserData);
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleSaveChanges = () => {
    setSaving(true);
    // Simulate API call to update profile
    setTimeout(() => {
      setProfile(prev => ({
        ...prev!,
        ...formData,
        updated_at: new Date().toISOString()
      }));
      setSaving(false);
      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved."
      });
    }, 1500);
  };
  
  if (loading) {
    return (
      <Card className="animate-pulse transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <HeartPulseLoader size="lg" />
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-fade-in transition-all duration-300">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium mb-6 flex items-center">
          <UserCog className="mr-2 h-5 w-5 text-primary" />
          Profile Settings
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Full Name
              </Label>
              <Input 
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input 
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input 
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="family_doctor" className="flex items-center gap-2">
                <User2 className="h-4 w-4" />
                Family Doctor
              </Label>
              <Input 
                id="family_doctor"
                name="family_doctor"
                value={formData.family_doctor || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="emergency_contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contact
              </Label>
              <Input 
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact || ""}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="province" className="flex items-center gap-2">
                <BadgeInfo className="h-4 w-4" />
                Province
              </Label>
              <Input 
                id="province"
                name="province"
                value={formData.province || ""}
                onChange={handleInputChange}
                disabled
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="health_card_number" className="flex items-center gap-2">
                <BadgeInfo className="h-4 w-4" />
                Health Card Number
              </Label>
              <Input 
                id="health_card_number"
                name="health_card_number"
                value={formData.health_card_number || ""}
                onChange={handleInputChange}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex items-start space-x-3 pt-4 border-t">
            <Switch 
              id="data_consent"
              name="data_consent"
              checked={formData.data_consent || false}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, data_consent: checked }))
              }
            />
            <div className="space-y-1">
              <Label 
                htmlFor="data_consent" 
                className="flex items-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4" />
                Data Consent
              </Label>
              <p className="text-sm text-muted-foreground">
                I consent to the collection and processing of my health data in accordance with the privacy policy.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveChanges}
              disabled={saving}
              className="transition-all duration-300 hover:shadow-md"
            >
              {saving ? (
                <>
                  <HeartPulseLoader size="sm" color="text-white" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
