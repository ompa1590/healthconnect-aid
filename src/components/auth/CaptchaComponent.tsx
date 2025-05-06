
import React from "react";

interface CaptchaComponentProps {
  captchaId: string;
  onVerify: (token: string) => void;
  callbackName: string;
}

// Fully disabled Captcha component
const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ 
  captchaId, 
  onVerify,
  callbackName 
}) => {
  // Auto-verify immediately with a dummy token
  React.useEffect(() => {
    // Send a dummy token to bypass captcha verification
    onVerify("dummy-captcha-token-for-testing");
    console.log("⚠️ Captcha fully disabled - sending dummy token");
  }, [onVerify]);

  // Return an empty placeholder instead of the actual captcha
  return (
    <div className="captcha-container">
      <div 
        id={captchaId} 
        className="h-[78px] min-w-[300px] flex items-center justify-center border border-border/20 rounded-md bg-muted/10"
      >
        <div className="text-sm text-amber-500 font-medium">
          Captcha temporarily disabled for testing
        </div>
      </div>
    </div>
  );
};

export default CaptchaComponent;

// Keep type declarations
declare global {
  interface Window {
    hcaptcha?: any;
    [key: string]: any;
  }
}
