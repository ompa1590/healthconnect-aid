
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  specializations?: string[];
  provider_type?: string;
  biography?: string;
  registration_number?: string;
  full_name?: string;
}

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .order('last_name');
      
      if (error) throw error;
      
      // Process provider data to add full_name
      const processedProviders = data.map(provider => ({
        ...provider,
        full_name: `${provider.first_name || ''} ${provider.last_name || ''}`.trim()
      }));
      
      setProviders(processedProviders);
    } catch (err: any) {
      console.error('Error fetching providers:', err);
      setError(err.message || 'Failed to fetch providers');
      toast({
        title: "Error",
        description: "Failed to load healthcare providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProviderById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
      };
    } catch (err: any) {
      console.error('Error fetching provider:', err);
      toast({
        title: "Error",
        description: "Failed to load provider details.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    loading,
    error,
    fetchProviders,
    getProviderById
  };
};
