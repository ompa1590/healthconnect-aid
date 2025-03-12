
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const AppointmentScheduler = () => {
  const [date, setDate] = useState<Date>();
  const [specialist, setSpecialist] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

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
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Specialist</label>
        <Select value={specialist} onValueChange={setSpecialist}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a specialist" />
          </SelectTrigger>
          <SelectContent>
            {specialists.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Date</label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < new Date()}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Time</label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Schedule Appointment</Button>
    </div>
  );
};

export default AppointmentScheduler;
