import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CaptchaComponent from "@/components/auth/CaptchaComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsDialog, PrivacyDialog } from "@/components/signup/LegalPopups";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showCaptchaErrorDialog, setShowCaptchaErrorDialog] = useState(false);
  const [captchaKey, setCaptchaKey] = useState<number>(Date.now()); // Add key to force re-render of captcha
  const captchaElementId = useRef(`provider-captcha-element-${Date.now()}`).current;
  const signupRequestRef = useRef<AbortController | null>(null);
  
  // Create a unique ID for each captcha instance
  const getCaptchaInstanceId = useCallback(() => {
    return `provider-captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }, []);
  
  const [captchaInstanceId, setCaptchaInstanceId] = useState(() => getCaptchaInstanceId());
  
  // Handle captcha verification - get new token and prepare for immediate use
  const handleCaptchaVerify = useCallback((token: string) => {
    console.log("Captcha verified, got new token, ready to submit");
    setCaptchaToken(token);
  }, []);
  
  // Reset captcha completely - generates new instance and forces re-render
  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaInstanceId(getCaptchaInstanceId());
    setCaptchaKey(Date.now());
  }, [getCaptchaInstanceId]);
  
  const handleCreateAccount = async () => {
    if (!captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }
    
    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }
    
    // Abort previous signup request if any
    if (signupRequestRef.current) {
      signupRequestRef.current.abort();
    }
    
    signupRequestRef.current = new AbortController();
    setSubmitting(true);
    setError(null);
    
    try {
      // Create signup data using the current token
      const signupData = {
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
          captchaToken: captchaToken // Use the fresh token directly
        }
      };
      
      // Execute signup immediately
      console.log("Initiating signup request to Supabase...");
      const { data, error } = await supabase.auth.signUp(signupData);
      
      // Important: Immediately invalidate the captcha token after use
      // This prevents accidental reuse of the same token
      setCaptchaToken(null);
      
      if (error) {
        console.error("Error during sign up:", error);
        
        if (error.message.includes("rate limit") || error.message.includes("429") || 
            error.status === 429 || error.code === "over_email_send_rate_limit") {
          setShowRateLimitDialog(true);
        } else if (error.message.includes("already-seen-response") || error.message.includes("captcha")) {
          setShowCaptchaErrorDialog(true);
          // Reset captcha immediately on this specific error
          resetCaptcha();
        } else {
          setError(error.message || "There was an error creating your account. Please try again.");
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
          // Also reset captcha on general errors
          resetCaptcha();
        }
      } else {
        console.log("Provider signup successful:", data);
        
        // Update provider_profiles table with additional data
        if (data.user) {
          try {
            const { error: profileError } = await supabase
              .from('provider_profiles')
              .insert({
                id: data.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                address_line1: formData.address,
                city: formData.city,
                state: formData.province,
                zip_code: formData.postalCode,
                provider_type: formData.providerType,
                registration_number: formData.registrationNumber,
                specializations: formData.specializations,
                availability: formData.availability,
                date_of_birth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                biography: formData.biography,
              });
              
            if (profileError) {
              console.error("Error updating provider profile:", profileError);
            } else {
              console.log("Provider profile created successfully");
            }
          } catch (profileErr) {
            console.error("Exception creating provider profile:", profileErr);
          }
        }
        
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
      
      setError(error.message || "An unexpected error occurred. Please try again.");
      // Reset captcha on unexpected errors too
      resetCaptcha();
    } finally {
      setSubmitting(false);
      signupRequestRef.current = null;
    }
  };
  
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/provider-login');
  };

  const handleRateLimitDialogClose = () => {
    setShowRateLimitDialog(false);
    setSubmitting(false);
    // Reset captcha when closing rate limit dialog
    resetCaptcha();
  };

  const handleCaptchaErrorDialogClose = () => {
    setShowCaptchaErrorDialog(false);
    setSubmitting(false);
    // Captcha already reset when error detected
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
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
        
        <div className="py-4 flex justify-center" id={captchaElementId}>
          {!captchaToken && (
            <CaptchaComponent 
              key={captchaKey} // Important: Use the key to force re-render
              captchaId={`provider-captcha-${captchaInstanceId}`}
              onVerify={handleCaptchaVerify}
              callbackName={`providerCaptchaCallback_${captchaInstanceId}`}
            />
          )}
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
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : "Create Account"} 
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