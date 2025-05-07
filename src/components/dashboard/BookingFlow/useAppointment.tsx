
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const saveAppointment = async (appointmentData: AppointmentData) => {
    try {
      setIsSubmitting(true);
      
      // Format the appointment date and time
      const appointmentDate = new Date(appointmentData.date);
      const [hours, minutes] = appointmentData.time.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));
      
      // Insert into appointments table
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          provider_id: appointmentData.doctorId,
          patient_id: appointmentData.patientId,
          patient_name: appointmentData.patientName,
          patient_email: appointmentData.patientEmail,
          service_type: appointmentData.service,
          appointment_date: appointmentData.date.toISOString().split('T')[0],
          appointment_time: appointmentData.time,
          reason: appointmentData.reasonForVisit,
          status: 'upcoming'
        })
        .select();
      
      if (error) {
        console.error('Error saving appointment:', error);
        toast({
          title: 'Error',
          description: 'There was a problem booking your appointment. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
      
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
