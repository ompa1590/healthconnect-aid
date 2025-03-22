
import React from "react";
import { Calendar, Clock, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PatientHeaderProps {
  patient: {
    name: string;
    id: string;
  };
  appointment: {
    date: Date;
    time: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  appointment,
  doctor,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      {/* Patient Info */}
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarFallback className="bg-primary/10 text-primary">
            {patient.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-lg">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">{patient.id}</p>
        </div>
      </div>

      {/* Doctor & Time Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span className="font-medium">{doctor.name}</span>
          <Badge variant="outline" className="ml-1">
            {doctor.specialty}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {appointment.date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
