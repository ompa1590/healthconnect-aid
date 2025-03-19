
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image?: string;
}

interface DoctorSelectionProps {
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const DoctorSelection = ({
  selectedDoctor,
  onSelectDoctor,
  onBack,
  onNext
}: DoctorSelectionProps) => {
  // Mock doctors data - in a real app, this would come from an API
  const doctors: Doctor[] = [
    {
      id: "dr-1",
      name: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      rating: 4.8,
      experience: "12 years",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: "dr-2",
      name: "Dr. Mark Williams",
      specialty: "Dermatologist",
      rating: 4.9,
      experience: "15 years",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: "dr-3",
      name: "Dr. Amelia Chen",
      specialty: "Endocrinologist",
      rating: 4.7,
      experience: "10 years",
      image: "https://randomuser.me/api/portraits/women/66.jpg"
    },
    {
      id: "dr-4",
      name: "Dr. James Wilson",
      specialty: "Psychologist",
      rating: 4.9,
      experience: "8 years",
      image: "https://randomuser.me/api/portraits/men/94.jpg"
    },
    {
      id: "dr-5",
      name: "Dr. Lisa Patel",
      specialty: "Nutritionist",
      rating: 4.6,
      experience: "7 years",
      image: "https://randomuser.me/api/portraits/women/55.jpg"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-2">Select a Specialist</h2>
        <p className="text-muted-foreground">Choose a healthcare provider for your appointment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
        {doctors.map(doctor => (
          <Card 
            key={doctor.id} 
            className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
              selectedDoctor === doctor.id 
                ? "border-primary" 
                : "border-muted/50"
            }`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <CardContent className="p-4 flex items-start gap-4">
              {selectedDoctor === doctor.id && (
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
                  <span className="text-sm">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">({(Math.floor(doctor.rating * 100)).toString()}+ reviews)</span>
                </div>
                <div className="text-xs mt-2">{doctor.experience} experience</div>
              </div>
            </CardContent>
          </Card>
        ))}
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
          disabled={!selectedDoctor}
          className="flex items-center"
        >
          Choose Time
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelection;
