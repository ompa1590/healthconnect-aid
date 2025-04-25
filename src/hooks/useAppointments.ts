
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  provider_name?: string;
  patient_name?: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('No authenticated session found');
        setLoading(false);
        return;
      }

      // Get user profile to determine if they're a patient or provider
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      let appointmentsData = [];
      
      if (providerProfile) {
        // User is a provider, fetch appointments where they are the provider
        const { data, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('provider_id', session.user.id)
          .order('booking_date', { ascending: true });
          
        if (appointmentsError) throw appointmentsError;
        appointmentsData = data || [];
        
        // Get patient names separately
        for (let apt of appointmentsData) {
          const { data: patientData, error: patientError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', apt.patient_id)
            .single();
            
          if (!patientError && patientData) {
            apt.patient_name = patientData.name || 'Anonymous Patient';
          } else {
            apt.patient_name = 'Unknown Patient';
          }
        }
      } else {
        // User is a patient, fetch their appointments
        const { data, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', session.user.id)
          .order('booking_date', { ascending: true });
          
        if (appointmentsError) throw appointmentsError;
        appointmentsData = data || [];
        
        // Get provider names separately
        for (let apt of appointmentsData) {
          const { data: providerData, error: providerError } = await supabase
            .from('provider_profiles')
            .select('first_name, last_name')
            .eq('id', apt.provider_id)
            .single();
            
          if (!providerError && providerData) {
            apt.provider_name = `${providerData.first_name || ''} ${providerData.last_name || ''}`.trim() || 'Unknown Provider';
          } else {
            apt.provider_name = 'Unknown Provider';
          }
        }
      }
      
      setAppointments(appointmentsData);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: "Appointment booked successfully!",
        });
        
        // Refresh appointments list
        await fetchAppointments();
        return data[0];
      }
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to book appointment.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: `Appointment status updated to ${status}.`,
        });
        
        // Refresh appointments list
        await fetchAppointments();
        return data[0];
      }
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update appointment status.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointmentStatus
  };
};
