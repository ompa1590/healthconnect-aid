
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
      
      let appointmentsQuery;
      
      if (providerProfile) {
        // User is a provider, fetch appointments where they are the provider
        appointmentsQuery = await supabase
          .from('appointments')
          .select(`
            *,
            profiles!patient_id(name)
          `)
          .eq('provider_id', session.user.id)
          .order('booking_date', { ascending: true });
      } else {
        // User is a patient, fetch their appointments
        appointmentsQuery = await supabase
          .from('appointments')
          .select(`
            *,
            provider_profiles!provider_id(first_name, last_name)
          `)
          .eq('patient_id', session.user.id)
          .order('booking_date', { ascending: true });
      }

      if (appointmentsQuery.error) {
        throw appointmentsQuery.error;
      }
      
      // Process the appointments data
      const processedAppointments = appointmentsQuery.data.map((apt: any) => {
        let providerName = 'Unknown Provider';
        let patientName = 'Unknown Patient';
        
        if (apt.provider_profiles) {
          const { first_name = '', last_name = '' } = apt.provider_profiles;
          providerName = `${first_name} ${last_name}`.trim();
        }
        
        if (apt.profiles) {
          patientName = apt.profiles.name || 'Anonymous Patient';
        }
        
        return {
          ...apt,
          provider_name: providerName,
          patient_name: patientName
        };
      });
      
      setAppointments(processedAppointments);
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
