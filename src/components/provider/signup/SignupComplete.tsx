
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CaptchaComponentWithRef, CaptchaRefType } from "@/components/auth/CaptchaComponent";
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
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<CaptchaRefType>(null);
  
  // Use a unique ID for this provider signup session
  const captchaId = useRef(`provider-signup-captcha-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`).current;
  const callbackName = useRef(`handleProviderSignupCaptcha${Math.random().toString(36).substring(2, 15)}`).current;
  
  // Refresh the captcha when the component mounts
  useEffect(() => {
    console.log("Provider signup: Initial captcha setup with ID:", captchaId);
    setCaptchaError(null);
  }, [captchaId]);
  
  const handleCaptchaVerify = (token: string) => {
    console.log("Provider signup: CAPTCHA verified, token received of length:", token.length);
    setCaptchaToken(token);
    setCaptchaError(null);
  };
  
  const resetCaptcha = () => {
    console.log("Provider signup: Resetting captcha");
    setCaptchaToken(null);
    setCaptchaError(null);
    
    // Use the ref to reset the captcha
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };
  
  const handleCreateAccount = async () => {
    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the captcha verification.",
        variant: "destructive"
      });
      setCaptchaError("Please complete the captcha verification.");
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
    
    // Create a signup session ID to track this attempt
    const signupSessionId = `provider-signup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Provider signup: Attempt with ID ${signupSessionId} - token length:`, captchaToken.length);
    
    // Store token in a local variable and clear the state immediately to prevent reuse
    const token = captchaToken;
    setCaptchaToken(null);
    
    try {
      // First verify the Supabase client is initialized
      console.log("Verifying Supabase client is initialized...");
      const { data: sessionCheck } = await supabase.auth.getSession();
      console.log("Current session check:", sessionCheck ? "successful" : "failed");
      
      // Attempt to sign up the provider
      console.log("Attempting to sign up provider with email:", formData.email);
      
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
            isNewUser: true, // Flag to identify new users for welcome modal
            signupSessionId // Track this signup attempt
          },
          captchaToken: token
        }
      });
      
      if (error) {
        console.error(`Error during sign up (${signupSessionId}):`, error);
        
        // Special handling for CAPTCHA errors
        if (error.message.toLowerCase().includes('captcha')) {
          let errorMessage = "Captcha verification failed. Please try again with a new verification.";
          
          if (error.message.includes('expired')) {
            errorMessage = "Captcha token has expired. Please complete the verification again.";
          } else if (error.message.includes('already-seen')) {
            errorMessage = "This captcha token has already been used. Please complete a new verification.";
          } else if (error.message.includes('timeout')) {
            errorMessage = "The verification process timed out. Please try again.";
          }
          
          toast({
            title: "Verification error",
            description: errorMessage,
            variant: "destructive"
          });
          
          setCaptchaError(errorMessage);
          // Reset captcha for a fresh attempt
          resetCaptcha();
        } else {
          // Handle other signup errors
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        }
        
        setSubmitting(false);
      } else {
        console.log(`Provider signup successful (${signupSessionId}):`, data);
        
        // Save provider profile data
        if (data.user) {
          try {
            const { error: profileError } = await supabase.from('provider_profiles').insert({
              id: data.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone_number: formData.phoneNumber,
              provider_type: formData.providerType,
              registration_number: formData.registrationNumber,
              specializations: formData.specializations,
              biography: formData.biography,
              availability: formData.availability,
              date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0],
              registration_expiry: formData.registrationExpiry?.toISOString().split('T')[0],
              address_line1: formData.address,
              city: formData.city,
              state: formData.province,
              zip_code: formData.postalCode
            });
            
            if (profileError) {
              console.error("Error saving provider profile:", profileError);
            }
          } catch (profileSaveError) {
            console.error("Exception during profile save:", profileSaveError);
          }
        }
        
        // Success - show the success dialog
        setShowSuccessDialog(true);
        
        // Sign out the user first (in case they were automatically signed in)
        await supabase.auth.signOut();
        
        // Call the onComplete callback
        onComplete();
      }
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      // Reset captcha for a fresh attempt
      resetCaptcha();
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
        
        <div className="py-4 flex justify-center">
          <CaptchaComponentWithRef 
            captchaId={captchaId}
            onVerify={handleCaptchaVerify}
            callbackName={callbackName}
            ref={captchaRef}
          />
        </div>
        
        {captchaError && (
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
            {captchaError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 h-6 text-xs"
              onClick={resetCaptcha}
            >
              Reset Verification
            </Button>
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
          className="w-full mt-6"
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
