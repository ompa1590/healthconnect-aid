
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";

interface TimeSelectionProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TimeSelection = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onBack,
  onNext
}: TimeSelectionProps) => {
  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // If selected date is today, only show future time slots
    const startHour = selectedDate && selectedDate.getTime() === today.getTime() 
      ? currentDate.getHours() + 1 
      : 9;
    
    for (let hour = startHour; hour <= 17; hour++) {
      if (hour >= 9 && hour <= 17) {
        // Morning and afternoon slots
        if (hour < 12) {
          slots.push(`${hour}:00 AM`);
          slots.push(`${hour}:30 AM`);
        } else if (hour === 12) {
          slots.push(`${hour}:00 PM`);
          slots.push(`${hour}:30 PM`);
        } else {
          slots.push(`${hour - 12}:00 PM`);
          slots.push(`${hour - 12}:30 PM`);
        }
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground">Choose when you'd like to schedule your appointment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
            className="rounded-md border p-3 pointer-events-auto"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Select Time</h3>
          {selectedDate ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[260px] overflow-y-auto p-1">
              {timeSlots.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`flex items-center justify-center w-full ${
                    selectedTime === time ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => onSelectTime(time)}
                >
                  <Clock className="mr-2 h-3.5 w-3.5" />
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[260px] border rounded-md bg-muted/10">
              <p className="text-muted-foreground text-sm">Please select a date first</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="flex items-center"
        >
          Confirm Appointment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeSelection;
