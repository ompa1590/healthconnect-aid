
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookAppointment from "./BookAppointment";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, ArrowLeft, Clock, User } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

const AppointmentScheduler = () => {
  const [date, setDate] = useState<Date>();
  const [specialist, setSpecialist] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [openBookingFlow, setOpenBookingFlow] = useState(false);
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  const specialists = [
    "General Practitioner",
    "Dermatologist",
    "Psychologist",
    "Nutritionist",
    "Endocrinologist",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800">Book Appointment</h1>
      </div>
    
      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="rounded-xl" variant="elevated" borderEffect>
          <h2 className="text-xl font-medium mb-6 flex items-center text-gray-800">
            <User className="mr-2 h-5 w-5 text-primary/70" />
            Select Your Provider
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Choose a specialist</label>
              <Select value={specialist} onValueChange={setSpecialist}>
                <SelectTrigger className="bg-white/70 border-border/40 focus:ring-primary/30">
                  <SelectValue placeholder="Select a specialist" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {specialists.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="rounded-xl" variant="elevated" borderEffect>
            <h2 className="text-xl font-medium mb-6 flex items-center text-gray-800">
              <CalendarDays className="mr-2 h-5 w-5 text-primary/70" />
              Choose Appointment Date
            </h2>
            <div className="space-y-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-border/30 bg-white/50 p-3"
                disabled={(date) => date < new Date()}
              />
            </div>
          </GlassCard>

          <GlassCard className="rounded-xl" variant="elevated" borderEffect>
            <h2 className="text-xl font-medium mb-6 flex items-center text-gray-800">
              <Clock className="mr-2 h-5 w-5 text-primary/70" />
              Select Time Slot
            </h2>
            <div className="space-y-2">
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="bg-white/70 border-border/40 focus:ring-primary/30">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Dialog open={openBookingFlow} onOpenChange={setOpenBookingFlow}>
          <DialogTrigger asChild>
            <Button className="px-6 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90">
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <BookAppointment />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
