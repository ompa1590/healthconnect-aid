
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    if (!captchaVerified || !captchaToken) {
      setErrorMessage("Please complete the captcha verification before signing in.");
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back to Altheo Health!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          // Fix: captchaToken not sent in options for OAuth
        },
      });
      
      if (error) throw error;
      
      // No need to navigate, OAuth will handle the redirect
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage(error.message || "Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isGoogleLoading,
    errorMessage,
    setErrorMessage,
    captchaToken,
    setCaptchaToken,
    captchaVerified,
    setCaptchaVerified,
    handleLogin,
    handleGoogleLogin
  };
};
