
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserWithProfile extends User {
  profile?: {
    name?: string;
    email?: string;
  };
}

export const useUser = () => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ name?: string, email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the user authentication data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Try to get the profile data for additional user info
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', user.id)
            .single();
            
          // Set profile data
          setUserProfile(profile);
          
          // Combine auth user with profile data
          const userWithProfile = {
            ...user,
            profile
          };
          
          setUser(userWithProfile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', session.user.id)
            .single();
            
          setUserProfile(profile);
          
          const userWithProfile = {
            ...session.user,
            profile
          };
          
          setUser(userWithProfile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.id,
    userProfile
  };
};

export default useUser;
