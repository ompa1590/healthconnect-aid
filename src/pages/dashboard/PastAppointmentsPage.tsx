
import React, { useState } from "react";
import { 
  CalendarClock, 
  Clock, 
  FileText, 
  MessageSquareText, 
  Pill, 
  User2, 
  X,
  Search,
  ArrowLeft,
  Stethoscope,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";

type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "completed";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
};

const PastAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  const pastAppointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "February 29, 2024",
      time: "2:30 PM",
      status: "completed",
      summary: "Patient presented with persistent rash on forearms. Diagnosed as contact dermatitis.",
      recommendations: "Avoid scented soaps and detergents. Apply prescribed hydrocortisone cream twice daily.",
      medications: ["Hydrocortisone 1% cream", "Cetirizine 10mg tablets"],
      followUp: "Return in 2 weeks if symptoms persist."
    },
    {
      id: 2,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      date: "February 14, 2024",
      time: "10:00 AM",
      status: "completed",
      summary: "Annual check-up. All vitals within normal range.",
      recommendations: "Continue regular exercise and balanced diet.",
      medications: [],
      followUp: "Schedule next annual check-up in 12 months."
    },
    {
      id: 3,
      doctor: "Dr. James Wilson",
      specialty: "Cardiologist",
      date: "January 19, 2024",
      time: "3:45 PM",
      status: "completed",
      summary: "Follow-up after mild palpitations. ECG showed normal sinus rhythm.",
      recommendations: "Continue monitoring. Reduce caffeine intake.",
      medications: ["Propranolol 10mg as needed"],
      followUp: "Return in 3 months for follow-up ECG."
    },
    {
      id: 4,
      doctor: "Dr. Lisa Patel",
      specialty: "Endocrinologist",
      date: "December 4, 2023",
      time: "1:15 PM",
      status: "completed",
      summary: "Thyroid function assessment. TSH slightly elevated.",
      recommendations: "Regular monitoring of thyroid function.",
      medications: ["Levothyroxine 25mcg daily"],
      followUp: "Blood work in 6 weeks to check medication efficacy."
    },
    {
      id: 5,
      doctor: "Dr. Robert Garcia",
      specialty: "Psychiatrist",
      date: "November 9, 2023",
      time: "11:30 AM",
      status: "completed",
      summary: "Initial consultation for mild anxiety and sleep disturbance.",
      recommendations: "Practice recommended mindfulness techniques and sleep hygiene.",
      medications: ["Melatonin 3mg before bedtime as needed"],
      followUp: "Follow-up in 4 weeks to assess progress."
    }
  ];

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const filteredAppointments = pastAppointments.filter(appointment => 
    appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-normal font-poppins flex items-center">
          Past Appointments
          <CalendarClock className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>

      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/30 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-primary/70 mr-2" />
                <h2 className="text-xl font-medium">Your Medical Journey</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Review your past appointments, treatments, and medical recommendations.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/80 backdrop-blur-sm border-border/30"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-border/30 backdrop-blur-sm">
            No appointments found matching your search
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <GlassCard 
              key={appointment.id}
              className="p-0 cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              variant="elevated"
              borderEffect
              onClick={() => openAppointmentDetails(appointment)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium font-poppins">{appointment.doctor}</h3>
                      <p className="text-primary/80">{appointment.specialty}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-primary/10 transition-colors duration-200 group"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Details</span>
                    <Sparkles className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
                
                <div className="flex gap-6 mt-4 text-muted-foreground">
                  <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                    <CalendarClock className="h-4 w-4 text-primary/70" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-md sm:max-w-lg animate-in fade-in-0 zoom-in-90 bg-white/95 backdrop-blur-lg border border-border/30">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-medium font-poppins">Appointment Details</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedAppointment(null)}
              className="h-8 w-8 hover:bg-primary/5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {selectedAppointment && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg font-poppins">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <CalendarClock className="h-4 w-4 text-primary/70" />
                  <span>{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>

              {selectedAppointment.summary && (
                <GlassCard className="!p-4 space-y-2" variant="subtle">
                  <h4 className="font-medium flex items-center gap-2 font-poppins">
                    <FileText className="h-4 w-4 text-primary" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.summary}</p>
                </GlassCard>
              )}

              {selectedAppointment.recommendations && (
                <GlassCard className="!p-4 space-y-2" variant="subtle">
                  <h4 className="font-medium flex items-center gap-2 font-poppins">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    Recommendations
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.recommendations}</p>
                </GlassCard>
              )}

              {selectedAppointment.medications && selectedAppointment.medications.length > 0 && (
                <GlassCard className="!p-4 space-y-2" variant="subtle">
                  <h4 className="font-medium flex items-center gap-2 font-poppins">
                    <Pill className="h-4 w-4 text-primary" />
                    Prescribed Medications
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground pl-1">
                    {selectedAppointment.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              {selectedAppointment.followUp && (
                <GlassCard className="!p-4 space-y-2" variant="subtle">
                  <h4 className="font-medium flex items-center gap-2 font-poppins">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Follow-up
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.followUp}</p>
                </GlassCard>
              )}

              <div className="pt-2">
                <Button 
                  className="w-full bg-primary/90 hover:bg-primary group"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                  <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PastAppointmentsPage;
