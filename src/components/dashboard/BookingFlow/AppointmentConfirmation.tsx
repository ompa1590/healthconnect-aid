import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, User } from "lucide-react";
import { format } from "date-fns";

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

  const togglePrescreening = () => {
    setShowPrescreening(!showPrescreening);
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
                {format(appointmentDetails.date, "EEEE, MMMM d, yyyy")}
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
          <Button onClick={onDone} size="lg" className="px-8">
            Done
          </Button>
          <div>
            <Button 
              onClick={togglePrescreening} 
              variant="outline" 
              size="lg" 
              className="px-8 mt-2"
            >
              {showPrescreening ? 'Close Prescreening' : 'Start Your Prescreening'}
            </Button>
          </div>
        </div>
      </div>

      {showPrescreening && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50 rounded-lg border bg-background shadow-lg">
            <iframe
              src="https://www.tixaeagents.ai/app/na/render/dCNT2Pct710m7Dxr3Kyi/iframe"
              className="w-full h-full rounded-lg"
              frameBorder="0"
            />
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
