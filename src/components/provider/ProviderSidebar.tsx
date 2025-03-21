
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  FileText,
  Settings,
  HelpCircle,
  BookText,
  LogOut,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors",
        active && "bg-gray-100 text-primary font-medium"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="mt-6 first:mt-0">
      <p className="text-xs font-semibold uppercase text-gray-500 mb-2 px-3">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

interface ProviderSidebarProps {
  providerName: string;
  speciality?: string;
  avatarUrl?: string;
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ 
  providerName,
  speciality = "General Practice",
  avatarUrl
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/provider-login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="w-56 h-screen flex flex-col border-r bg-white">
      {/* Provider Profile */}
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
          {avatarUrl ? (
            <img src={avatarUrl} alt={providerName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>Dr.</span>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-medium text-gray-900 truncate">Dr. {providerName}</h3>
          <p className="text-xs text-gray-500 truncate">{speciality}</p>
        </div>
      </div>
      
      {/* Menu */}
      <div className="flex-1 py-4 px-2 overflow-y-auto">
        <SidebarSection title="Main Menu">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={isActive('/provider/dashboard')}
            onClick={() => navigateTo('/provider/dashboard')}
          />
          <SidebarItem 
            icon={Users} 
            label="Patients" 
            active={isActive('/provider/patients')}
            onClick={() => navigateTo('/provider/dashboard?tab=patients')}
          />
          <SidebarItem 
            icon={MessageCircle} 
            label="Consultations" 
            active={isActive('/provider/consultations')}
            onClick={() => navigateTo('/provider/dashboard?tab=consultations')}
          />
          <SidebarItem 
            icon={FileText} 
            label="Prescriptions" 
            active={isActive('/provider/prescriptions')}
            onClick={() => navigateTo('/provider/dashboard?tab=prescriptions')}
          />
        </SidebarSection>
        
        <SidebarSection title="Support & Settings">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={isActive('/provider/settings')}
            onClick={() => navigateTo('/provider/dashboard?tab=settings')}
          />
          <SidebarItem 
            icon={HelpCircle} 
            label="Help & Support" 
            active={isActive('/provider/help')}
            onClick={() => navigateTo('/provider/help')}
          />
          <SidebarItem 
            icon={BookText} 
            label="Legal" 
            active={isActive('/provider/legal')}
            onClick={() => navigateTo('/provider/legal')}
          />
        </SidebarSection>
      </div>
      
      {/* Contact Support */}
      <div className="p-3 border-t">
        <div className="rounded-md bg-gray-100 p-3">
          <p className="text-xs font-medium mb-2">Need Assistance?</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-xs"
            onClick={() => navigateTo('/provider/contact-support')}
          >
            <Phone className="h-3.5 w-3.5" />
            Contact Support
          </Button>
        </div>
      </div>
      
      {/* Sign Out */}
      <div className="p-2 border-t">
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 text-sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProviderSidebar;
