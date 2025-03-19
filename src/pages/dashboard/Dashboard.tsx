
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import MedicalHistory from "@/components/dashboard/MedicalHistory";
import TreatmentOptions from "@/components/dashboard/TreatmentOptions";
import { CalendarDays, ClipboardList, History, Stethoscope, Loader2, LogOut, Tag, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-normal text-gray-800">Welcome back, {userName}</h1>
            <p className="text-gray-500 mt-1">You're all caught up</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        {/* Current Treatment Card */}
        <Card className="mb-8 border rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium">Current Treatment</h2>
                </div>
                <div className="flex items-center gap-4 mb-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium">Upcoming Appointment:</span>
                    <span className="ml-2 text-muted-foreground">June 15th at 2:00 PM</span>
                  </div>
                </div>
                <Button className="mt-4" size="sm">
                  Join Appointment
                </Button>
              </div>
              <div className="bg-muted/10 p-6 w-full md:w-auto flex flex-col items-start justify-center">
                <p className="text-sm text-muted-foreground mb-2">Your current plans</p>
                <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">Dermatology Consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm font-medium">Monthly Wellness Check</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Special Offer Card */}
        <Card className="mb-8 border rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                  <Tag className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium">Special Offer</h3>
                  <p className="text-sm text-muted-foreground">Get $40 off your visit fee on all treatments</p>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-1" size="sm">
                Explore treatments
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Tabs Content */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="bg-muted/20 p-1 mb-8 rounded-lg">
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <History className="mr-2 h-4 w-4" />
              Medical History
            </TabsTrigger>
            <TabsTrigger 
              value="treatments" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              Treatment Options
            </TabsTrigger>
            <TabsTrigger 
              value="records" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Health Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Schedule Appointment</h2>
                  <AppointmentScheduler />
                </CardContent>
              </Card>
              <Card className="border rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Upcoming & Past Appointments</h2>
                  <AppointmentHistory />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border rounded-xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Medical History</h2>
                <MedicalHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments">
            <Card className="border rounded-xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Available Treatment Options</h2>
                <TreatmentOptions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <Card className="border rounded-xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Health Records</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                    <h3 className="font-medium mb-2">Lab Results</h3>
                    <p className="text-sm text-muted-foreground">View your recent laboratory test results</p>
                  </div>
                  <div className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                    <h3 className="font-medium mb-2">Prescriptions</h3>
                    <p className="text-sm text-muted-foreground">Access and manage your medication prescriptions</p>
                  </div>
                  <div className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                    <h3 className="font-medium mb-2">Documents</h3>
                    <p className="text-sm text-muted-foreground">View and download your medical documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
