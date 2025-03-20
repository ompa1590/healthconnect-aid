
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarClock, Clock, Video, FileText, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CancelAppointmentDialog from "./CancelAppointmentDialog";

interface Appointment {
  id: number;
  patient: string;
  age: number;
  reason: string;
  date: string;
  time: string;
  status: string;
}

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: "Emily Johnson",
      age: 34,
      reason: "Annual checkup",
      date: "2024-03-22",
      time: "09:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      patient: "Michael Rodriguez",
      age: 52,
      reason: "Diabetes management",
      date: "2024-03-22",
      time: "10:30 AM",
      status: "upcoming",
    },
    {
      id: 3,
      patient: "Sarah Parker",
      age: 28,
      reason: "Persistent headaches",
      date: "2024-03-21",
      time: "02:00 PM",
      status: "completed",
    }
  ]);
  
  const [cancelAppointment, setCancelAppointment] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCancelAppointment = (appointmentId: number) => {
    setCancelAppointment(appointmentId);
  };

  const handleConfirmCancel = (reason: string, details?: string) => {
    const appointmentToCancel = appointments.find(a => a.id === cancelAppointment);
    if (!appointmentToCancel) return;
    
    // In a real app, you would make an API call to cancel the appointment here
    setAppointments(appointments.map(appointment => 
      appointment.id === cancelAppointment 
        ? { ...appointment, status: "cancelled" } 
        : appointment
    ));
    
    toast({
      title: "Appointment Cancelled",
      description: `Appointment with ${appointmentToCancel.patient} has been cancelled.`,
    });
  };

  const getActiveAppointment = () => {
    return appointments.find(a => a.id === cancelAppointment);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Appointments</h2>
        <Button size="sm">
          <Video className="mr-2 h-4 w-4" />
          Start New Consultation
        </Button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={cn(
              "p-4 rounded-lg border transition-all",
              appointment.status === "upcoming"
                ? "bg-primary/5 border-primary/20"
                : appointment.status === "completed"
                ? "bg-muted/50 border-border/50"
                : "bg-red-50 border-red-200 opacity-60"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{appointment.patient}</h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.age} years • {appointment.reason}
                </p>
              </div>
              <div className="flex gap-2">
                {appointment.status === "upcoming" ? (
                  <>
                    <Button variant="outline" size="sm">
                      Join Call
                      <Video className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm">
                    View Notes
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
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
      
      <CancelAppointmentDialog
        isOpen={cancelAppointment !== null}
        onClose={() => setCancelAppointment(null)}
        appointmentId={cancelAppointment || 0}
        patientName={getActiveAppointment()?.patient || ""}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};

export default ProviderAppointments;
