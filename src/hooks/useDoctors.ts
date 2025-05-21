
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import useUser from "./useUser";

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
  const { isAuthenticated } = useUser();

  const fetchDoctors = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Please log in to view available doctors.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch doctors from the provider_profiles table with no filters
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('id, first_name, last_name, specializations, provider_type');
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        setDoctors([]);
        setError("No providers found in the database.");
        return;
      }

      // Transform the data to match our Doctor interface
      const formattedDoctors = data.map((doctor, index) => {
        // Ensure first_name and last_name are treated as strings, even if null
        const firstName = doctor.first_name || '';
        const lastName = doctor.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || `Provider ${index + 1}`;
        
        // Use provider_type or first specialization as specialty
        const specialty = doctor.specializations?.[0] || doctor.provider_type || "General Practitioner";
        
        // Generate consistent rating and experience based on the doctor's ID
        const idSum = doctor.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = 4.5 + ((idSum % 5) / 10); // Consistent rating between 4.5-5.0
        const experience = `${5 + (idSum % 15)} years`; // Consistent experience
        
        // Generate consistent avatar URL based on doctor ID
        const gender = idSum % 2 === 0 ? 'men' : 'women';
        const imageNumber = idSum % 100;
        const imageUrl = `https://randomuser.me/api/portraits//${gender}/${imageNumber}.jpg`;
        
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
      
      setDoctors(formattedDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Fetch doctors on initial mount or when authentication state changes
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, isLoading, error, refreshDoctors: fetchDoctors };
}
