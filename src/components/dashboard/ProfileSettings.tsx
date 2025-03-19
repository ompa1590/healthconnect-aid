
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    healthCardNumber: "",
    familyDoctor: "Not provided",
    emergencyContact: "Not provided",
    dataConsent: false,
  });
  const [loading, setLoading] = useState(true);

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
  
  const handleUpdate = (field: string) => {
    toast({
      title: "Update requested",
      description: `You requested to update your ${field}`,
    });
    // In a real app, this would open a modal or form to update the specific field
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
      <div className="h-full w-full flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-normal mb-6">Profile</h1>
      
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
              <Button variant="outline" size="sm" onClick={() => handleUpdate("date of birth")}>
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
              <Button variant="outline" size="sm" onClick={() => handleUpdate("health card")}>
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
              <Button variant="outline" size="sm" onClick={() => handleUpdate("email")}>
                Update
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
              <Button variant="outline" size="sm" onClick={() => handleUpdate("family doctor")}>
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
              <Button variant="outline" size="sm" onClick={() => handleUpdate("emergency contact")}>
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
    </div>
  );
};

export default ProfileSettings;
