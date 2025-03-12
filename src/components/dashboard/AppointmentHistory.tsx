
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const AppointmentHistory = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-03-15",
      time: "2:30 PM",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={cn(
            "p-4 rounded-lg border",
            appointment.status === "upcoming"
              ? "bg-primary/5 border-primary/20"
              : "bg-muted/50 border-border/50"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{appointment.doctor}</h3>
              <p className="text-sm text-muted-foreground">
                {appointment.specialty}
              </p>
            </div>
            {appointment.status === "upcoming" && (
              <Button variant="outline" size="sm">
                Join Call
                <Video className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              {appointment.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {appointment.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentHistory;
