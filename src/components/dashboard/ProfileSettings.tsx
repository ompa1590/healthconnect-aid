
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, Mail, Phone, Calendar, UserPlus, Users, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardNavbar from "./DashboardNavbar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProfileData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  health_card_number?: string;
  family_doctor?: string;
  emergency_contact?: string;
  data_consent?: boolean;
  province?: string;
  created_at?: string;
  updated_at?: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          throw new Error("No active session");
        }
        
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Get user email from auth
        const email = session.user.email;
        
        setProfileData({
          ...profileData,
          email,
          phone: profileData.phone || "",
          date_of_birth: profileData.date_of_birth || "",
          family_doctor: profileData.family_doctor || "",
          emergency_contact: profileData.emergency_contact || "",
          data_consent: profileData.data_consent || false
        });
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: error.message || "Could not load your profile information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [toast]);
  
  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth,
          health_card_number: profileData.health_card_number,
          family_doctor: profileData.family_doctor,
          emergency_contact: profileData.emergency_contact,
          data_consent: profileData.data_consent,
          province: profileData.province,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "Could not update your profile information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    try {
      setPasswordError("");
      
      if (passwords.new !== passwords.confirm) {
        setPasswordError("New passwords do not match");
        return;
      }
      
      setIsSaving(true);
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully"
      });
      
      setShowPasswordDialog(false);
      setPasswords({ current: "", new: "", confirm: "" });
      
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError(error.message || "Could not update your password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and settings</p>
        </div>
        
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-6">Personal Information</h2>
            
            <div className="grid gap-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      placeholder="Your full name" 
                      className="pl-10" 
                      value={profileData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      placeholder="Your email address" 
                      className="pl-10" 
                      value={profileData.email || ""}
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      placeholder="Your phone number" 
                      className="pl-10" 
                      value={profileData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="dob"
                      placeholder="YYYY-MM-DD" 
                      className="pl-10" 
                      value={profileData.date_of_birth || ""}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={saveProfile} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Personal Information
            </Button>
          </CardContent>
        </Card>
        
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-6">Medical Information</h2>
            
            <div className="grid gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="healthCard">Health Card Number</Label>
                <Input 
                  id="healthCard"
                  placeholder="Your health card number" 
                  value={profileData.health_card_number || ""}
                  onChange={(e) => handleInputChange("health_card_number", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input 
                  id="province"
                  placeholder="Your province" 
                  value={profileData.province || ""}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Family Doctor</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="doctor"
                    placeholder="Family doctor's name" 
                    className="pl-10" 
                    value={profileData.family_doctor || ""}
                    onChange={(e) => handleInputChange("family_doctor", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="emergency"
                    placeholder="Name and phone number" 
                    className="pl-10" 
                    value={profileData.emergency_contact || ""}
                    onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="consent" 
                  checked={!!profileData.data_consent}
                  onCheckedChange={(checked) => handleInputChange("data_consent", checked)}
                />
                <Label htmlFor="consent">
                  I consent to the use of my health data for improving services
                </Label>
              </div>
            </div>
            
            <Button onClick={saveProfile} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Medical Information
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-6">Security</h2>
            
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setShowPasswordDialog(true)}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            
            {passwordError && (
              <div className="flex items-center bg-red-50 text-red-600 px-4 py-3 rounded mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                {passwordError}
              </div>
            )}
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileSettings;
