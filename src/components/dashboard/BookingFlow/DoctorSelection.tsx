
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        // Fetch doctors from the provider_profiles table
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('id, first_name, last_name, specializations, provider_type');
        
        if (error) {
          throw error;
        }

        // Transform the data to match our Doctor interface
        const formattedDoctors = data.map(doctor => ({
          id: doctor.id,
          name: `${doctor.first_name} ${doctor.last_name}`,
          specialty: doctor.specializations?.[0] || doctor.provider_type || "General Practitioner",
          // For now we'll use fixed ratings and experience until we have actual data
          rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
          experience: `${5 + Math.floor(Math.random() * 15)} years`, // Random experience
          // We'll use randomuser.me for avatars as a fallback
          image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`
        }));

        setDoctors(formattedDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        
        // Fallback to dummy data if the fetch fails
        setDoctors([
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
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-2">Select a Specialist</h2>
        <p className="text-muted-foreground">Choose a healthcare provider for your appointment</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {doctors.length > 0 ? doctors.map(doctor => (
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
                    <span className="text-sm">{doctor.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({(Math.floor(doctor.rating * 100)).toString()}+ reviews)</span>
                  </div>
                  <div className="text-xs mt-2">{doctor.experience} experience</div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-2 text-center py-10 border border-dashed rounded-lg">
              No doctors available at the moment.
            </div>
          )}
        </div>
      )}
      
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
