import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardList, Home, Stethoscope, User, CalendarClock, Pill } from "lucide-react";

interface DashboardNavbarProps {
  userName: string;
}

const DashboardNavbar = ({
  userName
}: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      console.log("Dashboard navbar: Signing out...");
      
      // Use local scope for sign out instead of global to avoid 403 errors
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error("Sign out error details:", error);
        throw error;
      }
      
      // Clear any auth data that might be in localStorage
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health"
      });
      
      // Navigate to home page after sign out
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive"
      });
      
      // Even on error, attempt to navigate away
      navigate("/");
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-10">
            <div className="flex items-center cursor-pointer">
              <span className="text-primary text-xl font-bold tracking-tight">Vyra</span>
              <span className="text-secondary text-xl font-bold tracking-tight">Health</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className={`${isActive('/dashboard') && location.pathname === '/dashboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary/40'} 
                  transition-colors flex items-center gap-1.5 pb-1`}>
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/dashboard/services" className={`${isActive('/dashboard/services') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary/40'} 
                  transition-colors flex items-center gap-1.5 pb-1`}>
                <Stethoscope className="h-4 w-4" />
                Our Services
              </Link>
              <Link to="/dashboard/past-appointments" className={`${isActive('/dashboard/past-appointments') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary/40'} 
                  transition-colors flex items-center gap-1.5 pb-1`}>
                <CalendarClock className="h-4 w-4" />
                Past Appointments
              </Link>
              <Link to="/dashboard/prescriptions" className={`${isActive('/dashboard/prescriptions') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary/40'} 
                  transition-colors flex items-center gap-1.5 pb-1`}>
                <Pill className="h-4 w-4" />
                Prescriptions
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/20">
                  <Avatar className="h-10 w-10 border border-muted">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/54.jpg" alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/medical-history")} className="cursor-pointer">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Medical History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/health-records")} className="cursor-pointer">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Health Records
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/treatment-options")} className="cursor-pointer">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Treatment Options
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>;
};

export default DashboardNavbar;
