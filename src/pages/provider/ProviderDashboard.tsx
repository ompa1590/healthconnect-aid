
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarDays, ClipboardList, Users, Clock, Stethoscope, Award, User, Building } from "lucide-react";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderPatients from "@/components/provider/ProviderPatients";
import { MedicalIcon3D } from "@/components/ui/MedicalIcons3D";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-secondary/5 to-transparent -z-10"></div>
      <div className="fixed top-40 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 blob-animation"></div>
      <div className="fixed bottom-40 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10 blob-animation-slow"></div>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Provider Dashboard</h1>
        <div className="hidden md:block">
          <MedicalIcon3D type="stethoscope" size="md" color="secondary" />
        </div>
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
          <GlassCard className="transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary/10 rounded-full blur-md"></div>
            <div className="flex items-center mb-4">
              <MedicalIcon3D type="patient" size="sm" color="secondary" className="mr-3" />
              <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
            </div>
            <ProviderAppointments />
          </GlassCard>
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
              <p className="mb-4 text-muted-foreground">Manage the healthcare services you provide to patients.</p>
              
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
              
              <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <User className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Select a category to manage your services</p>
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
