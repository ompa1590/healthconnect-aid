import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, FileText, Video, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const navigate = useNavigate();

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

  const handleChatWithDoctor = (doctorName: string) => {
    // Navigate to the chat tab and select the doctor
    navigate("/dashboard/prescriptions");
    
    // Wait for the page to load then click on the chat tab
    setTimeout(() => {
      const chatTab = document.getElementById("chat-tab");
      if (chatTab) {
        chatTab.click();
      }
    }, 100);
  };

  return (
    <>
      <div className="space-y-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={cn(
              "p-6 rounded-xl border transition-all duration-300",
              "hover:shadow-lg hover:border-primary/30",
              "bg-gradient-to-r from-white to-muted/20",
              appointment.status === "upcoming" 
                ? "border-primary/20 shadow-sm" 
                : "border-border/50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">{appointment.doctor}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {appointment.specialty}
                </p>
                <Badge variant={appointment.status === "upcoming" ? "default" : "secondary"} className="mt-2">
                  {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
                </Badge>
              </div>
              <div className="flex gap-3">
                {appointment.status === "upcoming" ? (
                  <Button 
                    variant="default"
                    size="sm"
                    className="transition-all duration-300 hover:scale-105"
                  >
                    Join Call
                    <Video className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="transition-all duration-300 hover:bg-primary/10"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:bg-primary/10"
                  onClick={() => handleChatWithDoctor(appointment.doctor)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                <span className="font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{appointment.time}</span>
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
        <DialogContent className="sm:max-w-lg p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <HeartPulseLoader size="lg" />
              <p className="mt-4 text-muted-foreground font-medium">Loading appointment details...</p>
            </div>
          ) : selectedAppointment && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{selectedAppointment.doctor}</h2>
                <p className="text-primary/80 font-medium">{selectedAppointment.specialty}</p>
                <Badge variant="outline" className="mt-1">
                  {selectedAppointment.status}
                </Badge>
              </div>
              
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedAppointment.time}</span>
                </div>
              </div>
              
              <Separator />
              
              {selectedAppointment.summary && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedAppointment.summary}</p>
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
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAppointment(null);
                    handleChatWithDoctor(selectedAppointment.doctor);
                  }}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Doctor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentHistory;
