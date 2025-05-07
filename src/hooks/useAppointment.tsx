
import { useState } from 'react';
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
}

export const useAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      
      // Insert into appointments table
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          provider_id: appointmentData.doctorId,
          patient_id: appointmentData.patientId,
          patient_name: appointmentData.patientName,
          patient_email: appointmentData.patientEmail,
          service_type: appointmentData.service,
          appointment_date: formattedDate,
          appointment_time: timeValue,
          reason: appointmentData.reasonForVisit,
          status: 'upcoming'
        })
        .select();
      
      if (error) {
        console.error('Error saving appointment:', error);
        toast({
          title: 'Error',
          description: `There was a problem booking your appointment: ${error.message}. Please try again.`,
          variant: 'destructive',
        });
        return false;
      }
      
      console.log('Appointment saved successfully:', data);
      
      toast({
        title: 'Appointment Booked',
        description: 'Your appointment has been confirmed.',
      });
      
      return true;
    } catch (err) {
      console.error('Error in saveAppointment:', err);
      toast({
        title: 'Error',
        description: 'There was a problem booking your appointment. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    saveAppointment,
    isSubmitting
  };
};

export default useAppointment;
