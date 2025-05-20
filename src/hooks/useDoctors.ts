
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Doctor {
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

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        console.log("Fetching doctors from provider_profiles table...");
        
        // Fetch doctors from the provider_profiles table with no filters
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('id, first_name, last_name, specializations, provider_type');
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Raw provider data from supabase:", data);
        console.log("Number of providers found:", data?.length || 0);
        
        if (!data || data.length === 0) {
          console.log("No providers found in the database");
          setDoctors([]);
          return;
        }

        // Transform the data to match our Doctor interface
        const formattedDoctors = data.map((doctor, index) => {
          // Ensure first_name and last_name are treated as strings, even if null
          const firstName = doctor.first_name || '';
          const lastName = doctor.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim() || `Provider ${index + 1}`;
          
          console.log(`Processing provider: ${fullName} (ID: ${doctor.id})`);
          
          // Use provider_type or first specialization as specialty
          const specialty = doctor.specializations?.[0] || doctor.provider_type || "General Practitioner";
          
          // Generate consistent rating and experience based on the doctor's ID
          // This ensures the same doctor always gets the same random values
          const idSum = doctor.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const rating = 4.5 + ((idSum % 5) / 10); // Consistent rating between 4.5-5.0
          const experience = `${5 + (idSum % 15)} years`; // Consistent experience
          
          // Generate consistent avatar URL based on doctor ID
          const gender = idSum % 2 === 0 ? 'men' : 'women';
          const imageNumber = idSum % 100;
          const imageUrl = `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;
          
          return {
            id: doctor.id,
            name: fullName,
            specialty: specialty,
            rating: rating,
            experience: experience,
            image: imageUrl,
            first_name: firstName,
            last_name: lastName,
            specializations: doctor.specializations,
            provider_type: doctor.provider_type
          };
        });

        console.log("Transformed all provider data:", formattedDoctors);
        console.log("Number of transformed providers:", formattedDoctors.length);
        
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

  return { doctors, isLoading, error };
}
