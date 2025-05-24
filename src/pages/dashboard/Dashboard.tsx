
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import { CalendarDays, ClipboardList, Stethoscope, Loader2, Tag, PlusCircle, Pill, Sparkles, LineChart, UserCircle, MessageSquare, HelpCircle } from "lucide-react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import DashboardServices from "@/components/dashboard/DashboardServices";
import MedicalHistoryPage from "./MedicalHistoryPage";
import TreatmentOptionsPage from "./TreatmentOptionsPage";
import HealthRecordsPage from "./HealthRecordsPage";
import PastAppointmentsPage from "./PastAppointmentsPage";
import PrescriptionsPage from "./PrescriptionsPage";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookAppointmentFlow from "@/components/dashboard/BookingFlow/BookAppointmentFlow";
import { GlassCard } from "@/components/ui/GlassCard";
import useAppointment from "@/hooks/useAppointment";
import { format, parseISO } from "date-fns";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { getAppointments, isLoading: appointmentsLoading } = useAppointment();
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
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
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
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

  // Fetch upcoming appointments
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const appointments = await getAppointments();
        
        // Find the first upcoming appointment (assuming appointments are sorted)
        const upcoming = appointments.find(apt => apt.status === 'upcoming');
        if (upcoming) {
          setUpcomingAppointment(upcoming);
        }
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
      }
    };

    if (!isLoading) {
      fetchUpcomingAppointments();
    }
  }, [getAppointments, isLoading]);

  // Format date for display
  const formatAppointmentDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), "MMMM d'th' 'at' h:mm a");
    } catch (error) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-health-50/30">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary/70 mb-4" />
          <span className="text-lg font-medium text-primary/90">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const DashboardHome = () => (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Welcome section */}
      <div className="mb-8 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="h-16 w-16 text-white animate-pulse-slow" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <div className="w-32 h-32 rounded-full border-2 border-white"></div>
        </div>
        <div className="relative p-8 z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center">
                Welcome back, <span className="ml-2 text-yellow-300">{userName}</span>
                <Sparkles className="h-6 w-6 ml-3 text-yellow-400 animate-pulse-slow" />
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Track your health journey and upcoming appointments
              </p>
            </div>
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 group">
                  <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Book a New Appointment
                </Button>
              </DialogTrigger>
              <BookAppointmentFlow onClose={() => setBookingDialogOpen(false)} />
            </Dialog>
          </div>
        </div>
      </div>

      {/* Current Treatment Card - Show real appointment data */}
      <GlassCard 
        className="mb-8 rounded-xl overflow-hidden"
        variant="colored"
        borderEffect
        glowEffect
      >
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shadow-inner">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-medium text-gray-800">Current Treatment</h2>
            </div>
            
            {appointmentsLoading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading appointment data...</span>
              </div>
            ) : upcomingAppointment ? (
              <div>
                <div className="flex items-center gap-4 mb-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Upcoming Appointment:</span>
                    <span className="ml-2 text-primary/80 font-medium">
                      {formatAppointmentDate(upcomingAppointment.appointment_date)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 mb-4">
                  <span className="text-sm text-gray-600">
                    With <span className="font-medium">{upcomingAppointment.doctor_name}</span> 
                    {upcomingAppointment.service_name && (
                      <> for <span className="font-medium">{upcomingAppointment.service_name}</span></>
                    )}
                  </span>
                </div>
                
                <Button 
                  className="mt-2 shadow-sm transition-all hover:shadow-md bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90 group" 
                  size="sm"
                  onClick={() => navigate("/dashboard/past-appointments")}
                >
                  View Appointment
                  <CalendarDays className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                <Button 
                  className="mt-4 shadow-sm transition-all hover:shadow-md bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90 group" 
                  size="sm"
                  onClick={() => setBookingDialogOpen(true)}
                >
                  Schedule Appointment
                  <PlusCircle className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </div>
            )}
          </div>
          <div className="bg-muted/5 p-6 w-full md:w-auto flex flex-col items-start justify-center border-t md:border-t-0 md:border-l border-border/20">
            <p className="text-sm text-muted-foreground mb-2">Your current plans</p>
            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">
                  {upcomingAppointment?.service_name || "No active treatments"}
                </span>
              </div>
              {upcomingAppointment?.service_type && upcomingAppointment.service_type !== upcomingAppointment.service_name && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-sm font-medium">{upcomingAppointment.service_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
      
      <h2 className="text-2xl font-medium mb-6 text-gray-800 flex items-center">
        <CalendarDays className="h-6 w-6 mr-2 text-primary/70" />
        Your Appointments
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard 
          className="rounded-xl"
          variant="elevated"
          hoverEffect
          borderEffect
        >
          <h2 className="text-xl font-medium mb-4 text-gray-800">Upcoming Appointments</h2>
          <AppointmentHistory />
        </GlassCard>
        
        <GlassCard 
          className="lg:col-span-1 rounded-xl" 
          variant="accent"
          hoverEffect
          borderEffect
        >
          <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-primary/70" />
            Quick Links
          </h3>
          <div className="space-y-2.5">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left hover:bg-health-50/50 hover:border-health-200/50 transition-colors shadow-sm group" 
              onClick={() => navigate("/dashboard/medical-history")}
            >
              <ClipboardList className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span>View Medical History</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-3 w-3 text-primary/70" />
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left hover:bg-health-50/50 hover:border-health-200/50 transition-colors shadow-sm group" 
              onClick={() => navigate("/dashboard/health-records")}
            >
              <UserCircle className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span>Access Health Records</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-3 w-3 text-primary/70" />
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left hover:bg-health-50/50 hover:border-health-200/50 transition-colors shadow-sm group" 
              onClick={() => navigate("/dashboard/prescriptions")}
            >
              <Pill className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span>My Prescriptions</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-3 w-3 text-primary/70" />
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left hover:bg-health-50/50 hover:border-health-200/50 transition-colors shadow-sm group" 
              onClick={() => navigate("/dashboard/treatment-options")}
            >
              <Stethoscope className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span>Explore Treatment Options</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-3 w-3 text-primary/70" />
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left hover:bg-health-50/50 hover:border-health-200/50 transition-colors shadow-sm group" 
              onClick={() => navigate("/dashboard/support")}
            >
              <HelpCircle className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span>Get Support</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <MessageSquare className="h-3 w-3 text-primary/70" />
              </div>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-health-50/20">      
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/services" element={<DashboardServices />} />
        <Route path="/past-appointments" element={<PastAppointmentsPage />} />
        <Route path="/medical-history" element={<MedicalHistoryPage />} />
        <Route path="/treatment-options" element={<TreatmentOptionsPage />} />
        <Route path="/health-records" element={<HealthRecordsPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
