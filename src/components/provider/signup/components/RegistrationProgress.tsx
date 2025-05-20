
import React from "react";
import { Loader2 } from "lucide-react";

interface RegistrationProgressProps {
  registrationPhase: string;
  retryAttempt: number;
  maxRetries: number;
  uploadProgress: number;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  registrationPhase,
  retryAttempt,
  maxRetries,
  uploadProgress,
}) => {
  let phaseText = "";
  let phaseProgress = 0;
  
  switch(registrationPhase) {
    case 'creating_auth':
      phaseText = "Creating your account...";
      phaseProgress = 25;
      break;
    case 'creating_profile':
      phaseText = "Setting up your provider profile...";
      phaseProgress = 50;
      break;
    case 'uploading_documents':
      phaseText = "Uploading your documents...";
      phaseProgress = 75;
      break;
    case 'complete':
      phaseText = "Registration complete!";
      phaseProgress = 100;
      break;
    default:
      phaseText = "Processing...";
      phaseProgress = 10;
  }

  return (
    <div className="bg-muted/30 p-3 rounded-md">
      <div className="flex items-center gap-2 mb-1">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm font-medium">{phaseText}</p>
      </div>
      <div className="w-full bg-muted h-1.5 rounded-full">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${phaseProgress}%` }}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 text-right">
        Attempt {retryAttempt}/{maxRetries}
      </p>
      
      {registrationPhase === 'uploading_documents' && uploadProgress > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Uploading documents: {Math.round(uploadProgress)}%</p>
          <div className="w-full bg-muted/50 h-1 mt-1 rounded-full">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationProgress;
