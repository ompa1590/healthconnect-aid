
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
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Reset captcha when component unmounts or ID changes
  useEffect(() => {
    // Clean up function for unmounting
    return () => {
      // If hCaptcha is initialized, reset it to avoid DOM node issues
      if (window.hcaptcha && captchaInstance) {
        try {
          window.hcaptcha.reset(captchaInstance);
        } catch (error) {
          console.error("Error resetting captcha during cleanup:", error);
        }
      }
    };
  }, [captchaId, captchaInstance]);

  // Load hCaptcha script
  useEffect(() => {
    // Flag to track if the component is still mounted
    let isMounted = true;
    
    // Function to render the captcha (will be assigned to window)
    const renderCaptchaFn = () => {
      // Only proceed if component is still mounted
      if (!isMounted) return;
      
      console.log("Render captcha function called");
      setTimeout(() => {
        if (!isMounted) return;
        
        if (window.hcaptcha && document.getElementById(captchaId) && !captchaLoaded.current) {
          console.log(`Rendering captcha with ID: ${captchaId}`);
          try {
            // Ensure the container is empty
            const container = document.getElementById(captchaId);
            if (container) {
              // Clear the container safely
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
            }
            
            // Render a new captcha with explicit sitekey
            const widgetId = window.hcaptcha.render(captchaId, {
              sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
              callback: callbackName,
              'error-callback': () => {
                console.error("hCaptcha widget encountered an error");
                if (isMounted) {
                  captchaLoaded.current = false;
                  setIsLoading(false);
                  // Try to re-render after a short delay
                  setTimeout(() => {
                    if (isMounted && !captchaLoaded.current) {
                      renderCaptchaFn();
                    }
                  }, 1000);
                }
              }
            });
            
            if (isMounted) {
              setCaptchaInstance(widgetId);
              captchaLoaded.current = true;
              setIsLoading(false);
              console.log("Captcha rendered successfully with widget ID:", widgetId);
            }
          } catch (error) {
            console.error(`Error rendering captcha:`, error);
            // If we get an error, we may need to retry
            if (isMounted) {
              captchaLoaded.current = false;
              setIsLoading(false);
            }
          }
        } else {
          console.log("Cannot render captcha yet:", {
            hcaptchaExists: !!window.hcaptcha,
            containerExists: !!document.getElementById(captchaId),
            alreadyLoaded: captchaLoaded.current
          });
          
          if (isMounted) {
            setIsLoading(true);
          }
        }
      }, 100); // Small delay to ensure DOM is ready
    };
    
    // Save render function to window
    window.renderCaptcha = renderCaptchaFn;
    
    const loadCaptchaScript = () => {
      // Skip if we already loaded or are still loading the script
      if (document.getElementById('hcaptcha-script')) {
        setScriptLoaded(true);
        renderCaptchaFn();
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
        if (isMounted) {
          setScriptLoaded(true);
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load hCaptcha script");
        if (isMounted) {
          setIsLoading(false);
        }
      };
      
      document.head.appendChild(script);
    };
    
    // Try to load the script
    loadCaptchaScript();
    
    // Clean up function
    return () => {
      // Indicate component is unmounted to prevent state updates
      isMounted = false;
      
      // Safely handle the render function
      if (window.renderCaptcha === renderCaptchaFn) {
        window.renderCaptcha = () => {
          console.log("Captcha render prevented during cleanup");
        };
      }
      
      // If hCaptcha is initialized, reset it
      if (window.hcaptcha && captchaInstance) {
        try {
          window.hcaptcha.reset(captchaInstance);
        } catch (error) {
          console.error("Error resetting captcha during cleanup:", error);
        }
      }
    };
  }, [captchaId, callbackName]);

  // Force render captcha when script is confirmed loaded
  useEffect(() => {
    if (scriptLoaded && window.hcaptcha && !captchaLoaded.current && window.renderCaptcha) {
      console.log("Script confirmed loaded, attempting to render captcha");
      window.renderCaptcha();
    }
  }, [scriptLoaded]);

  // Manually attempt to render the captcha if not loaded after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!captchaLoaded.current && window.hcaptcha && window.renderCaptcha) {
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
        {isLoading && (
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
