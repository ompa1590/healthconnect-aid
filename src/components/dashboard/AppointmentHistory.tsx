
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, FileText, Video, MessageCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAppointment from "@/hooks/useAppointment";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

type Appointment = {
  id: number | string;
  doctor?: string;
  specialty?: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "in_progress";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
  service_type?: string;
  service_name?: string;
  provider_id?: string;
  doctor_name?: string;
  patient_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  reason?: string;
};

const AppointmentHistory = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const navigate = useNavigate();
  const { getAppointments, isLoading, error } = useAppointment();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments...");
        const fetchedAppointments = await getAppointments();
        
        // Transform the fetched appointments to match our component's expected format
        const formattedAppointments = fetchedAppointments.map(apt => {
          return {
            id: apt.id,
            // Use the saved doctor_name first, then fall back to formatting the provider_id if needed
            doctor: apt.doctor_name || `Dr. ${apt.provider_id?.substring(0, 8) || "Unknown"}`,
            // Use the service_name if available, otherwise fall back to service_type
            specialty: apt.service_name || apt.service_type || "General Practitioner",
            date: apt.appointment_date || new Date().toISOString().split('T')[0],
            time: apt.appointment_time || "10:00 AM",
            status: apt.status as "upcoming" | "completed" | "cancelled" | "in_progress", 
            service_type: apt.service_type,
            service_name: apt.service_name,
            reason: apt.reason || "No reason provided",
            provider_id: apt.provider_id,
            doctor_name: apt.doctor_name,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time
          };
        });

        setAppointments(formattedAppointments);
      } catch (err) {
        console.error("Error in appointment fetch effect:", err);
      }
    };

    fetchAppointments();
  }, [getAppointments, retryCount]);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
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

  const formatAppointmentDate = (dateStr: string) => {
    try {
      // Try to parse the date string and format it
      const date = parseISO(dateStr);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      // Fallback if the date can't be parsed
      return dateStr;
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Retrying",
      description: "Attempting to reconnect and fetch your appointments...",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <HeartPulseLoader size="lg" />
        <p className="mt-4 text-muted-foreground font-medium">Loading your appointments...</p>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border rounded-xl p-8 bg-muted/10">
        <h3 className="text-xl font-medium mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-6">We couldn't load your appointments due to a connection issue.</p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl p-8 bg-muted/10">
        <h3 className="text-xl font-medium mb-2">No appointments found</h3>
        <p className="text-muted-foreground mb-6">You don't have any upcoming appointments scheduled.</p>
        <Button onClick={() => navigate("/dashboard?tab=bookappointment")}>
          Schedule an Appointment
        </Button>
      </div>
    );
  }

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
              appointment.status === "upcoming" || appointment.status === "in_progress"
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
                <Badge variant={appointment.status === "upcoming" || appointment.status === "in_progress" ? "default" : "secondary"} className="mt-2">
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex gap-3">
                {(appointment.status === "upcoming" || appointment.status === "in_progress") ? (
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
                <span className="font-medium">{formatAppointmentDate(appointment.appointment_date || appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{appointment.appointment_time || appointment.time}</span>
              </div>
            </div>
            {appointment.reason && (
              <div className="mt-3 text-sm text-muted-foreground border-t pt-3 border-border/30">
                <span className="font-medium">Reason:</span> {appointment.reason}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => {
        if (!open) {
          setSelectedAppointment(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg p-6">
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{selectedAppointment.doctor}</h2>
                <p className="text-primary/80 font-medium">{selectedAppointment.service_type || selectedAppointment.specialty}</p>
                <Badge variant="outline" className="mt-1">
                  {selectedAppointment.status}
                </Badge>
              </div>
              
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{formatAppointmentDate(selectedAppointment.date)}</span>
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
