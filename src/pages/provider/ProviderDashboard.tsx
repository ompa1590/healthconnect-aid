
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Stethoscope, UserRound, Settings, FileClock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderPatients from "@/components/provider/ProviderPatients";
import ProviderSettings from "@/components/provider/ProviderSettings";
import WelcomeModal from "@/components/provider/WelcomeModal";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [providerName, setProviderName] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/provider-login');
        return;
      }

      // Get user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.user_metadata) {
        const { firstName, lastName, isNewUser } = userData.user.user_metadata;
        
        if (firstName && lastName) {
          setProviderName(`${firstName} ${lastName}`);
        }
        
        // Show welcome modal for new users
        if (isNewUser) {
          setShowWelcomeModal(true);
          
          // Update user metadata to remove the isNewUser flag
          await supabase.auth.updateUser({
            data: { isNewUser: false }
          });
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <DashboardNavbar 
        userType="provider" 
        userName={providerName}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your appointments and patient information</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid sm:grid-cols-4 grid-cols-2 gap-2 bg-transparent h-auto">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Appointments</span>
              <span className="md:hidden">Appts</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <FileClock className="h-5 w-5 mr-2" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <UserRound className="h-5 w-5 mr-2" />
              <span>Patients</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              <Settings className="h-5 w-5 mr-2" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="space-y-6">
            <ProviderAppointments />
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <ProviderSchedule />
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-6">
            <ProviderPatients />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <ProviderSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal} 
        onComplete={() => setShowWelcomeModal(false)} 
      />
    </div>
  );
};

export default ProviderDashboard;
