
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConnectionStatusProps {
  status: 'checking' | 'connected' | 'error';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  if (status === 'connected') return null;
  
  if (status === 'checking') {
    return (
      <div className="bg-muted/30 p-4 rounded-md text-center">
        <div className="animate-pulse">Checking connection...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-destructive/10 p-4 rounded-md text-destructive flex items-center gap-2">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <p className="font-medium">Connection error</p>
        <p className="text-sm">Unable to connect to authentication service. Please try refreshing the page.</p>
      </div>
    </div>
  );
};

export default ConnectionStatus;
