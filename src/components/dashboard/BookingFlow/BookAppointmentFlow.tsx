
import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceSelection from "./ServiceSelection";
import DoctorSelection from "./DoctorSelection";
import TimeSelection from "./TimeSelection";
import AppointmentConfirmation from "./AppointmentConfirmation";

interface BookAppointmentFlowProps {
  onClose: () => void;
}

const BookAppointmentFlow = ({ onClose }: BookAppointmentFlowProps) => {
  // Track the current step in the booking flow
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for each step
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Get service and doctor names for the confirmation step
  const getServiceName = () => {
    // In a real application, you would use the selected service ID to look up the name
    return "Dermatology Consultation";
  };
  
  const getDoctorName = () => {
    // In a real application, you would use the selected doctor ID to look up the name
    const doctors = {
      "dr-1": "Dr. Sarah Johnson",
      "dr-2": "Dr. Mark Williams",
      "dr-3": "Dr. Amelia Chen",
      "dr-4": "Dr. James Wilson",
      "dr-5": "Dr. Lisa Patel",
    };
    
    return selectedDoctor ? doctors[selectedDoctor as keyof typeof doctors] : "";
  };
  
  // Navigation functions
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPreviousStep = () => setCurrentStep(prev => prev - 1);
  
  // Final submission function
  const handleDone = () => {
    onClose();
    // In a real application, you would save the appointment to the database
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection 
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <DoctorSelection 
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        );
      case 3:
        return (
          <TimeSelection 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        );
      case 4:
        return (
          <AppointmentConfirmation 
            appointmentDetails={{
              service: getServiceName(),
              doctor: getDoctorName(),
              date: selectedDate!,
              time: selectedTime!,
            }}
            onDone={handleDone}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Book an Appointment</DialogTitle>
      </DialogHeader>
      
      {renderStep()}
    </DialogContent>
  );
};

export default BookAppointmentFlow;
