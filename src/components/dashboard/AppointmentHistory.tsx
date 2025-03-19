
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, FileText, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";

type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
};

const AppointmentHistory = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-03-15",
      time: "2:30 PM",
      status: "completed",
      summary: "Routine skin checkup. No concerns identified.",
      recommendations: "Continue using prescribed sunscreen daily.",
      medications: [],
      followUp: "Schedule next annual checkup in 12 months."
    },
  ];

  const handleViewDetails = (appointment: Appointment) => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setSelectedAppointment(appointment);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
              appointment.status === "upcoming"
                ? "bg-primary/5 border-primary/20"
                : "bg-muted/50 border-border/50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="transition-all duration-200 group-hover:translate-x-1">
                <h3 className="font-medium">{appointment.doctor}</h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.specialty}
                </p>
              </div>
              {appointment.status === "upcoming" ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="transition-all duration-300 hover:bg-primary/20"
                >
                  Join Call
                  <Video className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="transition-all duration-300 hover:bg-primary/20"
                  onClick={() => handleViewDetails(appointment)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                {appointment.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={loading || !!selectedAppointment} onOpenChange={(open) => {
        if (!open) {
          setSelectedAppointment(null);
          setLoading(false);
        }
      }}>
        <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-90">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <HeartPulseLoader size="lg" />
              <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
            </div>
          ) : selectedAppointment && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span>{selectedAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedAppointment.time}</span>
                  </div>
                </div>
                
                {selectedAppointment.summary && (
                  <div>
                    <h4 className="font-medium">Summary</h4>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.summary}</p>
                  </div>
                )}
                
                {selectedAppointment.recommendations && (
                  <div>
                    <h4 className="font-medium">Recommendations</h4>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.recommendations}</p>
                  </div>
                )}
                
                {selectedAppointment.medications && selectedAppointment.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium">Prescribed Medications</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {selectedAppointment.medications.map((med, i) => (
                        <li key={i}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedAppointment.followUp && (
                  <div>
                    <h4 className="font-medium">Follow-up</h4>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.followUp}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentHistory;
