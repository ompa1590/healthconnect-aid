
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useUser from './useUser';

interface AppointmentData {
  service: string;
  doctorId: string;
  date: Date;
  time: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  reasonForVisit: string;
  doctorName?: string;
  serviceName?: string;
}

export const useAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const saveAppointment = async (appointmentData: AppointmentData) => {
    try {
      setIsSubmitting(true);
      
      // Format the appointment date - ensure it's a string in YYYY-MM-DD format
      const appointmentDate = new Date(appointmentData.date);
      const formattedDate = appointmentDate.toISOString().split('T')[0];
      
      // Clean up time format - ensure it's in HH:MM format for database
      let timeValue = appointmentData.time;
      if (timeValue.includes(' ')) {
        // If time includes AM/PM, extract just the time part
        timeValue = timeValue.split(' ')[0];
      }
      
      console.log('Saving appointment with data:', {
        ...appointmentData,
        date: formattedDate,
        time: timeValue
      });
      
      // Check if user is authenticated first
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      // Create appointment object with all necessary fields
      const appointmentObject = {
        provider_id: appointmentData.doctorId,
        patient_id: appointmentData.patientId,
        patient_name: appointmentData.patientName,
        patient_email: appointmentData.patientEmail,
        service_type: appointmentData.service,
        appointment_date: formattedDate,
        appointment_time: timeValue,
        reason: appointmentData.reasonForVisit || "Appointment booked through the system",
        status: 'upcoming',
        doctor_name: appointmentData.doctorName || `Dr. ${appointmentData.doctorId.substring(0, 8)}`,
        service_name: appointmentData.serviceName || appointmentData.service
      };

      console.log('Inserting appointment with:', appointmentObject);
      
      // Insert into appointments table
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentObject)
        .select();
      
      if (error) {
        console.error('Error saving appointment:', error);
        toast({
          title: "Error",
          description: `There was a problem booking your appointment: ${error.message}. Please try again.`,
          variant: 'destructive',
        });
        return false;
      }
      
      console.log('Appointment saved successfully:', data);
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been confirmed.",
      });
      
      return true;
    } catch (err) {
      console.error('Error in saveAppointment:', err);
      toast({
        title: "Error",
        description: "There was a problem booking your appointment. Please try again.",
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified function with retry mechanism and improved data handling
  const getAppointments = useCallback(async (isProvider = false, maxRetries = 3) => {
    setIsLoading(true);
    setError(null);
    
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        // Make sure we have a user before proceeding
        if (!user || !user.id) {
          console.log("No authenticated user found, returning empty appointments array");
          setIsLoading(false);
          return [];
        }

        console.log(`Fetching appointments for user: ${user.id}, isProvider: ${isProvider}`);
        
        let query;
        
        if (isProvider) {
          // Provider is looking at their appointments
          query = supabase
            .from('appointments')
            .select('*')
            .eq('provider_id', user.id)
            .order('appointment_date', { ascending: true });
        } else {
          // Patient is looking at their appointments
          query = supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', user.id)
            .order('appointment_date', { ascending: true });
        }

        console.log("Executing query...");
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        console.log(`Appointments fetched: ${data?.length || 0} appointments`);
        
        // Format the appointments data to be more user-friendly
        const formattedAppointments = data?.map(apt => ({
          ...apt,
          // Ensure reason is always a string
          reason: apt.reason || "Appointment booked through the system",
          // Ensure doctor_name is present
          doctor_name: apt.doctor_name || `Dr. ${apt.provider_id.substring(0, 8)}`,
          // Ensure service_name is present
          service_name: apt.service_name || apt.service_type
        })) || [];
        
        console.log("Formatted appointments:", formattedAppointments);
        
        setIsLoading(false);
        return formattedAppointments;
      } catch (err: any) {
        console.error(`Error fetching appointments (attempt ${retries + 1}/${maxRetries}):`, err);
        retries++;
        
        if (retries >= maxRetries) {
          console.error('Max retries reached, giving up');
          const errorMessage = err?.message || "Network error while fetching appointments";
          setError(errorMessage);
          
          toast({
            title: "Connection Error",
            description: "Failed to load your appointments. Please check your internet connection and try again.",
            variant: 'destructive',
          });
          
          setIsLoading(false);
          return [];
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        console.log(`Retrying... (${retries}/${maxRetries})`);
      }
    }
    
    setIsLoading(false);
    return [];
  }, [user, toast]);

  return {
    saveAppointment,
    getAppointments,
    isSubmitting,
    isLoading,
    error
  };
};

export default useAppointment;
