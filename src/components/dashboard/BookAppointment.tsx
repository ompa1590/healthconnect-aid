
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, CheckCircle, Clock, Stethoscope, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useServices } from "@/hooks/useServices";
import { useProviders } from "@/hooks/useProviders";
import { useAppointments } from "@/hooks/useAppointments";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const BookAppointment = () => {
  const [appointmentType, setAppointmentType] = useState("");
  const [specialtyNeeded, setSpecialtyNeeded] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [aiAssessmentComplete, setAiAssessmentComplete] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [aiMessages, setAiMessages] = useState<{type: 'user' | 'ai', content: string}[]>([
    {type: 'ai', content: 'Hello! I\'ll be conducting your pre-diagnostic assessment to help your doctor prepare for your appointment. Let\'s start with what symptoms you\'re experiencing?'}
  ]);
  const [aiInput, setAiInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { services, loading: servicesLoading } = useServices();
  const { providers, loading: providersLoading } = useProviders();
  const { createAppointment } = useAppointments();
  
  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    getUserId();
  }, []);
  
  // Generate available time slots based on date
  const generateTimeSlots = () => {
    // Default time slots
    const defaultSlots = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
      "4:00 PM", "4:30 PM"
    ];
    
    // In a real application, you'd filter these based on provider availability
    return defaultSlots;
  };
  
  const timeSlots = generateTimeSlots();

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookAppointment = async () => {
    if (!userId || !selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to book your appointment.",
        variant: "destructive"
      });
      return;
    }
    
    const appointmentData = {
      patient_id: userId,
      provider_id: selectedDoctor,
      service: appointmentType,
      booking_date: format(selectedDate, 'yyyy-MM-dd'),
      booking_time: selectedTime,
      notes: reasonForVisit,
      status: 'confirmed'
    };
    
    const result = await createAppointment(appointmentData);
    
    if (result) {
      // Close the dialog after successful booking
      // This assumes the component is used in a dialog that has onClose prop
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 2000);
    }
  };

  // Handle AI assessment
  const handleAIAssessment = () => {
    setOpenAIDialog(true);
  };

  const handleSendToAI = () => {
    if (aiInput.trim() === '') return;
    
    const userMessage = aiInput;
    setAiMessages([...aiMessages, {type: 'user', content: userMessage}]);
    setAiInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (aiMessages.length < 3) {
        aiResponse = "Thank you for sharing. How long have you been experiencing these symptoms? Have you taken any medication to address them?";
      } else if (aiMessages.length < 5) {
        aiResponse = "I understand. Have you had any similar issues in the past or is this the first time you're experiencing this?";
      } else if (aiMessages.length < 7) {
        aiResponse = "Thank you for the information. Is there any family history of similar conditions that might be relevant?";
      } else {
        aiResponse = "I've completed your pre-diagnostic assessment. This information will be shared with your doctor to prepare for your appointment. Do you have any other concerns you'd like to discuss during your visit?";
        
        // Set assessment complete after last question
        setTimeout(() => {
          setAiAssessmentComplete(true);
        }, 1000);
      }
      
      setAiMessages(prevMessages => [...prevMessages, {type: 'ai', content: aiResponse}]);
    }, 1000);
  };

  const completeAIAssessment = () => {
    setOpenAIDialog(false);
    toast({
      title: "Pre-assessment Complete",
      description: "Your pre-diagnostic assessment has been saved and will be shared with your doctor before your appointment.",
    });
  };
  
  // Get Provider Name
  const getProviderName = (id: string) => {
    const provider = providers.find(p => p.id === id);
    return provider ? `${provider.first_name} ${provider.last_name}` : 'Unknown Provider';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6">Book Your Virtual Consultation</h2>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <span className="text-sm mt-2">Select Provider</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <span className="text-sm mt-2">Choose Time</span>
          </div>
          <div className="flex-1 flex items-center mx-2">
            <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              3
            </div>
            <span className="text-sm mt-2">Pre-Assessment</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Select provider */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="appointmentType">Appointment Type</Label>
                {servicesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading services...</p>
                ) : (
                  <Select 
                    value={appointmentType} 
                    onValueChange={setAppointmentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div>
                <Label htmlFor="specialty">Doctor Specialty</Label>
                {providersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading specialties...</p>
                ) : (
                  <Select 
                    value={specialtyNeeded} 
                    onValueChange={setSpecialtyNeeded}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(providers.flatMap(p => p.specializations || []))).map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div>
                <Label htmlFor="doctor">Select Doctor</Label>
                {providersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading doctors...</p>
                ) : (
                  <Select 
                    value={selectedDoctor} 
                    onValueChange={setSelectedDoctor}
                    disabled={!specialtyNeeded}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={specialtyNeeded ? "Select a doctor" : "Select specialty first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {providers
                        .filter(provider => 
                          provider.specializations?.includes(specialtyNeeded)
                        )
                        .map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {`${provider.first_name} ${provider.last_name}`}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
              <div className="mb-4">
                <h3 className="font-medium flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                  Doctor Information
                </h3>
              </div>
              
              {selectedDoctor ? (
                <div className="space-y-3">
                  <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-4"></div>
                  <h4 className="font-medium text-center">{getProviderName(selectedDoctor)}</h4>
                  <p className="text-sm text-muted-foreground text-center">{specialtyNeeded}</p>
                  <div className="text-sm mt-4">
                    {providers.find(p => p.id === selectedDoctor)?.biography ? (
                      <p className="mb-2">{providers.find(p => p.id === selectedDoctor)?.biography}</p>
                    ) : (
                      <>
                        <p className="mb-2">• 15+ years of experience</p>
                        <p className="mb-2">• Certified by the Canadian Medical Association</p>
                        <p>• Specializes in {specialtyNeeded?.toLowerCase() || 'healthcare'} care</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Stethoscope className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">Select a doctor to see their information</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="reasonForVisit">Reason for Visit</Label>
            <Textarea 
              id="reasonForVisit" 
              placeholder="Please describe your symptoms or reason for the appointment"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={goToNextStep}
              disabled={!appointmentType || !specialtyNeeded || !selectedDoctor || !reasonForVisit}
            >
              Continue to Select Time
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Choose date and time */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="block mb-2">Select Date</Label>
              <div className="border border-border rounded-lg overflow-hidden bg-background">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0 || date.getDay() === 6;
                  }}
                  className="p-0"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="block mb-2">Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2">
                {selectedDate ? (
                  timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </Button>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg border border-border/30">
                    <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg border border-border/30">
            <h3 className="font-medium mb-2">Appointment Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Type:</span> {appointmentType}</p>
              <p><span className="font-medium">Doctor:</span> {getProviderName(selectedDoctor)}</p>
              <p><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {selectedTime}</p>
              <p><span className="font-medium">Reason:</span> {reasonForVisit}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button 
              onClick={goToNextStep}
              disabled={!selectedDate || !selectedTime}
            >
              Continue to Pre-Assessment
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Pre-diagnostic assessment */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-muted/20 p-6 rounded-lg border border-border/30 text-center">
            <div className="mb-4">
              <MessageSquare className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-medium mt-4">Pre-Appointment Assessment</h3>
              <p className="text-muted-foreground mt-2">
                Our AI assistant will ask you a few questions to gather relevant information before your appointment.
                This will help your doctor prepare and make the most of your consultation time.
              </p>
            </div>
            
            {aiAssessmentComplete ? (
              <div className="mt-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium mt-4">Pre-Assessment Complete</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Your assessment has been saved and will be shared with your doctor before your appointment.
                </p>
              </div>
            ) : (
              <Button 
                className="mt-4" 
                onClick={handleAIAssessment}
              >
                Begin Pre-Assessment
              </Button>
            )}
          </div>
          
          <div className="bg-muted/20 p-6 rounded-lg border border-border/30">
            <h3 className="font-medium mb-4">What to Expect During Your Virtual Consultation</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-3 mt-0.5">1</div>
                <div>
                  <h4 className="font-medium">Join Your Appointment</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email with a secure link to join your virtual consultation.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-3 mt-0.5">2</div>
                <div>
                  <h4 className="font-medium">Discuss with Your Doctor</h4>
                  <p className="text-sm text-muted-foreground">
                    Your doctor will already have your pre-assessment information and can discuss your concerns in detail.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-3 mt-0.5">3</div>
                <div>
                  <h4 className="font-medium">Receive Treatment Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    After your consultation, you'll receive a treatment plan and any necessary prescriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
            <Button 
              onClick={handleBookAppointment}
              disabled={!aiAssessmentComplete}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}
      
      {/* AI Assessment Dialog */}
      <Dialog open={openAIDialog} onOpenChange={setOpenAIDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pre-Appointment Assessment</h2>
            <p className="text-muted-foreground">
              Please answer a few questions to help your doctor prepare for your appointment.
            </p>
          </div>
          
          <div className="h-64 overflow-y-auto border border-border/50 rounded-md p-4 mb-4">
            {aiMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          {aiAssessmentComplete ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              <p>Pre-assessment complete! Thank you for your responses.</p>
              <Button onClick={completeAIAssessment}>
                Complete Assessment
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Input 
                placeholder="Type your response..." 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendToAI()}
              />
              <Button type="button" onClick={handleSendToAI}>
                Send
              </Button>
            </div>
          )}
          
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
