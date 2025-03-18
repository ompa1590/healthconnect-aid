
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MedicalIcon3D } from "@/components/ui/MedicalIcons3D";
import { Calendar, Star, Clock } from "lucide-react";

interface DoctorCardProps {
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  experience: string;
  availability: string;
  iconType?: "stethoscope" | "heart" | "brain" | "doctor";
  iconColor?: "primary" | "secondary" | "accent" | "muted";
}

export const DoctorCard = ({
  name,
  specialty,
  imageUrl,
  rating,
  experience,
  availability,
  iconType = "doctor",
  iconColor = "primary"
}: DoctorCardProps) => {
  return (
    <GlassCard className="p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-3 -right-3">
            <MedicalIcon3D type={iconType} size="sm" color={iconColor} animate={true} />
          </div>
        </div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{specialty}</p>
        
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
          ))}
          <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">Experience: {experience}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">Availability: {availability}</span>
        </div>
      </div>
      
      <Button className="w-full rounded-full" variant="default">
        Book Consultation
      </Button>
    </GlassCard>
  );
};
