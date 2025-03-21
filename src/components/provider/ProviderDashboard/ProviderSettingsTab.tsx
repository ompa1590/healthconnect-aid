
import React, { useEffect, useState } from "react";
import ProviderSettings from "../ProviderSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ProviderSettingsTab = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const user = session.user;
        
        const { data: providerProfile, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching provider profile:", error);
          return;
        }
        
        if (providerProfile) {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: providerProfile.first_name || user.user_metadata.firstName,
            lastName: providerProfile.last_name || user.user_metadata.lastName,
            fullProfile: providerProfile
          });
        } else {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata.firstName,
            lastName: user.user_metadata.lastName,
          });
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching provider data:", error);
        toast({
          title: "Error",
          description: "Could not load profile data.",
          variant: "destructive",
        });
      }
    };
    
    fetchProviderData();
  }, [toast]);
  
  const handleSettingsSaved = () => {
    // Reload provider data after settings are saved
    const refreshUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const user = session.user;
        
        const { data: providerProfile, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching updated provider profile:", error);
          return;
        }
        
        if (providerProfile) {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: providerProfile.first_name || user.user_metadata.firstName,
            lastName: providerProfile.last_name || user.user_metadata.lastName,
            fullProfile: providerProfile
          });
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    };
    
    refreshUserData();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading profile settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <ProviderSettings 
        providerData={userData}
        onSettingsSaved={handleSettingsSaved}
      />
    </div>
  );
};

export default ProviderSettingsTab;
