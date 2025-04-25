
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CaptchaComponent from "@/components/auth/CaptchaComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsDialog, PrivacyDialog } from "@/components/signup/LegalPopups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SignupCompleteProps {
  formData: ProviderFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(`captcha-${Date.now()}`);
  
  // Generate a fresh captcha instance when component mounts or when we need to reset
  const regenerateCaptcha = useCallback(() => {
    const uniqueKey = `captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log("Generating new captcha with key:", uniqueKey);
    setCaptchaKey(uniqueKey);
    setCaptchaToken(null);
  }, []);
  
  // Initialize captcha when component mounts
  useEffect(() => {
    regenerateCaptcha();
  }, [regenerateCaptcha]);
  
  // Handle captcha verification
  const handleCaptchaVerify = (token: string) => {
    console.log("Captcha verified, got new token");
    setCaptchaToken(token);
  };
  
  const handleCreateAccount = async () => {
    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive"
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast({
        title: "Terms agreement required",
        description: "You must agree to the Terms & Conditions and Privacy Policy.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log("Starting signup with captcha token");
      
      // Attempt to sign up the provider
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'provider',
            specialization: formData.specializations ? formData.specializations.join(',') : '',
            registrationNumber: formData.registrationNumber || '',
            address: formData.address || '',
            city: formData.city || '',
            province: formData.province || '',
            postalCode: formData.postalCode || '',
            phoneNumber: formData.phoneNumber || '',
            isNewUser: true
          },
          captchaToken: captchaToken
        }
      });
      
      if (error) {
        console.error("Error during sign up:", error);
        
        // Always regenerate captcha on error
        regenerateCaptcha();
        
        // Handle specific error cases
        if (error.message.includes("rate limit") || error.message.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Too many registration attempts. Please try again after some time or use a different email.",
            variant: "destructive"
          });
        } else if (error.message.includes("already-seen-response") || error.message.includes("captcha")) {
          toast({
            title: "Captcha verification failed",
            description: "Please complete the captcha verification again with a new challenge.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        }
        
        setSubmitting(false);
      } else {
        console.log("Provider signup successful:", data);
        
        // Success - show the success dialog
        setShowSuccessDialog(true);
        
        // Sign out the user first (in case they were automatically signed in)
        await supabase.auth.signOut();
        
        // Call the onComplete callback
        onComplete();
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      // Reset captcha for a fresh attempt
      regenerateCaptcha();
      setSubmitting(false);
    }
  };
  
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to provider login page
    navigate('/provider-login');
  };
  
  return (
    <>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Almost Done</h3>
          <p className="text-muted-foreground">
            Thank you, Dr. {formData.lastName}, for registering with Vyra Health!
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-md text-left">
          <p className="text-sm font-medium mb-2">Next Steps:</p>
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Create your account by clicking the button below</li>
            <li>Our team will review your registration information</li>
            <li>We'll verify your professional credentials</li>
            <li>Once verified, you'll receive access to the provider dashboard</li>
            <li>You can start offering virtual care services to patients</li>
          </ol>
        </div>
        
        {/* Each captcha container gets a completely unique ID */}
        <div className="py-4 flex justify-center">
          <div key={captchaKey} id={`captcha-container-${captchaKey}`} className="captcha-wrapper">
            <CaptchaComponent 
              captchaId={`provider-signup-captcha-${captchaKey}`}
              onVerify={handleCaptchaVerify}
              callbackName={`handleProviderSignupCaptcha_${captchaKey}`}
            />
          </div>
        </div>
        
        {captchaToken && (
          <div className="text-sm text-green-500 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Verification complete
          </div>
        )}
        
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms} 
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <label 
            htmlFor="terms" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            I agree to the {' '}
            <TermsDialog>
              <span className="text-primary hover:underline cursor-pointer">Terms & Conditions</span>
            </TermsDialog>
            {' '} and {' '}
            <PrivacyDialog>
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </PrivacyDialog>
          </label>
        </div>
        
        <Button 
          onClick={handleCreateAccount} 
          className={`w-full mt-6 ${captchaToken && agreedToTerms ? 'bg-green-600 hover:bg-green-700' : ''}`}
          disabled={!captchaToken || !agreedToTerms || submitting}
        >
          {submitting ? "Creating Account..." : "Create Account"} 
          {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Complete</AlertDialogTitle>
            <AlertDialogDescription>
              Your provider account has been successfully created! You will now be redirected to the login page where you can sign in with your credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>
              Continue to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SignupComplete;
