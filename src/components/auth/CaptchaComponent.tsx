
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

  // Load hCaptcha script if needed
  useEffect(() => {
    const loadCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        return Promise.resolve();
      }
      
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'hcaptcha-script';
        script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = reject;
        
        document.head.appendChild(script);
      });
    };
    
    loadCaptchaScript();
    
    // We don't remove the script on unmount as other components might use it
    return () => {};
  }, []);

  // Handle captcha widget rendering and cleanup
  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    
    // Make sure hCaptcha script exists
    const ensureHCaptchaScript = () => {
      if (document.getElementById('hcaptcha-script')) {
        return Promise.resolve();
      } else {
        const script = document.createElement('script');
        script.id = 'hcaptcha-script';
        script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        
        return new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load hCaptcha script"));
          document.head.appendChild(script);
        });
      }
    };
    
    // Safely remove widget if it exists
    const safelyRemoveWidget = () => {
      try {
        if (window.hcaptcha && widgetIdRef.current !== null) {
          window.hcaptcha.reset(widgetIdRef.current);
          window.hcaptcha.remove(widgetIdRef.current);
        }
      } catch (e) {
        console.warn("Error during captcha cleanup:", e);
      }
      widgetIdRef.current = null;
    };
    
    // Render captcha widget with minimal delay
    const renderCaptchaWidget = () => {
      // Clean up any existing widget first
      safelyRemoveWidget();
      
      if (!mountedRef.current) return;
      if (!window.hcaptcha) return;
      
      try {
        // Check if container exists in DOM before rendering
        if (!document.getElementById(captchaId)) {
          console.warn("Captcha container not found:", captchaId);
          return;
        }
        
        // Render new widget immediately
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
        
        widgetIdRef.current = widgetId;
        setIsLoading(false);
      } catch (e) {
        console.error("Error rendering captcha widget:", e);
        setIsLoading(false);
      }
    };
    
    // Execute rendering flow with minimal delay
    const initCaptcha = async () => {
      try {
        await ensureHCaptchaScript();
        
        // Wait for hCaptcha to initialize - but not too long
        if (!window.hcaptcha) {
          const checkInterval = setInterval(() => {
            if (window.hcaptcha) {
              clearInterval(checkInterval);
              renderCaptchaWidget();
            }
          }, 50); // Check more frequently
          
          // Don't wait forever - maximum 2 seconds
          setTimeout(() => clearInterval(checkInterval), 2000);
        } else {
          renderCaptchaWidget();
        }
      } catch (e) {
        console.error("Failed to initialize captcha:", e);
        setIsLoading(false);
      }
    };
    
    // Minimal delay to ensure DOM is ready
    initCaptcha();
    
    // Clean up on unmount or re-render
    return () => {
      mountedRef.current = false;
      safelyRemoveWidget();
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
