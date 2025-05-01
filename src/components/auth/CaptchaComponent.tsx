
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
    console.log(`Registering captcha callback with name: ${callbackName}`);
    
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified with callback: ${callbackName}, token received`);
      if (mountedRef.current) {
        onVerify(token);
      }
    };
    
    // Clean up when component unmounts
    return () => {
      console.log(`Removing captcha callback: ${callbackName}`);
      delete window[callbackName];
    };
  }, [onVerify, callbackName]);

  // Load and handle hCaptcha script and widget
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    // Inner function to render captcha
    const renderCaptcha = () => {
      // Only proceed if component is still mounted and container exists
      if (!mountedRef.current) {
        console.log(`Component unmounted before captcha could render`);
        return;
      }
      
      if (!captchaRef.current) {
        console.log(`Captcha container not found: ${captchaId}`);
        return;
      }
      
      if (window.hcaptcha) {
        try {
          // Check if any widget already exists at this container ID
          const existingWidgets = document.querySelectorAll(`#${captchaId} iframe`);
          if (existingWidgets.length > 0) {
            console.log(`Found existing widgets in container ${captchaId}, removing them first`);
            // Remove existing widgets from DOM to avoid duplication error
            existingWidgets.forEach(widget => widget.remove());
          }
          
          // Reset any existing widget by ID
          if (widgetIdRef.current) {
            try {
              console.log(`Resetting existing widget with ID: ${widgetIdRef.current}`);
              window.hcaptcha.reset(widgetIdRef.current);
              window.hcaptcha.remove(widgetIdRef.current);
            } catch (error) {
              console.log("Error resetting/removing captcha:", error);
            }
            // Clear widget ID after removal
            widgetIdRef.current = null;
          }
          
          console.log(`Rendering hCaptcha with ID: ${captchaId}, callback: ${callbackName}`);
          
          // Render a new captcha widget with explicit cleanup of previous instances
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
        console.log("hCaptcha not loaded yet, retrying in 500ms");
        setTimeout(renderCaptcha, 500);
      }
    };

    // Load the hCaptcha script if it's not already loaded
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        // Script already exists, just try to render the captcha
        console.log("hCaptcha script already exists, rendering captcha");
        renderCaptcha();
        return;
      }
      
      console.log("Loading hCaptcha script");
      const script = document.createElement('script');
      script.id = 'hcaptcha-script';
      script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("hCaptcha script loaded successfully");
        if (mountedRef.current) {
          // Delay the rendering slightly to ensure the API is fully initialized
          setTimeout(renderCaptcha, 100);
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
      
      // If hCaptcha is initialized and we have a widget ID, reset and remove it
      if (window.hcaptcha && widgetIdRef.current) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
          window.hcaptcha.remove(widgetIdRef.current);
          console.log(`Cleaned up widget with ID: ${widgetIdRef.current}`);
        } catch (error) {
          console.error("Error resetting/removing captcha during cleanup:", error);
        }
      }
    };
  }, [captchaId, callbackName]); 

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
