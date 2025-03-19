import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import { CalendarDays, ClipboardList, Stethoscope, Loader2, Tag, ArrowRight, PlusCircle } from "lucide-react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import DashboardServices from "@/components/dashboard/DashboardServices";
import DashboardRewards from "@/components/dashboard/DashboardRewards";
import MedicalHistoryPage from "./MedicalHistoryPage";
import TreatmentOptionsPage from "./TreatmentOptionsPage";
import HealthRecordsPage from "./HealthRecordsPage";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookAppointmentFlow from "@/components/dashboard/BookingFlow/BookAppointmentFlow";
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data,
          error
        } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (!data.session) {
          toast({
            title: "Authentication required",
            description: "Please log in to access your dashboard"
          });
          navigate("/login");
          return;
        }
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('profiles').select('name').eq('id', data.session.user.id).single();
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
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((event, session) => {
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
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>;
  }
  const DashboardHome = () => <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-normal text-gray-800">Welcome back, {userName}</h1>
          <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Book a New Appointment
              </Button>
            </DialogTrigger>
            <BookAppointmentFlow onClose={() => setBookingDialogOpen(false)} />
          </Dialog>
        </div>
        <p className="text-gray-500">You're all caught up</p>
      </div>
      
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
      
      
      
      <h2 className="text-2xl font-medium mb-6">Your Appointments</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4">Upcoming & Past Appointments</h2>
            <AppointmentHistory />
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card className="border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/dashboard/medical-history")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View Medical History
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/dashboard/health-records")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Access Health Records
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/dashboard/treatment-options")}>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Explore Treatment Options
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
  return <div className="min-h-screen bg-white">
      <DashboardNavbar userName={userName} />
      
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/services" element={<DashboardServices />} />
        <Route path="/rewards" element={<DashboardRewards />} />
        <Route path="/medical-history" element={<MedicalHistoryPage />} />
        <Route path="/treatment-options" element={<TreatmentOptionsPage />} />
        <Route path="/health-records" element={<HealthRecordsPage />} />
      </Routes>
    </div>;
};
export default Dashboard;