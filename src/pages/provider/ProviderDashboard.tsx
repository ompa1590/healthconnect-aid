
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderPatients from "@/components/provider/ProviderPatients";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderSettings from "@/components/provider/ProviderSettings";
import WelcomeModal from "@/components/provider/WelcomeModal";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import DashboardOverview from "@/components/provider/DashboardOverview";

const ProviderDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Get tab from URL query params or default to dashboard
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "dashboard");
  
  // Sample data for the dashboard overview
  const todaysAppointments = [
    {
      id: 1,
      type: "Specialist consultation",
      patientId: "PTN-CE550N",
      patientName: "Sarah Johnson",
      date: new Date(2024, 2, 21),
      startTime: "06:00",
      endTime: "06:30 PM",
      appointmentType: "video" as const
    },
    {
      id: 2,
      type: "Psychiatry consultation",
      patientId: "PTN-CH442M",
      patientName: "Michael Chen",
      date: new Date(2024, 2, 21),
      startTime: "03:00",
      endTime: "03:30 PM",
      appointmentType: "video" as const
    },
    {
      id: 3,
      type: "Family Planning counseling",
      patientId: "PTN-WL339E",
      patientName: "Emma Williams",
      date: new Date(2024, 2, 21),
      startTime: "05:00",
      endTime: "05:30 PM",
      appointmentType: "video" as const
    }
  ];
  
  const recentPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      patientId: "PTN-CE550N",
      initials: "S",
      specialty: "Specialist"
    },
    {
      id: 2,
      name: "Michael Chen",
      patientId: "PTN-CH442M",
      initials: "M",
      specialty: "Psychiatry"
    }
  ];
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/provider-login');
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
        }
        
        if (providerProfile) {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: providerProfile.first_name || user.user_metadata.firstName,
            lastName: providerProfile.last_name || user.user_metadata.lastName,
            speciality: providerProfile.speciality || "General Practice",
            fullProfile: providerProfile
          });
        } 
        else {
          setUserData({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata.firstName,
            lastName: user.user_metadata.lastName,
            speciality: "General Practice"
          });
        }
        
        if (user.user_metadata.isNewUser) {
          setShowWelcomeModal(true);
          
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
  
  const handleSettingsSaved = () => {
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
            speciality: providerProfile.speciality || "General Practice",
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
    <>
      <WelcomeModal 
        open={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
        providerName={userData?.firstName || 'Provider'} 
      />
      
      <ProviderDashboardLayout 
        providerName={userData?.lastName || 'Provider'}
        speciality={userData?.speciality || 'General Practice'}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="dashboard" className="space-y-0 mt-0">
            <DashboardOverview 
              todaysAppointments={todaysAppointments}
              recentPatients={recentPatients}
            />
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-0 mt-0">
            <Card>
              <CardContent className="pt-6">
                <ProviderPatients />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="consultations" className="space-y-0 mt-0">
            <Card>
              <CardContent className="pt-6">
                <ProviderAppointments />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-0 mt-0">
            <Card>
              <CardContent className="pt-6">
                <ProviderSchedule />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-0 mt-0">
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
      </ProviderDashboardLayout>
    </>
  );
};

export default ProviderDashboard;
