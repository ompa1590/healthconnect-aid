
import React, { useEffect, useRef, useState } from "react";

interface CaptchaComponentProps {
  captchaId: string;
  onVerify: (token: string) => void;
  callbackName: string;
}

// Define the ref type interface
export interface CaptchaRefType {
  resetCaptcha: () => boolean;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ 
  captchaId, 
  onVerify, 
  callbackName 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    console.log(`Setting up captcha callback: ${callbackName}`);
    
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified with token (${token.substring(0, 10)}...)`);
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

  // Function to reset captcha that can be called externally via ref
  const resetCaptcha = () => {
    console.log("Manual captcha reset requested");
    if (window.hcaptcha && widgetIdRef.current !== null) {
      try {
        console.log(`Resetting captcha widget: ${widgetIdRef.current}`);
        window.hcaptcha.reset(widgetIdRef.current);
        setError(null);
        return true;
      } catch (err) {
        console.error("Error resetting captcha:", err);
        setError("Failed to reset captcha. Please refresh the page.");
        return false;
      }
    } else {
      console.warn("Cannot reset captcha - widget not initialized");
      return false;
    }
  };

  // Load and handle hCaptcha script and widget
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    setError(null);
    
    // Inner function to render captcha
    const renderCaptcha = () => {
      // Only proceed if component is still mounted and container exists
      if (!mountedRef.current || !captchaRef.current) {
        console.log("Skipping captcha render - component unmounted or ref missing");
        return;
      }
      
      if (window.hcaptcha) {
        try {
          console.log(`Attempting to render captcha in element with ID: ${captchaId}`);
          
          // Safely clean up any existing widget
          if (widgetIdRef.current !== null) {
            try {
              console.log(`Cleaning up existing widget: ${widgetIdRef.current}`);
              window.hcaptcha.reset(widgetIdRef.current);
              window.hcaptcha.remove(widgetIdRef.current);
            } catch (error) {
              // Just log the error but continue with creating a new widget
              console.error("Error cleaning up existing captcha:", error);
            } finally {
              // Always clear the widget ID reference
              widgetIdRef.current = null;
            }
          }
          
          // Check if the element exists in the DOM
          const captchaElement = document.getElementById(captchaId);
          if (!captchaElement) {
            console.error(`Captcha container element with ID '${captchaId}' not found in DOM`);
            setError("Captcha container not found");
            setIsLoading(false);
            return;
          }
          
          // Render a new captcha widget
          console.log("Creating new hCaptcha widget");
          const widgetId = window.hcaptcha.render(captchaId, {
            sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
            callback: callbackName,
            'expired-callback': () => {
              console.warn("hCaptcha token expired");
              if (mountedRef.current) {
                setError("Verification expired. Please complete the captcha again.");
              }
            },
            'error-callback': (err: string) => {
              console.error(`hCaptcha error: ${err}`);
              if (mountedRef.current) {
                setIsLoading(false);
                setError(`Captcha error: ${err}`);
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
            setError("Failed to load verification challenge. Please refresh the page.");
          }
        }
      } else {
        // If hCaptcha isn't loaded yet, try again after a delay
        console.log("hCaptcha not loaded yet, retrying soon");
        setTimeout(renderCaptcha, 500);
      }
    };

    // Load the hCaptcha script if it's not already loaded
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
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
          setError("Failed to load verification service. Please check your internet connection.");
        }
      };
      
      document.head.appendChild(script);
    };
    
    // Start the loading process
    console.log(`Initializing captcha with ID: ${captchaId}`);
    loadCaptchaScript();
    
    // Clean up on component unmount
    return () => {
      console.log("Cleaning up captcha component");
      mountedRef.current = false;
      
      // If hCaptcha is initialized and we have a widget ID, reset it
      if (window.hcaptcha && widgetIdRef.current !== null) {
        try {
          console.log(`Removing widget ${widgetIdRef.current} during cleanup`);
          window.hcaptcha.reset(widgetIdRef.current);
          window.hcaptcha.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Error cleaning up captcha during unmount:", error);
        }
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
        
        {error && !isLoading && (
          <div className="text-sm text-destructive p-2 text-center">
            {error}
            <button 
              onClick={resetCaptcha}
              className="block mx-auto mt-1 text-xs text-primary underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Create a forwardRef version to expose resetCaptcha method
export const CaptchaComponentWithRef = React.forwardRef<CaptchaRefType, CaptchaComponentProps>(
  (props, ref) => {
    // Create a local ref for the captcha element
    const captchaRef = useRef<HTMLDivElement>(null);
    // Use a stable ref for the widget ID
    const widgetIdRef = useRef<number | null>(null);
    
    // Function to reset captcha that can be called by parent components
    const resetCaptcha = () => {
      console.log("Forwarded captcha reset requested");
      if (window.hcaptcha && widgetIdRef.current !== null) {
        try {
          console.log(`Resetting captcha widget from forwarded ref: ${widgetIdRef.current}`);
          window.hcaptcha.reset(widgetIdRef.current);
          return true;
        } catch (err) {
          console.error("Error resetting captcha from forwarded ref:", err);
          return false;
        }
      } else {
        console.warn("Cannot reset captcha from forwarded ref - widget not initialized");
        return false;
      }
    };
    
    // Expose the resetCaptcha method to parent components
    React.useImperativeHandle(ref, () => ({
      resetCaptcha
    }));
    
    return <CaptchaComponent {...props} />;
  }
);

export default CaptchaComponent;

// Extend Window interface to include custom captcha callbacks
declare global {
  interface Window {
    hcaptcha?: {
      render: (containerId: string, options: any) => number;
      reset: (widgetId: number) => void;
      remove: (widgetId: number) => void;
      execute: (widgetId?: number) => void;
    };
    [key: string]: any;
  }
}
