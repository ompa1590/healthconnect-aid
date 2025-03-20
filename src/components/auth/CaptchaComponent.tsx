
import React, { useEffect, useRef, useState } from "react";

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
  const [captchaInstance, setCaptchaInstance] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
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
    if (window.hcaptcha && captchaInstance) {
      try {
        // Reset the specific captcha instance if available
        window.hcaptcha.reset(captchaInstance);
      } catch (error) {
        console.error("Error resetting captcha:", error);
      }
    }

    // Clean up the container
    const container = document.getElementById(captchaId);
    if (container) {
      container.innerHTML = "";
    }
    
  }, [captchaId, captchaInstance]);

  // Load hCaptcha script
  useEffect(() => {
    const loadCaptchaScript = () => {
      // Skip if we already loaded or are still loading the script
      if (document.getElementById('hcaptcha-script')) {
        setScriptLoaded(true);
        renderCaptcha();
        return;
      }
      
      console.log("Loading hCaptcha script...");
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://hcaptcha.com/1/api.js?render=explicit&onload=renderCaptcha';
      script.async = true;
      script.defer = true;
      
      // Add event listeners to track script loading
      script.onload = () => {
        console.log("hCaptcha script loaded successfully");
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error("Failed to load hCaptcha script");
      };
      
      document.head.appendChild(script);
    };
    
    // Function to render the captcha once the script is loaded
    window.renderCaptcha = () => {
      console.log("Render captcha function called");
      setTimeout(() => {
        if (window.hcaptcha && document.getElementById(captchaId) && !captchaLoaded.current) {
          console.log(`Rendering captcha with ID: ${captchaId}`);
          try {
            // First, ensure the container is empty
            const container = document.getElementById(captchaId);
            if (container) {
              container.innerHTML = "";
            }
            
            // Render a new captcha with explicit sitekey
            const widgetId = window.hcaptcha.render(captchaId, {
              sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
              callback: callbackName,
              'error-callback': () => {
                console.error("hCaptcha widget encountered an error");
                captchaLoaded.current = false;
                // Try to re-render after a short delay
                setTimeout(() => {
                  if (!captchaLoaded.current) {
                    window.renderCaptcha();
                  }
                }, 1000);
              }
            });
            setCaptchaInstance(widgetId);
            captchaLoaded.current = true;
            console.log("Captcha rendered successfully with widget ID:", widgetId);
          } catch (error) {
            console.error(`Error rendering captcha:`, error);
            // If we get an error, we may need to retry
            captchaLoaded.current = false;
          }
        } else {
          console.log("Cannot render captcha yet:", {
            hcaptchaExists: !!window.hcaptcha,
            containerExists: !!document.getElementById(captchaId),
            alreadyLoaded: captchaLoaded.current
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    };
    
    // Try to load the script
    loadCaptchaScript();
    
    // Clean up function
    return () => {
      // No need to remove the script as it might be used by other components
      if (window.renderCaptcha) {
        const tempFunc = window.renderCaptcha;
        window.renderCaptcha = () => {
          console.log("Captcha render prevented during cleanup");
        };
        
        // Restore the original function after a short delay
        // This prevents issues with concurrent unmounts/mounts
        setTimeout(() => {
          window.renderCaptcha = tempFunc;
        }, 50);
      }
    };
  }, [captchaId, callbackName]);

  // Force render captcha when script is confirmed loaded
  useEffect(() => {
    if (scriptLoaded && window.hcaptcha && !captchaLoaded.current) {
      console.log("Script confirmed loaded, attempting to render captcha");
      window.renderCaptcha();
    }
  }, [scriptLoaded]);

  // Manually attempt to render the captcha if not loaded after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!captchaLoaded.current && window.hcaptcha) {
        console.log("Captcha not loaded after delay, attempting to force render");
        window.renderCaptcha();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [captchaId]);

  return (
    <div className="captcha-container">
      <div 
        id={captchaId} 
        className="h-[78px] min-w-[300px] flex items-center justify-center border border-border/20 rounded-md"
      >
        {!scriptLoaded && (
          <div className="text-sm text-muted-foreground animate-pulse">
            Loading captcha...
          </div>
        )}
      </div>
    </div>
  );
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
