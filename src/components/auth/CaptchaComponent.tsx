
import React, { useEffect } from "react";

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

  // Load hCaptcha script
  useEffect(() => {
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://hcaptcha.com/1/api.js?render=explicit&onload=renderCaptcha';
      script.async = true;
      script.defer = true;
      
      // Add a callback to render the captcha once the script is loaded
      window.renderCaptcha = () => {
        if (window.hcaptcha && document.getElementById(captchaId)) {
          try {
            window.hcaptcha.render(captchaId, {
              sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
              callback: callbackName
            });
          } catch (error) {
            console.error(`Error rendering captcha:`, error);
          }
        }
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Clean up
        delete window.renderCaptcha;
        if (document.getElementById('hcaptcha-script')) {
          document.getElementById('hcaptcha-script')?.remove();
        }
      };
    };
    
    loadCaptchaScript();
  }, [captchaId, callbackName]);

  return <div id={captchaId}></div>;
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
