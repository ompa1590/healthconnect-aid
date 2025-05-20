
import React from "react";

const NextSteps: React.FC = () => {
  return (
    <div className="bg-muted/30 p-4 rounded-md text-left">
      <p className="text-sm font-medium mb-2">Next Steps:</p>
      <ol className="list-decimal list-inside text-sm space-y-2">
        <li>Create your account by clicking the button below</li>
        <li>Our team will review your registration information</li>
        <li>We'll verify your professional credentials</li>
        <li>Once verified, you'll receive access to the provider dashboard</li>
        <li>You can start offering virtual care services to patients</li>
      </ol>
    </div>
  );
};

export default NextSteps;
