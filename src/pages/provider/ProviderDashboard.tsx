import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderPatients from "@/components/provider/ProviderPatients";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderSettings from "@/components/provider/ProviderSettings";
import WelcomeModal from "@/components/provider/WelcomeModal";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/provider-login');
          return;
        }
        
        // Load user data from the session
        const user = session.user;
        
        // First, try to get the provider profile from the database
        const { data: providerProfile, error } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching provider profile:", error);
        }
        
        // If we have a provider profile, use it
        if (providerProfile) {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: providerProfile.first_name || user.user_metadata.firstName,
            lastName: providerProfile.last_name || user.user_metadata.lastName,
            fullProfile: providerProfile
          });
        } 
        // Otherwise, use the user metadata
        else {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata.firstName,
            lastName: user.user_metadata.lastName,
          });
        }
        
        // Check if this is a new user
        if (user.user_metadata.isNewUser) {
          setShowWelcomeModal(true);
          
          // Update the user metadata to remove the isNewUser flag
          await supabase.auth.updateUser({
            data: { isNewUser: false }
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in checkAuth:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate('/provider-login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/provider-login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSettingsSaved = () => {
    // Refresh user data after settings are saved
    const refreshUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const user = session.user;
        
        // Get the updated provider profile
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
          
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4 min-h-screen">
      {/* Welcome Modal for new users */}
      <WelcomeModal 
        open={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
        providerName={userData?.firstName || 'Provider'} 
      />
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, Dr. {userData?.lastName || 'Provider'}</h1>
          <p className="text-muted-foreground mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={handleSignOut} variant="outline" className="mt-4 md:mt-0">
          Sign Out
        </Button>
      </div>
      
      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProviderAppointments />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Patients Tab Content */}
        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProviderPatients />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab Content */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProviderSchedule />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab Content */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProviderSettings 
                providerData={userData} 
                onSettingsSaved={handleSettingsSaved}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
