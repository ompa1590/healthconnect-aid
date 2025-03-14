
import React, { useEffect, useRef } from "react";

interface CaptchaComponentProps {
  captchaId: string;
  onVerify: (token: string) => void;
  callbackName: string;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ 
  captchaId, 
  onVerify, 
  callbackName 
}) => {
  const captchaLoaded = useRef(false);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified with token:`, token);
      onVerify(token);
    };
    
    // Clean up when component unmounts
    return () => {
      delete window[callbackName];
    };
  }, [onVerify, callbackName]);

  // Reset captcha loaded flag when ID changes
  useEffect(() => {
    captchaLoaded.current = false;
    
    // If hCaptcha is already initialized but we have a new ID, try to reset
    if (window.hcaptcha) {
      try {
        // Remove any existing captcha instances first
        window.hcaptcha.reset();
      } catch (error) {
        console.log("Error resetting captcha:", error);
      }
    }
  }, [captchaId]);

  // Load hCaptcha script
  useEffect(() => {
    const loadCaptchaScript = () => {
      // Skip if we already loaded or are still loading the script
      if (document.getElementById('hcaptcha-script')) {
        renderCaptcha();
        return;
      }
      
      console.log("Loading hCaptcha script...");
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://hcaptcha.com/1/api.js?render=explicit&onload=renderCaptcha';
      script.async = true;
      script.defer = true;
      
      document.head.appendChild(script);
    };
    
    // Function to render the captcha once the script is loaded
    const renderCaptcha = () => {
      if (window.hcaptcha && document.getElementById(captchaId) && !captchaLoaded.current) {
        console.log(`Rendering captcha with ID: ${captchaId}`);
        try {
          window.hcaptcha.render(captchaId, {
            sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
            callback: callbackName
          });
          captchaLoaded.current = true;
        } catch (error) {
          console.error(`Error rendering captcha:`, error);
          // If we get an error, we may need to retry
          captchaLoaded.current = false;
        }
      }
    };
    
    // Define the global renderCaptcha function that hCaptcha will call when loaded
    window.renderCaptcha = renderCaptcha;
    
    // Try to load the script
    loadCaptchaScript();
    
    // Clean up function
    return () => {
      // No need to remove the script as it might be used by other components
      delete window.renderCaptcha;
    };
  }, [captchaId, callbackName]);

  return <div id={captchaId} className="h-[78px] min-w-[300px] flex items-center justify-center"></div>;
};

export default CaptchaComponent;

// Extend Window interface to include custom captcha callbacks
declare global {
  interface Window {
    hcaptcha?: any;
    renderCaptcha?: () => void;
    [key: string]: any;
  }
}
