import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceSelection from "./ServiceSelection";
import DoctorSelection from "./DoctorSelection";
import TimeSelection from "./TimeSelection";
import AppointmentConfirmation from "./AppointmentConfirmation";
import { CheckCircle, Clock, User2, Stethoscope } from "lucide-react";
import { useAppointment } from "@/hooks/useAppointment";
import { useToast } from "@/components/ui/use-toast";
import useUser from "@/hooks/useUser";
import { serviceCategories } from "@/data/serviceCategories";

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
  
  // Additional state to store the doctor's name and service name
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedServiceName, setSelectedServiceName] = useState<string>("");
  
  // Get service name for the confirmation step
  const getServiceName = () => {
    // Try to use the stored service name first
    if (selectedServiceName) {
      return selectedServiceName;
    }
    
    // Otherwise try to find the service in serviceCategories
    if (selectedService) {
      const [categoryId, serviceIndex] = selectedService.split('-');
      const category = serviceCategories.find(cat => cat.id === categoryId);
      
      if (category && serviceIndex !== undefined) {
        const index = parseInt(serviceIndex, 10);
        if (!isNaN(index) && category.services[index]) {
          const serviceName = category.services[index].title;
          setSelectedServiceName(serviceName);
          return serviceName;
        }
      }
    }
    
    // Fallback
    return selectedService || "Medical Consultation";
  };
  
  // Navigation functions
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPreviousStep = () => setCurrentStep(prev => prev - 1);
  
  // Final submission function
  const { saveAppointment, isSubmitting } = useAppointment();
  const { toast } = useToast();
  const { user, userProfile } = useUser();
  
  // Final submission function
  const handleDone = async () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to book an appointment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill out all appointment details.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the human-readable service name
    const serviceName = getServiceName();
    
    console.log("Submitting appointment with doctor name:", selectedDoctorName);
    console.log("Submitting appointment with service name:", serviceName);
    
    try {
      const success = await saveAppointment({
        service: selectedService,
        doctorId: selectedDoctor || '',
        date: selectedDate,
        time: selectedTime,
        patientId: user.id,
        patientName: userProfile?.name || user?.user_metadata?.name || 'Patient',
        patientEmail: userProfile?.email || user?.email || '',
        reasonForVisit: "Appointment booked through the system",
        doctorName: selectedDoctorName,
        serviceName: serviceName
      });
      
      if (success) {
        toast({
          title: "Appointment Saved",
          description: "Your appointment has been saved to our system.",
        });
        // Don't close the dialog yet - let the user see the confirmation page
      }
    } catch (error) {
      console.error("Error in handleDone:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Progress steps configuration
  const steps = [
    { label: "Service", icon: Stethoscope, completed: currentStep > 1 },
    { label: "Doctor", icon: User2, completed: currentStep > 2 },
    { label: "Time", icon: Clock, completed: currentStep > 3 },
    { label: "Confirm", icon: CheckCircle, completed: currentStep > 4 }
  ];
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection 
            selectedService={selectedService}
            onSelectService={(service, serviceName) => {
              setSelectedService(service);
              setSelectedServiceName(serviceName);
            }}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <DoctorSelection 
            selectedDoctor={selectedDoctor}
            onSelectDoctor={(doctorId, doctorName) => {
              setSelectedDoctor(doctorId);
              setSelectedDoctorName(doctorName);
            }}
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
              doctor: selectedDoctorName,
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
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader className="sticky top-0 z-30 bg-background pb-2">
        <DialogTitle className="text-2xl font-normal">Book an Appointment</DialogTitle>
      </DialogHeader>
      
      {/* Progress Stepper - Sticky */}
      <div className="sticky top-0 z-20 bg-background pt-2 pb-6">
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center z-10">
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 
                  ${currentStep > index + 1 || step.completed 
                    ? 'bg-primary text-white' 
                    : currentStep === index + 1 
                      ? 'bg-primary/10 text-primary border-2 border-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <span className={`text-sm ${currentStep === index + 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          ))}
          
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-0">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out" 
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto">
        {renderStep()}
      </div>
    </DialogContent>
  );
};

export default BookAppointmentFlow;
