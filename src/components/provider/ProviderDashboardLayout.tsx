
import React from "react";
import ProviderSidebar from "./ProviderSidebar";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderDashboardLayoutProps {
  children: React.ReactNode;
  providerName: string;
  speciality?: string;
  avatarUrl?: string;
}

const ProviderDashboardLayout: React.FC<ProviderDashboardLayoutProps> = ({
  children,
  providerName,
  speciality,
  avatarUrl
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ProviderSidebar 
        providerName={providerName} 
        speciality={speciality}
        avatarUrl={avatarUrl}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-primary">VyraHealth</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="font-medium">
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardLayout;
