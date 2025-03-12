
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarClock, Clock, Video, FileText, CheckCircle, XCircle } from "lucide-react";

const ProviderAppointments = () => {
  const appointments = [
    {
      id: 1,
      patient: "Emily Johnson",
      age: 34,
      reason: "Annual checkup",
      date: "2024-03-22",
      time: "09:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      patient: "Michael Rodriguez",
      age: 52,
      reason: "Diabetes management",
      date: "2024-03-22",
      time: "10:30 AM",
      status: "upcoming",
    },
    {
      id: 3,
      patient: "Sarah Parker",
      age: 28,
      reason: "Persistent headaches",
      date: "2024-03-21",
      time: "02:00 PM",
      status: "completed",
    }
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
              <h3 className="font-medium">{appointment.patient}</h3>
              <p className="text-sm text-muted-foreground">
                {appointment.age} years • {appointment.reason}
              </p>
            </div>
            <div className="flex gap-2">
              {appointment.status === "upcoming" ? (
                <>
                  <Button variant="outline" size="sm">
                    Join Call
                    <Video className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm">
                  View Notes
                  <FileText className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
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

export default ProviderAppointments;
