
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
      
      // Create appointment object with all necessary fields
      const appointmentObject = {
        provider_id: appointmentData.doctorId,
        patient_id: appointmentData.patientId,
        patient_name: appointmentData.patientName,
        patient_email: appointmentData.patientEmail,
        service_type: appointmentData.service,
        appointment_date: formattedDate,
        appointment_time: timeValue,
        reason: appointmentData.reasonForVisit,
        status: 'upcoming'
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

  const getAppointments = async (isProvider = false) => {
    try {
      if (!user) {
        return [];
      }

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
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: 'destructive',
        });
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Error in getAppointments:', err);
      toast({
        title: "Error",
        description: "There was a problem retrieving your appointments.",
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    saveAppointment,
    getAppointments,
    isSubmitting
  };
};

export default useAppointment;
