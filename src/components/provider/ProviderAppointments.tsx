import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  CalendarClock, 
  Clock, 
  Video, 
  FileText, 
  XCircle, 
  Search,
  Calendar,
  DollarSign 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CancelAppointmentDialog from "./CancelAppointmentDialog";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisitReasonDialog from "./VisitReasonDialog";
import ConsultationNotesDialog from "./ConsultationNotesDialog";
import OHIPBillingDialog from "./OHIPBillingDialog";
import AvailabilityDialog from "./AvailabilityDialog";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  patient: string;
  patientId: string;
  age?: number;
  reason: string;
  date: Date;
  time: string;
  status: string;
  patientEmail?: string;
}

interface AvailabilitySlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Using string type consistently for all appointment IDs
  const [cancelAppointment, setCancelAppointment] = useState<string | null>(null);
  const [visitReasonAppointment, setVisitReasonAppointment] = useState<string | null>(null);
  const [notesAppointment, setNotesAppointment] = useState<string | null>(null);
  const [billingAppointment, setBillingAppointment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [providerAvailability, setProviderAvailability] = useState<AvailabilitySlot[]>([
    { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00" },
    { id: 2, day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    { id: 3, day: "Wednesday", startTime: "09:00", endTime: "17:00" },
    { id: 4, day: "Thursday", startTime: "09:00", endTime: "17:00" },
    { id: 5, day: "Friday", startTime: "09:00", endTime: "15:00" },
  ]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Get the current provider's ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        console.log("Fetching appointments for provider ID:", user.id);
        
        // Fetch appointments from the appointments table
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('provider_id', user.id);
          
        if (error) {
          console.error("Error fetching appointments:", error);
          throw error;
        }
        
        console.log("Fetched appointments data:", data);
        
        if (data && data.length > 0) {
          // Format the appointments data
          const formattedAppointments: Appointment[] = data.map(apt => ({
            id: apt.id.toString(),
            patient: apt.patient_name,
            patientId: apt.patient_id || `PTN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            reason: apt.reason || apt.service_type,
            date: new Date(apt.appointment_date),
            time: apt.appointment_time,
            status: apt.status,
            patientEmail: apt.patient_email
          }));
          
          setAppointments(formattedAppointments);
          console.log("Formatted appointments:", formattedAppointments);
        } else {
          console.log("No appointments found, using fallback data");
          // Fallback to dummy data if no appointments found
          setAppointments([
            {
              id: "1",
              patient: "Emily Johnson",
              patientId: "PTN-CE550N",
              age: 34,
              reason: "Annual checkup",
              date: new Date(2024, 2, 22),
              time: "09:00 - 09:30 AM",
              status: "upcoming",
            },
            {
              id: "2",
              patient: "Michael Rodriguez",
              patientId: "PTN-MR421K",
              age: 52,
              reason: "Diabetes management",
              date: new Date(2024, 2, 22),
              time: "10:30 - 11:00 AM",
              status: "upcoming",
            },
            {
              id: "3",
              patient: "Sarah Parker",
              patientId: "PTN-SP785Q",
              age: 28,
              reason: "Psychiatry consultation",
              date: new Date(2024, 2, 21),
              time: "02:00 - 02:30 PM",
              status: "completed",
            },
            {
              id: "4",
              patient: "Emma Williams",
              patientId: "PTN-EW334P",
              age: 42,
              reason: "Family Planning counseling",
              date: new Date(2024, 2, 23),
              time: "11:15 - 11:45 AM",
              status: "upcoming",
            },
            {
              id: "5",
              patient: "James Anderson",
              patientId: "PTN-JA652T",
              age: 38,
              reason: "Follow-up consultation",
              date: new Date(2024, 2, 23),
              time: "03:30 - 04:00 PM",
              status: "upcoming",
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        // Use the fallback data on error
        setAppointments([
          {
            id: "1",
            patient: "Emily Johnson",
            patientId: "PTN-CE550N",
            age: 34,
            reason: "Annual checkup",
            date: new Date(2024, 2, 22),
            time: "09:00 - 09:30 AM",
            status: "upcoming",
          },
          {
            id: "2",
            patient: "Michael Rodriguez",
            patientId: "PTN-MR421K",
            age: 52,
            reason: "Diabetes management",
            date: new Date(2024, 2, 22),
            time: "10:30 - 11:00 AM",
            status: "upcoming",
          },
          {
            id: "3",
            patient: "Sarah Parker",
            patientId: "PTN-SP785Q",
            age: 28,
            reason: "Psychiatry consultation",
            date: new Date(2024, 2, 21),
            time: "02:00 - 02:30 PM",
            status: "completed",
          },
          {
            id: "4",
            patient: "Emma Williams",
            patientId: "PTN-EW334P",
            age: 42,
            reason: "Family Planning counseling",
            date: new Date(2024, 2, 23),
            time: "11:15 - 11:45 AM",
            status: "upcoming",
          },
          {
            id: "5",
            patient: "James Anderson",
            patientId: "PTN-JA652T",
            age: 38,
            reason: "Follow-up consultation",
            date: new Date(2024, 2, 23),
            time: "03:30 - 04:00 PM",
            status: "upcoming",
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointmentId: string) => {
    setCancelAppointment(appointmentId);
  };

  const handleViewVisitReason = (appointmentId: string) => {
    setVisitReasonAppointment(appointmentId);
  };

  const handleViewNotes = (appointmentId: string) => {
    setNotesAppointment(appointmentId);
  };

  const handleBillingClaim = (appointmentId: string) => {
    setBillingAppointment(appointmentId);
  };

  const handleConfirmCancel = async (reason: string, details?: string) => {
    try {
      // Update appointment status in the database
      if (cancelAppointment) {
        await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', cancelAppointment);
      }
      
      // Update local state
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.id === cancelAppointment) {
          return {
            ...appointment,
            status: "cancelled"
          };
        }
        return appointment;
      });
      
      setAppointments(updatedAppointments);
      setCancelAppointment(null);
      
      toast({
        title: "Appointment Cancelled",
        description: `The appointment has been cancelled successfully.`,
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAvailability = (availability: AvailabilitySlot[]) => {
    setProviderAvailability(availability);
    toast({
      title: "Availability Updated",
      description: "Your availability settings have been saved successfully.",
    });
  };

  const getActiveAppointment = () => {
    return appointments.find(a => 
      a.id === cancelAppointment || 
      a.id === visitReasonAppointment || 
      a.id === notesAppointment ||
      a.id === billingAppointment
    );
  };

  const filteredAppointments = appointments.filter(appointment => 
    appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatAppointmentDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold font-poppins">Your Appointments</h2>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowAvailabilityDialog(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Set Availability
          </Button>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Start Consultation
          </Button>
        </div>
      </div>
      
      <Card className="shadow-md border-0 overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-xl font-poppins tracking-tight">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="upcoming">
            <div className="px-4 border-b">
              <TabsList className="mb-0">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming" className="pt-2 space-y-1">
              {filteredAppointments.filter(a => a.status === "upcoming").length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming appointments found
                </div>
              ) : (
                filteredAppointments
                  .filter(a => a.status === "upcoming")
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-6 py-5 hover:bg-muted/20 transition-all duration-200 border-b last:border-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shadow-sm">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins text-lg leading-tight tracking-tight">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-primary/80">{appointment.patientId}</span> 
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span> 
                              {appointment.patient}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full shadow-sm">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{formatAppointmentDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full shadow-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full shadow-sm">
                            <Video className="h-4 w-4" />
                            <span className="font-medium">Video Call</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto mt-2 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 shadow-sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="shadow-sm hover:bg-primary/5"
                            onClick={() => handleViewVisitReason(appointment.id)}
                          >
                            Visit Reason
                          </Button>
                          <Button size="sm" className="shadow-sm font-medium">
                            <Video className="mr-1.5 h-4 w-4" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-2">
              {filteredAppointments.filter(a => a.status === "completed").length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No completed appointments found
                </div>
              ) : (
                filteredAppointments
                  .filter(a => a.status === "completed")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-6 py-5 hover:bg-muted/20 transition-all duration-200 border-b last:border-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary font-semibold shadow-sm">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins tracking-tight">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-primary/80">{appointment.patientId}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                              {appointment.patient}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatAppointmentDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto mt-2 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="shadow-sm hover:bg-primary/5"
                            onClick={() => handleViewNotes(appointment.id)}
                          >
                            <FileText className="mr-1.5 h-4 w-4" />
                            View Notes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="shadow-sm hover:bg-primary/5"
                            onClick={() => handleBillingClaim(appointment.id)}
                          >
                            <DollarSign className="mr-1.5 h-4 w-4" />
                            Claim
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="pt-2">
              {filteredAppointments.filter(a => a.status === "cancelled").length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No cancelled appointments found
                </div>
              ) : (
                filteredAppointments
                  .filter(a => a.status === "cancelled")
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-6 py-5 hover:bg-muted/20 transition-all duration-200 border-b last:border-0 opacity-75"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground font-semibold shadow-sm">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins line-through tracking-tight">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-muted/80">{appointment.patientId}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                              {appointment.patient}
                            </p>
                            <p className="text-xs text-destructive mt-1">Cancelled</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <span className="line-through">{formatAppointmentDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="line-through">{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <CancelAppointmentDialog
        isOpen={cancelAppointment !== null}
        onClose={() => setCancelAppointment(null)}
        appointmentId={cancelAppointment !== null ? cancelAppointment : "0"}
        patientName={getActiveAppointment()?.patient || ""}
        onConfirmCancel={handleConfirmCancel}
      />

      {visitReasonAppointment && getActiveAppointment() && (
        <VisitReasonDialog
          isOpen={visitReasonAppointment !== null}
          onClose={() => setVisitReasonAppointment(null)}
          appointment={{
            id: visitReasonAppointment,
            patientName: getActiveAppointment()?.patient || "",
            patientId: getActiveAppointment()?.patientId || "",
            appointmentType: getActiveAppointment()?.reason || "",
            date: getActiveAppointment()?.date || new Date(),
            time: getActiveAppointment()?.time || "",
          }}
        />
      )}

      {notesAppointment && getActiveAppointment() && (
        <ConsultationNotesDialog
          isOpen={notesAppointment !== null}
          onClose={() => setNotesAppointment(null)}
          appointment={{
            id: notesAppointment,
            patient: getActiveAppointment()?.patient || "",
            patientId: getActiveAppointment()?.patientId || "",
            reason: getActiveAppointment()?.reason || "",
            date: getActiveAppointment()?.date || new Date(),
            time: getActiveAppointment()?.time || "",
          }}
        />
      )}

      {billingAppointment && getActiveAppointment() && (
        <OHIPBillingDialog
          isOpen={billingAppointment !== null}
          onClose={() => setBillingAppointment(null)}
          appointment={{
            id: billingAppointment,
            patient: getActiveAppointment()?.patient || "",
            patientId: getActiveAppointment()?.patientId || "",
            reason: getActiveAppointment()?.reason || "",
            date: getActiveAppointment()?.date || new Date(),
            time: getActiveAppointment()?.time || "",
          }}
        />
      )}

      <AvailabilityDialog
        isOpen={showAvailabilityDialog}
        onClose={() => setShowAvailabilityDialog(false)}
        onSave={handleSaveAvailability}
        initialAvailability={providerAvailability}
      />
    </div>
  );
};

export default ProviderAppointments;
