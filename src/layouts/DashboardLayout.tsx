
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";

const DashboardLayout = () => {
  const [userName, setUserName] = useState("Patient");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (profileData?.name) {
            setUserName(profileData.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  return (
    <div className="min-h-screen">
      <DashboardNavbar userName={userName} />
      <div> 
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
