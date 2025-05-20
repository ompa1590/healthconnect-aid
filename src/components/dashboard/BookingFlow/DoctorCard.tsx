
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Star } from "lucide-react";
import { Doctor } from "@/hooks/useDoctors";

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctorId: string, doctorName: string) => void;
}

const DoctorCard = ({ doctor, isSelected, onSelect }: DoctorCardProps) => {
  return (
    <Card 
      key={doctor.id} 
      className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
        isSelected ? "border-primary" : "border-muted/50"
      }`}
      onClick={() => onSelect(doctor.id, doctor.name)}
    >
      <CardContent className="p-4 flex items-start gap-4">
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
        )}
        
        <Avatar className="h-14 w-14 border-2 border-muted">
          <AvatarImage src={doctor.image} alt={doctor.name} />
          <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium mb-1">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{doctor.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({(Math.floor(doctor.rating * 100)).toString()}+ reviews)</span>
          </div>
          <div className="text-xs mt-2">{doctor.experience} experience</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
