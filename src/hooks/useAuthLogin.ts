
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        if (data.session) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "session exists" : "no session");
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
    
    // Create unique login attempt ID and store token locally
    const loginAttemptId = `login-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const token = captchaToken;
    
    // Clear captcha token from state immediately to prevent reuse
    setCaptchaToken(null);
    setCaptchaVerified(false);
    
    try {
      console.log(`Login attempt ${loginAttemptId} starting with token length: ${token.length}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: token,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        console.log(`Login successful for ${loginAttemptId}`);
        toast({
          title: "Login successful",
          description: "Welcome to Vyra Health Patient Portal!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(`Login error for ${loginAttemptId}:`, error);
      
      // Special handling for captcha errors
      if (error.message?.toLowerCase().includes('captcha')) {
        let errorMsg = "Captcha verification failed. Please try again.";
        
        if (error.message.includes('expired')) {
          errorMsg = "Captcha token has expired. Please complete the verification again.";
        } else if (error.message.includes('already-seen')) {
          errorMsg = "This captcha token has already been used. Please complete a new verification.";
        }
        
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
      }
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
        },
      });
      
      if (error) throw error;
      
      // No need to navigate, OAuth will handle the redirect
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorMessage(error.message || "Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      
      // First check if we have a valid session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Current session:", sessionData);
      
      // Proceed with sign out
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error("Sign out error details:", error);
        throw error;
      }
      
      // Clear any auth state in localStorage 
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health",
      });
      
      // Navigate to home/login page after successful sign out
      navigate("/login");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
      
      // Even if there's an error, try to navigate away
      navigate("/login");
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
    handleGoogleLogin,
    handleSignOut
  };
};
