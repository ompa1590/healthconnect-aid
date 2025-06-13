import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, User, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import RadialCard from "../../prescreening/PreScreeningAssistant";
import { useToast } from "@/components/ui/use-toast";
import useUser from "@/hooks/useUser";

interface AppointmentConfirmationProps {
  appointmentDetails: {
    service: string;
    doctor: string;
    date: Date;
    time: string;
  };
  onDone: () => void;
  isComplete?: boolean;
  isSubmitting?: boolean;
}

const AppointmentConfirmation = ({
  appointmentDetails,
  onDone,
  isComplete,
  isSubmitting,
}: AppointmentConfirmationProps) => {
  const [showPrescreening, setShowPrescreening] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const processingRef = useRef(false);
  const hasCalledOnDone = useRef(false); // Track if onDone was called

  const togglePrescreening = () => {
    console.log("togglePrescreening called, showPrescreening:", showPrescreening);
    if (showPrescreening) {
      setShowPrescreening(false);
      if (!isComplete && !hasCalledOnDone.current) {
        console.log("Calling onDone in togglePrescreening");
        hasCalledOnDone.current = true;
        onDone();
      }
    } else {
      setShowPrescreening(true);
    }
  };

  const handlePrescreenLater = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (processingRef.current || isProcessing || isComplete || hasCalledOnDone.current) {
      console.log("handlePrescreenLater blocked: already processing or complete");
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const appointmentTime = new Date(appointmentDetails.date);
      const timeComponents = appointmentDetails.time.includes(":")
        ? appointmentDetails.time.split(":")
        : ["9", "00"];
      const hours = parseInt(timeComponents[0]);
      const minutes = parseInt(timeComponents[1] || "0");
      appointmentTime.setHours(hours, minutes);

      const formattedDate = format(appointmentTime, "MMMM d, yyyy");
      const formattedTime = format(appointmentTime, "h:mm a");

      toast({
        title: "Pre-screening Reminder Set",
        description: `You'll be reminded to complete your pre-screening on ${formattedDate} at ${formattedTime}.`,
      });

      console.log("Calling onDone in handlePrescreenLater");
      hasCalledOnDone.current = true;
      onDone();
    } catch (error) {
      console.error("Error in handlePrescreenLater:", error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };

  const handleConfirmAppointment = async () => {
    if (isProcessing || isComplete) {
      console.log("handleConfirmAppointment blocked: already processing or complete");
      return;
    }

    try {
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to confirm appointments.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      console.log("Confirming appointment with details:", appointmentDetails);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Error",
        description: "There was a problem confirming your appointment. Please try again.",
        variant: "destructive",
      });
      setIsConfirmed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartPrescreening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing || showPrescreening) {
      console.log("handleStartPrescreening blocked: already processing or prescreening shown");
      return;
    }

    setShowPrescreening(true);
  };

  if (isComplete) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center mb-4">
          <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-medium text-green-600">Booking Complete!</h2>
          <p className="text-muted-foreground mt-1">
            Your appointment has been successfully booked and saved to our system.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-sm mx-auto">
          <h3 className="text-lg font-medium mb-4 text-green-800">Final Details</h3>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Doctor</p>
                <p className="text-sm text-green-600">{appointmentDetails.doctor}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                <CalendarCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Date</p>
                <p className="text-sm text-green-600">
                  {format(appointmentDetails.date, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Time</p>
                <p className="text-sm text-green-600">{appointmentDetails.time}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          You can close this window now. We've sent a confirmation email with these details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center mb-4">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          {isConfirmed ? (
            <CheckCircle className="h-10 w-10 text-green-500" />
          ) : (
            <CalendarCheck className="h-10 w-10 text-primary" />
          )}
        </div>

        <h2 className="text-2xl font-medium">
          {isConfirmed ? "Appointment Confirmed!" : "Review Appointment Details"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {isConfirmed
            ? "Your appointment has been successfully scheduled. Complete your pre-screening to save time at your visit."
            : "Please review and confirm your appointment details below."}
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
        {!isConfirmed ? (
          <Button
            onClick={handleConfirmAppointment}
            size="lg"
            className="px-8 mb-4 bg-green-600 hover:bg-green-700"
            disabled={isProcessing || isSubmitting}
            type="button"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isProcessing ? "Confirming..." : "Confirm Appointment"}
          </Button>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a confirmation email with these details.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleStartPrescreening}
                size="lg"
                className="px-8"
                disabled={isProcessing || showPrescreening}
                type="button"
              >
                Start Your Prescreening
              </Button>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handlePrescreenLater}
                  variant="outline"
                  size="lg"
                  className="px-8"
                  disabled={isProcessing}
                  type="button"
                >
                  {isProcessing ? "Processing..." : "Prescreen Later"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {showPrescreening && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 rounded-lg border bg-background shadow-lg p-6 overflow-y-auto">
            <RadialCard autoStart={true} onComplete={togglePrescreening} />
            <Button
              onClick={togglePrescreening}
              className="absolute top-4 right-4"
              variant="outline"
              type="button"
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