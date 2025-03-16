
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import MedicalHistory from "@/components/dashboard/MedicalHistory";
import TreatmentOptions from "@/components/dashboard/TreatmentOptions";
import { CalendarDays, ClipboardList, History, Stethoscope, User, Loader2, LogOut } from "lucide-react";
import { MedicalIcon3D } from "@/components/ui/MedicalIcons3D";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');

  // Default tab from URL parameters or "appointments"
  const defaultTab = tabParam && ["appointments", "history", "treatments", "records"].includes(tabParam) 
    ? tabParam 
    : "appointments";
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          // User is not logged in, redirect to login page
          toast({
            title: "Authentication required",
            description: "Please log in to access your dashboard",
          });
          navigate("/login");
          return;
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        if (profileData) {
          setUserName(profileData.name || "Patient");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication error",
          description: error.message || "There was an error verifying your session",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health",
      });
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
      <div className="fixed top-40 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10 blob-animation"></div>
      <div className="fixed bottom-40 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 blob-animation-slow"></div>
      
      {/* Welcome Section with Sign Out Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <WelcomeSection userName={userName} />
        <Button 
          variant="outline" 
          onClick={handleSignOut} 
          className="mt-4 md:mt-0 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-transparent">
          <TabsTrigger value="appointments" className="w-full data-[state=active]:bg-primary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <CalendarDays className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Appointments
          </TabsTrigger>
          <TabsTrigger value="history" className="w-full data-[state=active]:bg-primary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <History className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Medical History
          </TabsTrigger>
          <TabsTrigger value="treatments" className="w-full data-[state=active]:bg-primary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <Stethoscope className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Treatment Options
          </TabsTrigger>
          <TabsTrigger value="records" className="w-full data-[state=active]:bg-primary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <ClipboardList className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Health Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full blur-md"></div>
              <div className="flex items-center mb-4">
                <MedicalIcon3D type="stethoscope" size="sm" color="primary" className="mr-3" />
                <h2 className="text-2xl font-semibold">Schedule Appointment</h2>
              </div>
              <AppointmentScheduler />
            </GlassCard>
            <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary/10 rounded-full blur-md"></div>
              <div className="flex items-center mb-4">
                <MedicalIcon3D type="monitor" size="sm" color="secondary" className="mr-3" />
                <h2 className="text-2xl font-semibold">Upcoming & Past Appointments</h2>
              </div>
              <AppointmentHistory />
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="heart" size="sm" color="primary" className="mr-3" />
              <h2 className="text-2xl font-semibold">Medical History</h2>
            </div>
            <MedicalHistory />
          </GlassCard>
        </TabsContent>

        <TabsContent value="treatments">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-full"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="pill" size="sm" color="secondary" className="mr-3" />
              <h2 className="text-2xl font-semibold">Available Treatment Options</h2>
            </div>
            <TreatmentOptions />
          </GlassCard>
        </TabsContent>

        <TabsContent value="records">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-md"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="brain" size="sm" color="primary" className="mr-3" />
              <h2 className="text-2xl font-semibold">Health Records</h2>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium mb-2">Lab Results</h3>
                  <p className="text-sm text-muted-foreground">View your recent laboratory test results</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium mb-2">Prescriptions</h3>
                  <p className="text-sm text-muted-foreground">Access and manage your medication prescriptions</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium mb-2">Documents</h3>
                  <p className="text-sm text-muted-foreground">View and download your medical documents</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <User className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Select a category to view your health records</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
