
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
  const [isLoading, setIsLoading] = useState(true);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified, callback triggered with token`);
      if (mountedRef.current) {
        onVerify(token);
      }
    };
    
    // Clean up when component unmounts
    return () => {
      delete window[callbackName];
    };
  }, [onVerify, callbackName]);

  // Load and handle hCaptcha script and widget
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    // Function to safely clear container contents
    const safelyClearContainer = (containerId: string) => {
      try {
        const container = document.getElementById(containerId);
        if (container) {
          // Use a safer way to clear content
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      } catch (error) {
        console.log("Error when clearing container:", error);
      }
    };
    
    // Function to clean up existing widgets
    const cleanupExistingWidgets = () => {
      if (window.hcaptcha) {
        try {
          // If we have a widget ID stored, remove that specific widget
          if (widgetIdRef.current) {
            try {
              window.hcaptcha.reset(widgetIdRef.current);
            } catch (e) {
              console.log("Error resetting widget:", e);
            }
            
            try {
              window.hcaptcha.remove(widgetIdRef.current);
              widgetIdRef.current = null;
            } catch (e) {
              console.log("Error removing widget by ID:", e);
            }
          }
          
          // First remove by element ID if it exists
          const captchaElement = document.getElementById(captchaId);
          if (captchaElement) {
            try {
              // Check if the element has an hcaptcha ID attribute
              const hcaptchaId = captchaElement.getAttribute('data-hcaptcha-widget-id');
              if (hcaptchaId) {
                window.hcaptcha.remove(hcaptchaId);
              }
            } catch (e) {
              console.log("Error removing element by data attribute:", e);
            }
          }
        } catch (error) {
          console.log("General error during captcha cleanup:", error);
        }
      }
      
      // Final safety: manually clear the container
      safelyClearContainer(captchaId);
    };
    
    // Inner function to render captcha
    const renderCaptcha = () => {
      // Clean up first to prevent multiple widgets
      cleanupExistingWidgets();
      
      // Only proceed if component is still mounted and container exists
      if (!mountedRef.current) return;
      
      // Get a fresh reference to the container
      const container = document.getElementById(captchaId);
      if (!container) {
        console.log("Captcha container not found:", captchaId);
        return;
      }
      
      if (window.hcaptcha) {
        try {
          console.log("Attempting to render captcha in container:", captchaId);
          
          // Ensure the container is empty before rendering
          safelyClearContainer(captchaId);
          
          // Render a new captcha widget
          const widgetId = window.hcaptcha.render(captchaId, {
            sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
            callback: callbackName,
            'error-callback': () => {
              console.error("hCaptcha widget encountered an error");
              if (mountedRef.current) {
                setIsLoading(false);
              }
            }
          });
          
          if (mountedRef.current) {
            widgetIdRef.current = widgetId;
            setIsLoading(false);
            console.log("Captcha rendered successfully with widget ID:", widgetId);
          }
        } catch (error) {
          console.error(`Error rendering captcha:`, error);
          if (mountedRef.current) {
            setIsLoading(false);
          }
        }
      } else {
        // If hCaptcha isn't loaded yet, try again after a delay
        setTimeout(renderCaptcha, 500);
      }
    };

    // Load the hCaptcha script if it's not already loaded
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        // Script already exists, wait a moment then try to render the captcha
        setTimeout(renderCaptcha, 200);
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("hCaptcha script loaded successfully");
        if (mountedRef.current) {
          // Delay the rendering slightly to ensure the API is fully initialized
          setTimeout(renderCaptcha, 300);
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load hCaptcha script");
        if (mountedRef.current) {
          setIsLoading(false);
        }
      };
      
      document.head.appendChild(script);
    };
    
    // Start the loading process
    loadCaptchaScript();
    
    // Clean up on component unmount
    return () => {
      mountedRef.current = false;
      
      // Make sure cleanup happens properly
      try {
        cleanupExistingWidgets();
      } catch (e) {
        console.log("Error during final cleanup:", e);
      }
    };
  }, [captchaId, callbackName]); // Depend on captchaId and callbackName to re-render if they change

  return (
    <div className="captcha-container">
      <div 
        id={captchaId} 
        ref={captchaRef}
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
    [key: string]: any;
  }
}
