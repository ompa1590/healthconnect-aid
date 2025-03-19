
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2 } from "lucide-react";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  healthCardNumber: string;
  familyDoctor: string;
  emergencyContact: string;
  dataConsent: boolean;
};

const ProfileSettings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    healthCardNumber: "",
    familyDoctor: "",
    emergencyContact: "",
    dataConsent: false,
  });
  const [loading, setLoading] = useState(true);
  const [updateField, setUpdateField] = useState<keyof ProfileData | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser();
        
        // Get profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        setProfile({
          name: profileData?.name || "",
          email: userData?.user?.email || "",
          phone: profileData?.phone || "",
          dateOfBirth: profileData?.date_of_birth || "",
          healthCardNumber: profileData?.health_card_number || "",
          familyDoctor: profileData?.family_doctor || "Not provided",
          emergencyContact: profileData?.emergency_contact || "Not provided",
          dataConsent: profileData?.data_consent || false,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: "We couldn't load your profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [toast]);
  
  const handleUpdate = (field: keyof ProfileData) => {
    setUpdateField(field);
    setFieldValue(profile[field] as string);
  };
  
  const handleSaveField = async () => {
    if (!updateField) return;
    
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const updates: Record<string, any> = {};
      
      // Map profile fields to database columns
      switch (updateField) {
        case 'name':
          updates.name = fieldValue;
          break;
        case 'phone':
          updates.phone = fieldValue;
          break;
        case 'dateOfBirth':
          updates.date_of_birth = fieldValue;
          break;
        case 'healthCardNumber':
          updates.health_card_number = fieldValue;
          break;
        case 'familyDoctor':
          updates.family_doctor = fieldValue;
          break;
        case 'emergencyContact':
          updates.emergency_contact = fieldValue;
          break;
        default:
          break;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile(prev => ({ ...prev, [updateField]: fieldValue }));
      
      toast({
        title: "Profile updated",
        description: `Your ${updateField} has been updated successfully`,
      });
      
      setUpdateField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "We couldn't update your profile information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleConsentChange = async (checked: boolean) => {
    try {
      setProfile(prev => ({ ...prev, dataConsent: checked }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ data_consent: checked })
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      toast({
        title: "Preferences updated",
        description: "Your data consent preferences have been saved",
      });
    } catch (error) {
      console.error("Error updating consent:", error);
      toast({
        title: "Update failed",
        description: "We couldn't update your preferences",
        variant: "destructive",
      });
      // Revert the UI state on error
      setProfile(prev => ({ ...prev, dataConsent: !checked }));
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-normal mb-6">Profile Settings</h1>
      
      <Card className="mb-8 border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Name */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Name</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("name")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.name}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Date of birth */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Date of birth</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("dateOfBirth")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.dateOfBirth || "Not provided"}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Phone number */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Phone number</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("phone")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.phone || "Not provided"}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Health card */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Health card number</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("healthCardNumber")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.healthCardNumber || "Not provided"}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Email address */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Email address</Label>
              <Button variant="outline" size="sm" disabled>
                Update via Settings
              </Button>
            </div>
            <p className="text-gray-700">{profile.email}</p>
            <Separator className="mt-4" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8 border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Family doctor */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Family doctor</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("familyDoctor")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.familyDoctor}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Emergency contact */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Emergency contact</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("emergencyContact")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">{profile.emergencyContact}</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-base">Password</Label>
              <Button variant="outline" size="sm" onClick={() => handleUpdate("password")}>
                Update
              </Button>
            </div>
            <p className="text-gray-700">••••••••••••</p>
            <Separator className="mt-4" />
          </div>
          
          {/* Data consent */}
          <div>
            <Label className="text-base mb-1 block">Data consent</Label>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 text-sm max-w-lg">
                Vyra Health can use my information to recommend relevant treatments and products.{" "}
                <a href="#" className="text-primary underline">Learn more</a>
              </p>
              <Switch 
                checked={profile.dataConsent} 
                onCheckedChange={handleConsentChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={updateField !== null} onOpenChange={(open) => !open && setUpdateField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update {updateField}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input 
              value={fieldValue} 
              onChange={(e) => setFieldValue(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateField(null)}>Cancel</Button>
            <Button onClick={handleSaveField} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
