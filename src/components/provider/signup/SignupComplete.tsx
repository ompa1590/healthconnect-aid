
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showCaptchaErrorDialog, setShowCaptchaErrorDialog] = useState(false);
  const [captchaInstanceId, setCaptchaInstanceId] = useState(() => `captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const captchaElementId = useRef(`captcha-element-${Date.now()}`).current;
  
  // Reset captcha with a completely new instance
  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaInstanceId(`captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);
  
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
        
        // Always reset captcha on any error
        resetCaptcha();
        
        // Handle specific error types
        if (error.message.includes("rate limit") || error.message.includes("429") || 
            error.status === 429 || error.code === "over_email_send_rate_limit") {
          // Show rate limit dialog instead of toast for this specific error
          setShowRateLimitDialog(true);
        } else if (error.message.includes("already-seen-response") || error.message.includes("captcha")) {
          // Show captcha error dialog for reused token errors
          setShowCaptchaErrorDialog(true);
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
        
        // Show the success dialog
        setShowSuccessDialog(true);
        
        // Sign out the user in case they were automatically signed in
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
      
      resetCaptcha();
      setSubmitting(false);
    }
  };
  
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to provider login page
    navigate('/provider-login');
  };

  const handleRateLimitDialogClose = () => {
    setShowRateLimitDialog(false);
    setSubmitting(false);
  };

  const handleCaptchaErrorDialogClose = () => {
    setShowCaptchaErrorDialog(false);
    setSubmitting(false);
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
        
        {/* Each captcha gets a completely unique container and ID */}
        <div className="py-4 flex justify-center">
          <div id={captchaElementId} key={`captcha-wrapper-${captchaInstanceId}`}>
            <CaptchaComponent 
              captchaId={`provider-captcha-${captchaInstanceId}`}
              onVerify={handleCaptchaVerify}
              callbackName={`providerCaptchaCallback_${captchaInstanceId}`}
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
      
      {/* Success Dialog */}
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

      {/* Rate Limit Dialog */}
      <AlertDialog open={showRateLimitDialog} onOpenChange={setShowRateLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Email Rate Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                We've detected that too many registration attempts have been made in a short period. 
                This is a security measure by our email provider to prevent abuse.
              </p>
              <p>
                Please try again after a few minutes or use a different email address. If you continue 
                to experience issues, please contact our support team.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRateLimitDialogClose}>
              OK, I'll Try Later
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Captcha Error Dialog */}
      <AlertDialog open={showCaptchaErrorDialog} onOpenChange={setShowCaptchaErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Captcha Verification Failed</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                The captcha verification has expired or has already been used. This can happen if:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>You've waited too long after verifying the captcha</li>
                <li>You've attempted to submit the form multiple times</li>
                <li>Your browser has cached an old verification token</li>
              </ul>
              <p>
                Please complete the captcha verification again and then try creating your account.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCaptchaErrorDialogClose}>
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SignupComplete;
