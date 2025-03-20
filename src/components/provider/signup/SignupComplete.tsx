
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CaptchaComponent from "@/components/auth/CaptchaComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsDialog, PrivacyDialog } from "@/components/signup/LegalPopups";

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
  
  const handleCaptchaVerify = (token: string) => {
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
      // Attempt to sign up the provider
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'provider',
            specialization: formData.specializations || '',
            registrationNumber: formData.registrationNumber || '',
            address: formData.address || '',
            city: formData.city || '',
            province: formData.province || '',
            postalCode: formData.postalCode || '',
            phoneNumber: formData.phoneNumber || '',
            isNewUser: true // Flag to identify new users for welcome modal
          }
        }
      });
      
      if (error) {
        console.error("Error during sign up:", error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Success - notify user and redirect to sign-in page
        toast({
          title: "Account created",
          description: "Your provider account has been successfully created! Please sign in with your credentials.",
        });
        
        // Sign out the user first (in case they were automatically signed in)
        await supabase.auth.signOut();
        
        // Call the onComplete callback and navigate to the sign-in page
        onComplete();
        navigate('/provider-login');
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-14 w-14 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Registration Complete</h3>
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
          captchaId="provider-signup-captcha" 
          onVerify={handleCaptchaVerify}
          callbackName="handleProviderSignupCaptcha"
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
  );
};

export default SignupComplete;
