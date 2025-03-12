
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import AppointmentHistory from "@/components/dashboard/AppointmentHistory";
import MedicalHistory from "@/components/dashboard/MedicalHistory";
import TreatmentOptions from "@/components/dashboard/TreatmentOptions";
import { CalendarDays, ClipboardList, History, Stethoscope } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Patient Dashboard</h1>
      
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-transparent">
          <TabsTrigger value="appointments" className="w-full data-[state=active]:bg-primary/10">
            <CalendarDays className="mr-2 h-5 w-5" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="history" className="w-full data-[state=active]:bg-primary/10">
            <History className="mr-2 h-5 w-5" />
            Medical History
          </TabsTrigger>
          <TabsTrigger value="treatments" className="w-full data-[state=active]:bg-primary/10">
            <Stethoscope className="mr-2 h-5 w-5" />
            Treatment Options
          </TabsTrigger>
          <TabsTrigger value="records" className="w-full data-[state=active]:bg-primary/10">
            <ClipboardList className="mr-2 h-5 w-5" />
            Health Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h2 className="text-2xl font-semibold mb-4">Schedule Appointment</h2>
              <AppointmentScheduler />
            </GlassCard>
            <GlassCard>
              <h2 className="text-2xl font-semibold mb-4">Upcoming & Past Appointments</h2>
              <AppointmentHistory />
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Medical History</h2>
            <MedicalHistory />
          </GlassCard>
        </TabsContent>

        <TabsContent value="treatments">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Available Treatment Options</h2>
            <TreatmentOptions />
          </GlassCard>
        </TabsContent>

        <TabsContent value="records">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Health Records</h2>
            <p>Your health records and documents will appear here.</p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
