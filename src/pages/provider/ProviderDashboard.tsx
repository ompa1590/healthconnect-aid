
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarDays, ClipboardList, Users, Clock, Stethoscope, Award, User, Building, LogOut, Activity, PieChart, Bell, BarChart } from "lucide-react";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderPatients from "@/components/provider/ProviderPatients";
import { MedicalIcon3D } from "@/components/ui/MedicalIcons3D";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health",
      });
      navigate("/admin-login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-secondary/5 to-transparent -z-10"></div>
      <div className="fixed top-40 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 blob-animation"></div>
      <div className="fixed bottom-40 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10 blob-animation-slow"></div>
      
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Provider Info Card */}
        <GlassCard className="p-6 col-span-2 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-2 border-secondary/20">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dr. Sarah Johnson</h1>
              <div className="flex items-center text-muted-foreground">
                <Stethoscope className="h-4 w-4 mr-1" />
                <span>General Practitioner</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="mt-4 md:mt-0 flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </GlassCard>
        
        {/* Quick Stats */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Today's Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
              <CalendarDays className="h-6 w-6 text-secondary mb-1" />
              <span className="text-sm font-medium">Appointments</span>
              <span className="text-xl font-bold">8 today</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
              <Users className="h-6 w-6 text-secondary mb-1" />
              <span className="text-sm font-medium">Patients</span>
              <span className="text-xl font-bold">42 total</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
              <Activity className="h-6 w-6 text-secondary mb-1" />
              <span className="text-sm font-medium">Hours</span>
              <span className="text-xl font-bold">6h left</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
              <Bell className="h-6 w-6 text-secondary mb-1" />
              <span className="text-sm font-medium">Tasks</span>
              <span className="text-xl font-bold">3 pending</span>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-transparent">
          <TabsTrigger value="appointments" className="w-full data-[state=active]:bg-secondary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <CalendarDays className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-secondary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Appointments
          </TabsTrigger>
          <TabsTrigger value="schedule" className="w-full data-[state=active]:bg-secondary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <Clock className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-secondary group-hover:scale-110 transition-transform duration-300" />
            </div>
            My Schedule
          </TabsTrigger>
          <TabsTrigger value="patients" className="w-full data-[state=active]:bg-secondary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <Users className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-secondary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Patients
          </TabsTrigger>
          <TabsTrigger value="treatments" className="w-full data-[state=active]:bg-secondary/10 group transition-all duration-300">
            <div className="relative">
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-muted opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300"></div>
              <Stethoscope className="mr-2 h-5 w-5 relative z-10 group-data-[state=active]:text-secondary group-hover:scale-110 transition-transform duration-300" />
            </div>
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <GlassCard className="lg:col-span-3 transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary/10 rounded-full blur-md"></div>
              <div className="flex items-center mb-4">
                <MedicalIcon3D type="patient" size="sm" color="secondary" className="mr-3" />
                <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
              </div>
              <ProviderAppointments />
            </GlassCard>
            
            <GlassCard className="lg:col-span-2 p-6 transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary/10 rounded-full blur-md"></div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-secondary" />
                Weekly Stats
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Appointments Completed</span>
                    <span className="font-medium">32/35</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Patient Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Schedule Efficiency</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/30">
                  <h3 className="font-medium mb-2">Appointment Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <span className="text-sm">Video Calls</span>
                      <div className="text-xl font-bold text-secondary">65%</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <span className="text-sm">In-person</span>
                      <div className="text-xl font-bold text-secondary">35%</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-full"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="monitor" size="sm" color="secondary" className="mr-3" />
              <h2 className="text-2xl font-semibold">Manage Schedule</h2>
            </div>
            <ProviderSchedule />
          </GlassCard>
        </TabsContent>

        <TabsContent value="patients">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="heart" size="sm" color="secondary" className="mr-3" />
              <h2 className="text-2xl font-semibold">My Patients</h2>
            </div>
            <ProviderPatients />
          </GlassCard>
        </TabsContent>

        <TabsContent value="treatments">
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-md"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="pill" size="sm" color="secondary" className="mr-3" />
              <h2 className="text-2xl font-semibold">My Services</h2>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <Stethoscope className="h-5 w-5 text-secondary mr-2" />
                    <h3 className="font-medium">General Consultations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Basic healthcare consults for common illnesses</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-secondary mr-2" />
                    <h3 className="font-medium">Specializations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Advanced specialized healthcare services</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-secondary mr-2" />
                    <h3 className="font-medium">Facilities</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Locations and equipment available</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2880&auto=format&fit=crop" 
                  alt="Medical services" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center flex-col p-6 text-center">
                  <User className="h-16 w-16 text-secondary/70 mb-4" />
                  <p className="text-lg font-medium">Select a category above to manage your services</p>
                  <p className="text-sm text-muted-foreground mt-2">Configure the healthcare services you provide</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
