import React, { useState } from "react";
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

interface Appointment {
  id: number;
  patient: string;
  patientId: string;
  age: number;
  reason: string;
  date: Date;
  time: string;
  status: string;
}

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: "Emily Johnson",
      patientId: "PTN-CE550N",
      age: 34,
      reason: "Annual checkup",
      date: new Date(2024, 2, 22),
      time: "09:00 - 09:30 AM",
      status: "upcoming",
    },
    {
      id: 2,
      patient: "Michael Rodriguez",
      patientId: "PTN-MR421K",
      age: 52,
      reason: "Diabetes management",
      date: new Date(2024, 2, 22),
      time: "10:30 - 11:00 AM",
      status: "upcoming",
    },
    {
      id: 3,
      patient: "Sarah Parker",
      patientId: "PTN-SP785Q",
      age: 28,
      reason: "Psychiatry consultation",
      date: new Date(2024, 2, 21),
      time: "02:00 - 02:30 PM",
      status: "completed",
    },
    {
      id: 4,
      patient: "Emma Williams",
      patientId: "PTN-EW334P",
      age: 42,
      reason: "Family Planning counseling",
      date: new Date(2024, 2, 23),
      time: "11:15 - 11:45 AM",
      status: "upcoming",
    },
    {
      id: 5,
      patient: "James Anderson",
      patientId: "PTN-JA652T",
      age: 38,
      reason: "Follow-up consultation",
      date: new Date(2024, 2, 23),
      time: "03:30 - 04:00 PM",
      status: "upcoming",
    }
  ]);
  
  const [cancelAppointment, setCancelAppointment] = useState<number | null>(null);
  const [visitReasonAppointment, setVisitReasonAppointment] = useState<number | null>(null);
  const [notesAppointment, setNotesAppointment] = useState<number | null>(null);
  const [billingAppointment, setBillingAppointment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  const handleCancelAppointment = (appointmentId: number) => {
    setCancelAppointment(appointmentId);
  };

  const handleViewVisitReason = (appointmentId: number) => {
    setVisitReasonAppointment(appointmentId);
  };

  const handleViewNotes = (appointmentId: number) => {
    setNotesAppointment(appointmentId);
  };

  const handleBillingClaim = (appointmentId: number) => {
    setBillingAppointment(appointmentId);
  };

  const handleConfirmCancel = (reason: string, details?: string) => {
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
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Set Availability
          </Button>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Start Consultation
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-poppins">Upcoming Appointments</CardTitle>
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
                      className="px-4 py-4 hover:bg-muted/30 transition-colors border-b last:border-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins text-lg leading-tight">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.patientId} - {appointment.patient}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm ml-13">
                          <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-full">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{formatAppointmentDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-full">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                            <Video className="h-4 w-4" />
                            <span className="font-medium">Video Call</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto mt-2 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewVisitReason(appointment.id)}
                          >
                            Visit Reason
                          </Button>
                          <Button size="sm">
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
                      className="px-4 py-4 hover:bg-muted/30 transition-colors border-b last:border-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.patientId} - {appointment.patient}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm ml-13">
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
                            onClick={() => handleViewNotes(appointment.id)}
                          >
                            <FileText className="mr-1.5 h-4 w-4" />
                            View Notes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
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
                      className="px-4 py-4 hover:bg-muted/30 transition-colors border-b last:border-0 opacity-75"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground font-semibold">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold font-poppins line-through">{appointment.reason}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.patientId} - {appointment.patient}
                            </p>
                            <p className="text-xs text-destructive mt-1">Cancelled</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm ml-13">
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
        appointmentId={cancelAppointment || 0}
        patientName={getActiveAppointment()?.patient || ""}
        onConfirmCancel={handleConfirmCancel}
      />

      {visitReasonAppointment && getActiveAppointment() && (
        <VisitReasonDialog
          isOpen={visitReasonAppointment !== null}
          onClose={() => setVisitReasonAppointment(null)}
          appointment={{
            id: getActiveAppointment()?.id || 0,
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
            id: getActiveAppointment()?.id || 0,
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
            id: getActiveAppointment()?.id || 0,
            patient: getActiveAppointment()?.patient || "",
            patientId: getActiveAppointment()?.patientId || "",
            reason: getActiveAppointment()?.reason || "",
            date: getActiveAppointment()?.date || new Date(),
            time: getActiveAppointment()?.time || "",
          }}
        />
      )}
    </div>
  );
};

export default ProviderAppointments;
