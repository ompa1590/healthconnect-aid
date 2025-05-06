
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

interface CaptchaComponentProps {
  captchaId: string;
  onVerify: (token: string) => void;
  callbackName: string;
}

type CaptchaRefType = {
  reset: () => void;
};

const CaptchaComponent = forwardRef<CaptchaRefType, CaptchaComponentProps>(({ 
  captchaId, 
  onVerify, 
  callbackName 
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified with token:`, token.substring(0, 20) + '...');
      if (mountedRef.current) {
        onVerify(token);
      }
    };
    
    // Clean up when component unmounts
    return () => {
      delete window[callbackName];
    };
  }, [onVerify, callbackName]);

  // Reset the captcha when needed
  const resetCaptcha = () => {
    if (window.hcaptcha && widgetIdRef.current) {
      try {
        console.log("Resetting captcha...");
        window.hcaptcha.reset(widgetIdRef.current);
      } catch (error) {
        console.error("Error resetting captcha:", error);
      }
    }
  };

  // Load and handle hCaptcha script and widget
  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    // Clean up any existing hCaptcha widgets with this ID
    const cleanup = () => {
      if (window.hcaptcha && widgetIdRef.current) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
          window.hcaptcha.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (error) {
          console.log("Error cleaning up captcha:", error);
        }
      }
    };

    // Make sure any existing widget is cleaned up before mounting a new one
    cleanup();
    
    // Inner function to render captcha
    const renderCaptcha = () => {
      // Only proceed if component is still mounted and container exists
      if (!mountedRef.current) return;
      
      // Verify that the container element exists in the DOM
      const container = document.getElementById(captchaId);
      if (!container) {
        console.warn("Captcha container not found:", captchaId);
        setTimeout(renderCaptcha, 100); // Try again after a short delay
        return;
      }
      
      if (window.hcaptcha) {
        try {
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
        // Script already exists, just try to render the captcha
        renderCaptcha();
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
      
      // Remove the widget from hCaptcha if it exists
      cleanup();
    };
  }, [captchaId, callbackName]); // Depend on captchaId and callbackName to re-render if they change

  // Expose the reset method to parent components
  useImperativeHandle(ref, () => ({
    reset: resetCaptcha
  }), [resetCaptcha]);

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
});

export default CaptchaComponent;

// Extend Window interface to include custom captcha callbacks
declare global {
  interface Window {
    hcaptcha?: any;
    [key: string]: any;
  }
}
