
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SignupCompleteProps {
  formData: SignupFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Load Supabase captcha script on component mount
  useEffect(() => {
    const loadCaptchaScript = async () => {
      // Check if script is already loaded
      if (document.getElementById('supabase-captcha-script')) {
        return;
      }
      
      // Load Supabase auth captcha script
      const script = document.createElement('script');
      script.id = 'supabase-captcha-script';
      script.src = 'https://juwznmplmnkfpmrmrrfv.supabase.co/functions/v1/auth-captcha-js';
      script.async = true;
      
      document.body.appendChild(script);
    };
    
    loadCaptchaScript();
  }, []);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trigger captcha verification
      const captchaToken = await (window as any).supabaseCaptchaCallback();
      
      // Sign up the user with email and password (including captcha token)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
          captchaToken,
        },
      });
      
      if (error) throw error;
      
      // Update the profile with additional information
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            province: formData.province,
            health_card_number: formData.healthCardNumber,
          })
          .eq('id', data.user.id);
          
        if (profileError) throw profileError;
        
        // Save medical history
        const { error: medicalHistoryError } = await supabase
          .from('medical_history')
          .insert({
            user_id: data.user.id,
            conditions: formData.medicalHistory.conditions,
            allergies: formData.medicalHistory.allergies,
            medications: formData.medicalHistory.medications,
            past_treatments: formData.medicalHistory.pastTreatments,
          });
          
        if (medicalHistoryError) throw medicalHistoryError;
      }
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Altheo Health! You can now log in.",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message || "There was an error creating your account. Please try again.");
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold">Ready to Create Your Account</h3>
      
      <p className="text-muted-foreground">
        Welcome to Altheo Health, {formData.name}! Your account details and medical information have been prepared for submission.
      </p>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 my-6 text-left">
        <h4 className="font-medium mb-2">Next Steps</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">1</span>
            <span>Create your account with a single click</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">2</span>
            <span>Log in to access your personal dashboard</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">3</span>
            <span>Book your first virtual consultation</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">
            I Already Have an Account
          </Link>
        </Button>
      </div>
      
      {/* Captcha container will be auto-populated by Supabase */}
      <div id="supabase-captcha-container" className="flex justify-center mt-4"></div>
    </div>
  );
};

export default SignupComplete;
