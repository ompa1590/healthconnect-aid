
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
  const renderAttemptRef = useRef(0);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    // Generate a unique callback name by appending a timestamp if one isn't provided
    const uniqueCallbackName = callbackName.includes(Date.now().toString()) 
      ? callbackName 
      : `${callbackName}_${Date.now()}`;
    
    console.log(`Setting up captcha callback: ${uniqueCallbackName}`);
    
    // Define the callback function on window that hCaptcha will call
    window[uniqueCallbackName] = (token: string) => {
      console.log(`Captcha verified with token:`, token.substring(0, 10) + '...');
      if (mountedRef.current) {
        onVerify(token);
      }
    };
    
    // Clean up when component unmounts
    return () => {
      console.log(`Cleaning up captcha callback: ${uniqueCallbackName}`);
      if (window[uniqueCallbackName]) {
        delete window[uniqueCallbackName];
      }
    };
  }, [onVerify, callbackName]);

  // Load and handle hCaptcha script and widget
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    // Inner function to render captcha
    const renderCaptcha = () => {
      // Only proceed if component is still mounted and container exists
      if (!mountedRef.current || !captchaRef.current) {
        console.log("Cannot render captcha: component not mounted or container not found");
        return;
      }
      
      // Maximum render attempts to prevent infinite loops
      if (renderAttemptRef.current > 5) {
        console.error("Exceeded maximum captcha render attempts");
        setIsLoading(false);
        return;
      }
      
      renderAttemptRef.current += 1;
      
      if (window.hcaptcha) {
        try {
          // First check if the captcha container element exists in DOM
          const captchaContainer = document.getElementById(captchaId);
          if (!captchaContainer) {
            console.error("Captcha container element not found:", captchaId);
            setTimeout(renderCaptcha, 300);
            return;
          }
          
          // Reset any existing widget
          if (widgetIdRef.current) {
            try {
              console.log("Resetting existing captcha widget:", widgetIdRef.current);
              window.hcaptcha.reset(widgetIdRef.current);
            } catch (error) {
              console.log("Error resetting captcha, will create a new one:", error);
              // Don't return, proceed with rendering a new widget
            }
          }
          
          // Ensure no previous captcha exists at this ID
          try {
            const existingElements = captchaContainer.querySelectorAll('iframe');
            if (existingElements.length > 0) {
              console.log("Cleaning up existing captcha elements before rendering new one");
              existingElements.forEach(el => {
                if (el.parentNode === captchaContainer) {
                  captchaContainer.removeChild(el);
                }
              });
            }
          } catch (cleanupError) {
            console.error("Error cleaning up existing captcha elements:", cleanupError);
            // Continue with render attempt
          }
          
          // Render a new captcha widget
          console.log("Rendering new captcha widget with ID:", captchaId);
          const widgetId = window.hcaptcha.render(captchaId, {
            sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
            callback: callbackName,
            'error-callback': (error: any) => {
              console.error("hCaptcha widget error:", error);
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
            // Try again after a short delay, but not too many times
            if (renderAttemptRef.current < 3) {
              setTimeout(renderCaptcha, 1000);
            }
          }
        }
      } else {
        // If hCaptcha isn't loaded yet, try again after a delay
        console.log("hCaptcha not loaded yet, retrying...");
        setTimeout(renderCaptcha, 500);
      }
    };

    // Load the hCaptcha script if it's not already loaded
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        console.log("hCaptcha script already exists, attempting to render");
        // Script already exists, just try to render the captcha
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
          setTimeout(renderCaptcha, 200);
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
      console.log("Unmounting captcha component, cleaning up");
      mountedRef.current = false;
      
      // If hCaptcha is initialized and we have a widget ID, reset it
      if (window.hcaptcha && widgetIdRef.current) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
          console.log("Reset captcha widget on unmount:", widgetIdRef.current);
        } catch (error) {
          console.error("Error resetting captcha during cleanup:", error);
        }
      }
      
      // Remove any iframes that might be left over
      try {
        const container = document.getElementById(captchaId);
        if (container) {
          const iframes = container.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            try {
              if (iframe.parentNode === container) {
                container.removeChild(iframe);
              }
            } catch (e) {
              console.error("Error removing iframe:", e);
            }
          });
        }
      } catch (e) {
        console.error("Error cleaning up captcha iframes:", e);
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
