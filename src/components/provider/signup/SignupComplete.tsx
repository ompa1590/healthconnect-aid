
import React, { useState, useEffect } from "react";
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
  const [captchaKey, setCaptchaKey] = useState(Date.now().toString());
  
  // Refresh the captcha when the component mounts or when we need a fresh token
  useEffect(() => {
    setCaptchaKey(Date.now().toString());
  }, []);
  
  const handleCaptchaVerify = (token: string) => {
    console.log("Captcha verified, setting token:", token);
    setCaptchaToken(token);
  };
  
  const resetCaptcha = () => {
    // Generate a new captcha key to force a complete re-render
    setCaptchaKey(Date.now().toString());
    setCaptchaToken(null);
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
      // Convert specializations to array if it's a string
      const specializations = typeof formData.specializations === 'string' 
        ? formData.specializations.split(',') 
        : formData.specializations || [];
      
      // Attempt to sign up the provider
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'provider',
            specialization: specializations.length > 0 ? specializations[0] : '',
            registrationNumber: formData.registrationNumber || '',
            address: formData.address || '',
            city: formData.city || '',
            province: formData.province || '',
            postalCode: formData.postalCode || '',
            phoneNumber: formData.phoneNumber || '',
            isNewUser: true // Flag to identify new users for welcome modal
          },
          captchaToken: captchaToken  // Pass the captcha token to Supabase
        }
      });
      
      if (error) {
        console.error("Error during sign up:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        // Reset captcha for a fresh attempt
        resetCaptcha();
        setSubmitting(false);
      } else {
        console.log("Provider signup successful:", data);
        
        // Create initial provider profile in the database
        if (data.user) {
          try {
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth) : null;
            const dob = dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null;
            
            const providerProfileData = {
              id: data.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone_number: formData.phoneNumber || '',
              date_of_birth: dob,
              gender: formData.gender || 'male',
              address_line1: formData.address || '',
              address_line2: '',
              city: formData.city || '',
              state: formData.province || '',
              zip_code: formData.postalCode || '',
              provider_type: formData.providerType || 'physician',
              registration_number: formData.registrationNumber || '',
              specializations: specializations,
              biography: formData.biography || '',
              availability: {
                monday: { isAvailable: true, isFullDay: true },
                tuesday: { isAvailable: true, isFullDay: true },
                wednesday: { isAvailable: true, isFullDay: true },
                thursday: { isAvailable: true, isFullDay: true },
                friday: { isAvailable: true, isFullDay: true },
                saturday: { isAvailable: true, isFullDay: true },
                sunday: { isAvailable: true, isFullDay: true }
              }
            };
            
            // Insert into provider_profiles table
            const { error: profileError } = await supabase
              .from('provider_profiles')
              .insert(providerProfileData);
              
            if (profileError) {
              console.error("Error creating provider profile:", profileError);
            }
          } catch (profileError) {
            console.error("Error creating provider profile:", profileError);
          }
        }
        
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
          <CaptchaComponent 
            captchaId={`provider-signup-captcha-${captchaKey}`}
            onVerify={handleCaptchaVerify}
            callbackName={`handleProviderSignupCaptcha${captchaKey}`}
          />
        </div>
        
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
