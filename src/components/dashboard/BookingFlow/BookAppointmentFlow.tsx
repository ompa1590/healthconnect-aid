
import React, { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import DoctorSelection from "./DoctorSelection";
import TimeSelection from "./TimeSelection";
import AppointmentConfirmation from "./AppointmentConfirmation";
import { useAppointments } from "@/hooks/useAppointments";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Check, Clock, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useServices } from "@/hooks/useServices";
import { useProviders } from "@/hooks/useProviders";
import { useAuth } from "@/hooks/useAuth";

export type BookingStep = "service" | "doctor" | "time" | "confirmation";

interface BookAppointmentFlowProps {
  onClose?: () => void;
}

const BookAppointmentFlow = ({ onClose }: BookAppointmentFlowProps) => {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Get doctor details
  const { providers } = useProviders();
  const selectedDoctorDetails = providers.find(doc => doc.id === selectedDoctor);

  const handleNext = () => {
    const steps: BookingStep[] = ["service", "doctor", "time", "confirmation"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ["service", "doctor", "time", "confirmation"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleBookingComplete = async () => {
    if (user && selectedService && selectedDoctor && selectedDate && selectedTime) {
      try {
        await createAppointment({
          patient_id: user.id,
          provider_id: selectedDoctor,
          service: selectedService,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          status: "confirmed"
        });

        toast({
          title: "Appointment booked successfully!",
          description: "Your appointment has been confirmed.",
        });
        
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error("Failed to book appointment:", error);
        toast({
          title: "Booking Failed",
          description: "There was an error booking your appointment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="service" disabled>
            <Calendar className="h-4 w-4 mr-2" />
            Service
          </TabsTrigger>
          <TabsTrigger value="doctor" disabled>
            <UserRound className="h-4 w-4 mr-2" />
            Doctor
          </TabsTrigger>
          <TabsTrigger value="time" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Time
          </TabsTrigger>
          <TabsTrigger value="confirmation" disabled>
            <Check className="h-4 w-4 mr-2" />
            Confirm
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="service">
            <ServiceSelection
              selectedService={selectedService}
              onSelectService={setSelectedService}
              onNext={handleNext}
            />
          </TabsContent>
          <TabsContent value="doctor">
            <DoctorSelection
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
              selectedSpecialty={selectedSpecialty}
              onSelectSpecialty={setSelectedSpecialty}
              onBack={handleBack}
              onNext={handleNext}
            />
          </TabsContent>
          <TabsContent value="time">
            <TimeSelection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
              onBack={handleBack}
              onNext={handleNext}
            />
          </TabsContent>
          <TabsContent value="confirmation">
            <AppointmentConfirmation
              appointmentDetails={{
                service: selectedService,
                doctor: selectedDoctorDetails?.full_name || "Selected Doctor",
                date: selectedDate!,
                time: selectedTime!,
              }}
              onDone={handleBookingComplete}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default BookAppointmentFlow;
