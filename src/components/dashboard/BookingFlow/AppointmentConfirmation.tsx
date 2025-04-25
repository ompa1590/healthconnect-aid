
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, User } from "lucide-react";
import { format as dateFormat } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface AppointmentConfirmationProps {
  appointmentDetails: {
    service: string;
    doctor: string;
    date: Date;
    time: string;
  };
  onDone: () => void;
}

const AppointmentConfirmation = ({ appointmentDetails, onDone }: AppointmentConfirmationProps) => {
  const [showPrescreening, setShowPrescreening] = useState(false);
  const { toast } = useToast();

  const togglePrescreening = () => {
    setShowPrescreening(!showPrescreening);
  };

  const handlePrescreenLater = () => {
    // Calculate 8 hours before appointment
    const appointmentTime = new Date(appointmentDetails.date);
    const [hours, minutes] = appointmentDetails.time.split(':');
    appointmentTime.setHours(parseInt(hours), parseInt(minutes));
    
    const eightHoursBefore = new Date(appointmentTime);
    eightHoursBefore.setHours(appointmentTime.getHours() - 8);
    
    // Format the date and time for display
    const formattedDate = dateFormat(eightHoursBefore, "MMMM d, yyyy");
    const formattedTime = dateFormat(eightHoursBefore, "h:mm a");
    
    toast({
      title: "Pre-screening Reminder Set",
      description: `You'll be reminded to complete your pre-screening on ${formattedDate} at ${formattedTime}.`,
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center mb-4">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CalendarCheck className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-medium">Appointment Confirmed!</h2>
        <p className="text-muted-foreground mt-1">
          Your appointment has been successfully scheduled.
        </p>
      </div>
      
      <div className="bg-muted/10 p-6 rounded-lg border max-w-sm mx-auto">
        <h3 className="text-lg font-medium mb-4">Appointment Details</h3>
        
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Doctor</p>
              <p className="text-sm text-muted-foreground">{appointmentDetails.doctor}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <CalendarCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {dateFormat(appointmentDetails.date, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">{appointmentDetails.time}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-md mx-auto">
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a confirmation email with these details. 
          You can manage your appointments in the Dashboard.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={togglePrescreening} 
            size="lg" 
            className="px-8"
          >
            {showPrescreening ? 'Close Prescreening' : 'Start Your Prescreening'}
          </Button>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handlePrescreenLater}
              variant="outline"
              size="lg"
              className="px-8 mt-2"
            >
              Prescreen Later
            </Button>
          </div>
        </div>
      </div>

      {/* We'll update the prescreening component separately if needed */}
      {showPrescreening && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50 rounded-lg border bg-background shadow-lg p-6 overflow-y-auto">
            {/* Placeholder for PreScreeningAssistant */}
            <Button
              onClick={togglePrescreening}
              className="absolute top-4 right-4"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentConfirmation;
