
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
  const widgetIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const scriptLoadingRef = useRef(false);
  
  // Define window function for hCaptcha callback
  useEffect(() => {
    // Define the callback function on window that hCaptcha will call
    window[callbackName] = (token: string) => {
      console.log(`Captcha verified, callback triggered with token`);
      if (mountedRef.current) {
        // Immediately propagate token to parent component
        onVerify(token);
      }
    };
    
    // Clean up when component unmounts
    return () => {
      delete window[callbackName];
    };
  }, [onVerify, callbackName]);

  // Optimized function to load hCaptcha script
  const loadHCaptchaScript = () => {
    if (scriptLoadingRef.current) return; // Prevent multiple script loads
    
    scriptLoadingRef.current = true;
    const script = document.createElement('script');
    script.id = 'hcaptcha-script';
    script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      scriptLoadingRef.current = false;
      if (mountedRef.current) {
        renderCaptcha();
      }
    };
    
    script.onerror = () => {
      scriptLoadingRef.current = false;
      console.error("Failed to load hCaptcha script");
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
  };
  
  // Render captcha widget with minimal overhead
  const renderCaptcha = () => {
    if (!mountedRef.current || !window.hcaptcha) return;
    
    // Clean up existing widget if any
    if (widgetIdRef.current !== null) {
      try {
        window.hcaptcha.reset(widgetIdRef.current);
        window.hcaptcha.remove(widgetIdRef.current);
      } catch (e) {
        console.warn("Error cleaning up previous captcha:", e);
      }
      widgetIdRef.current = null;
    }
    
    try {
      // Get the container element
      const container = document.getElementById(captchaId);
      if (!container) {
        console.warn("Captcha container not found:", captchaId);
        setIsLoading(false);
        return;
      }
      
      // Render captcha widget immediately
      const widgetId = window.hcaptcha.render(captchaId, {
        sitekey: '62a482d2-14c8-4640-96a8-95a28a30d50c',
        callback: callbackName,
        'error-callback': () => {
          console.error("hCaptcha widget encountered an error");
          if (mountedRef.current) setIsLoading(false);
        }
      });
      
      widgetIdRef.current = widgetId;
      setIsLoading(false);
    } catch (e) {
      console.error("Error rendering captcha widget:", e);
      setIsLoading(false);
    }
  };

  // Handle captcha widget rendering and cleanup - highly optimized version
  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    
    // Check for existing hCaptcha script and instance
    const hCaptchaScript = document.getElementById('hcaptcha-script');
    
    if (!hCaptchaScript) {
      // Script doesn't exist, load it
      loadHCaptchaScript();
    } else if (window.hcaptcha) {
      // Script exists and hCaptcha is loaded, render immediately
      renderCaptcha();
    } else {
      // Script exists but hCaptcha not loaded yet, wait for it
      const checkInterval = setInterval(() => {
        if (window.hcaptcha) {
          clearInterval(checkInterval);
          renderCaptcha();
        }
      }, 10); // Check more frequently (10ms vs previous 50ms)
      
      // Don't wait too long
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.hcaptcha && mountedRef.current) {
          console.error("hCaptcha failed to initialize in time");
          setIsLoading(false);
          
          // Try reloading the script as fallback
          loadHCaptchaScript();
        }
      }, 1500); // Shorter timeout (1.5s vs previous 2s)
    }
    
    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      
      if (widgetIdRef.current !== null && window.hcaptcha) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
          window.hcaptcha.remove(widgetIdRef.current);
        } catch (e) {
          console.warn("Error during captcha cleanup on unmount:", e);
        }
      }
    };
  }, [captchaId]);

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
