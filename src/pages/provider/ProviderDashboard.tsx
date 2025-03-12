
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarDays, ClipboardList, Users, Clock, Stethoscope } from "lucide-react";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderPatients from "@/components/provider/ProviderPatients";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Provider Dashboard</h1>
      
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-transparent">
          <TabsTrigger value="appointments" className="w-full data-[state=active]:bg-primary/10">
            <CalendarDays className="mr-2 h-5 w-5" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="schedule" className="w-full data-[state=active]:bg-primary/10">
            <Clock className="mr-2 h-5 w-5" />
            My Schedule
          </TabsTrigger>
          <TabsTrigger value="patients" className="w-full data-[state=active]:bg-primary/10">
            <Users className="mr-2 h-5 w-5" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="treatments" className="w-full data-[state=active]:bg-primary/10">
            <Stethoscope className="mr-2 h-5 w-5" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
            <ProviderAppointments />
          </GlassCard>
        </TabsContent>

        <TabsContent value="schedule">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Manage Schedule</h2>
            <ProviderSchedule />
          </GlassCard>
        </TabsContent>

        <TabsContent value="patients">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">My Patients</h2>
            <ProviderPatients />
          </GlassCard>
        </TabsContent>

        <TabsContent value="treatments">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">My Services</h2>
            <p>Manage the healthcare services you provide to patients.</p>
            {/* This section would be implemented later */}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
