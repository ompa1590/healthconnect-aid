
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  CalendarClock, 
  Clock, 
  Video, 
  FileText, 
  Search,
  Calendar,
  DollarSign,
  Loader2 
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
  patient_id: string;
  provider_id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patientId?: string; // For backwards compatibility
  reason?: string; // For backwards compatibility with existing components
  date?: Date; // For backwards compatibility
  time?: string; // For backwards compatibility
}

interface AvailabilitySlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Fetch appointments for the provider
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        setError('No authenticated session found');
        setLoading(false);
        return;
      }

      const providerId = sessionData.session.user.id;
      
      // Get appointments for this provider
      const { data, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!patient_id(name, id)
        `)
        .eq('provider_id', providerId);
      
      if (appointmentsError) throw appointmentsError;
      
      if (data) {
        // Process the appointments data to add patient names
        const processedAppointments = data.map((apt: any) => {
          // Format the appointment data to match the expected structure
          // including backward compatibility with existing components
          return {
            id: apt.id,
            patient_id: apt.patient_id,
            provider_id: apt.provider_id,
            service: apt.service,
            booking_date: apt.booking_date,
            booking_time: apt.booking_time,
            status: apt.status,
            notes: apt.notes,
            created_at: apt.created_at,
            updated_at: apt.updated_at,
            patient_name: apt.profiles?.name || 'Unknown Patient',
            patientId: apt.profiles?.id || apt.patient_id, // For backward compatibility
            reason: apt.service, // For backward compatibility
            date: new Date(apt.booking_date), // For backward compatibility
            time: apt.booking_time, // For backward compatibility
          };
        });
        
        setAppointments(processedAppointments);
      }
    } catch (err: any) {
      console.error('Error fetching provider appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: `Appointment status updated to ${status}.`,
        });
        
        // Refresh appointments
        fetchAppointments();
        return data[0];
      }
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update appointment status.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Fetch appointments when component mounts
  useEffect(() => {
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

  const handleConfirmCancel = async (reason: string) => {
    if (!cancelAppointment) return;
    
    try {
      const result = await updateAppointmentStatus(cancelAppointment, 'cancelled');
      if (result) {
        setCancelAppointment(null);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
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
    appointment.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.patientId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatAppointmentDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => fetchAppointments()}
        >
          Try Again
        </Button>
      </div>
    );
  }

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
              {filteredAppointments.filter(a => a.status === "confirmed").length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming appointments found
                </div>
              ) : (
                filteredAppointments
                  .filter(a => a.status === "confirmed")
                  .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-6 py-5 hover:bg-muted/20 transition-all duration-200 border-b last:border-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shadow-sm">
                            {appointment.patient_name?.split(' ').map(n => n[0]).join('') || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins text-lg leading-tight tracking-tight">{appointment.service}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-primary/80">{appointment.patientId}</span> 
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span> 
                              {appointment.patient_name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full shadow-sm">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{formatAppointmentDate(new Date(appointment.booking_date))}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full shadow-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{appointment.booking_time}</span>
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
                            {appointment.patient_name?.split(' ').map(n => n[0]).join('') || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins tracking-tight">{appointment.service}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-primary/80">{appointment.patientId}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                              {appointment.patient_name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatAppointmentDate(new Date(appointment.booking_date))}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.booking_time}</span>
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
                            {appointment.patient_name?.split(' ').map(n => n[0]).join('') || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins line-through tracking-tight">{appointment.service}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <span className="font-medium text-muted/80">{appointment.patientId}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                              {appointment.patient_name}
                            </p>
                            <p className="text-xs text-destructive mt-1">Cancelled</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm ml-13">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            <span className="line-through">{formatAppointmentDate(new Date(appointment.booking_date))}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="line-through">{appointment.booking_time}</span>
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
        appointmentId={Number(cancelAppointment) || 0}
        patientName={getActiveAppointment()?.patient_name || ""}
        onConfirmCancel={handleConfirmCancel}
      />

      {visitReasonAppointment && getActiveAppointment() && (
        <VisitReasonDialog
          isOpen={visitReasonAppointment !== null}
          onClose={() => setVisitReasonAppointment(null)}
          appointment={{
            id: Number(getActiveAppointment()?.id || 0),
            patientName: getActiveAppointment()?.patient_name || "",
            patientId: getActiveAppointment()?.patientId || "",
            appointmentType: getActiveAppointment()?.service || "",
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
            id: Number(getActiveAppointment()?.id || 0),
            patient: getActiveAppointment()?.patient_name || "",
            patientId: getActiveAppointment()?.patientId || "",
            reason: getActiveAppointment()?.service || "",
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
            id: Number(getActiveAppointment()?.id || 0),
            patient: getActiveAppointment()?.patient_name || "",
            patientId: getActiveAppointment()?.patientId || "",
            reason: getActiveAppointment()?.service || "",
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
