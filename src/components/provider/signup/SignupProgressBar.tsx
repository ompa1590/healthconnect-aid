
import React from "react";

interface SignupProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const SignupProgressBar: React.FC<SignupProgressBarProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="mb-6">
      <div className="w-full bg-muted/30 h-2 rounded-full">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
