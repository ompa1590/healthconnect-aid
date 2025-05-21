import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image?: string;
  first_name?: string;
  last_name?: string;
  specializations?: string[];
  provider_type?: string;
}

interface DoctorSelectionProps {
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string, doctorName: string) => void;
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        // First check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        let queryResult;
        
        if (session) {
          console.log("User is authenticated, fetching with user credentials");
          // If authenticated, use the user's credentials
          queryResult = await supabase
            .from('provider_profiles')
            .select('id, first_name, last_name, specializations, provider_type');
        } else {
          console.log("User is not authenticated, using public access");
          // For public access, you might need a special endpoint or a function 
          // that has service role permissions
          
          // OPTION 1: If you've created a public access policy
          queryResult = await supabase
            .from('provider_profiles')
            .select('id, first_name, last_name, specializations, provider_type');
            
          // OPTION 2: Use a Supabase Edge Function or server API
          // const response = await fetch('/api/get-providers');
          // const data = await response.json();
          // queryResult = { data, error: null };
        }
        
        const { data, error } = queryResult;
        
        if (error) {
          console.error("Supabase query error:", error);
          throw new Error(error.message || "Failed to fetch providers");
        }

        console.log("Fetched provider data:", data);
        
        if (!data || data.length === 0) {
          console.log("No providers found in the database");
          // Show a toast notification instead of a silent failure
          toast({
            title: "No providers found",
            description: "There are currently no healthcare providers available.",
            variant: "destructive"
          });
        }

        // Transform the data to match our Doctor interface
        const formattedDoctors = data ? data.map(doctor => {
          // Ensure first_name and last_name are treated as strings, even if null
          const firstName = doctor.first_name || '';
          const lastName = doctor.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          // Use provider_type or first specialization as specialty
          const specialty = doctor.specializations?.[0] || doctor.provider_type || "General Practitioner";
          
          // Generate a random experience and rating for demonstration
          const rating = 4.5 + (Math.random() * 0.5); // Random rating between 4.5-5.0
          const experience = `${5 + Math.floor(Math.random() * 15)} years`; // Random experience
          
          // Generate a random avatar URL
          const gender = Math.random() > 0.5 ? 'women' : 'men';
          const imageNumber = Math.floor(Math.random() * 100);
          const imageUrl = `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;
          
          return {
            id: doctor.id,
            name: fullName || `Provider ${doctor.id.substring(0, 5)}`, // Fallback name if both first and last are empty
            specialty: specialty,
            rating: rating,
            experience: experience,
            image: imageUrl,
            first_name: firstName,
            last_name: lastName,
            specializations: doctor.specializations,
            provider_type: doctor.provider_type
          };
        }) : [];

        console.log("Transformed provider data:", formattedDoctors);
        
        setDoctors(formattedDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        
        toast({
          title: "Error loading providers",
          description: err instanceof Error ? err.message : "Please try again later",
          variant: "destructive"
        });
        
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
  }, [toast]);

  const getSelectedDoctor = () => {
    return doctors.find(doctor => doctor.id === selectedDoctor) || null;
  };
  
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
              onClick={() => onSelectDoctor(doctor.id, doctor.name)}
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