import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Upload, Loader2, RefreshCw } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CaptchaComponentWithRef, CaptchaRefType } from "@/components/auth/CaptchaComponent";
import { TermsDialog, PrivacyDialog, HIPAAComplianceDialog } from "./LegalPopups";

interface SignupCompleteProps {
  formData: SignupFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  
  // Generate a unique ID for this signup session
  const captchaId = useRef(`signup-captcha-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`).current;
  const callbackName = useRef(`signupCaptchaCallback${Math.random().toString(36).substring(2, 15)}`).current;
  
  const captchaRef = useRef<CaptchaRefType>(null);
  
  // Validate that all required fields are present
  const validateRequiredFields = () => {
    if (!formData.name || !formData.name.trim()) {
      return "Full name is required";
    }
    if (!formData.email || !formData.email.trim()) {
      return "Email address is required";
    }
    if (!formData.password || !formData.password.trim()) {
      return "Password is required";
    }
    if (!formData.province || !formData.province.trim()) {
      return "Province is required";
    }
    if (!formData.healthCardNumber || !formData.healthCardNumber.trim()) {
      return "Health card number is required";
    }
    return null;
  };
  
  // Clear captcha state when component mounts
  useEffect(() => {
    console.log("Patient signup: Setting up captcha with ID:", captchaId);
    setCaptchaError(null);
    setCaptchaVerified(false);
    setCaptchaToken(null);
  }, [captchaId]);
  
  const handleCaptchaVerify = (token: string) => {
    console.log("Patient signup: CAPTCHA verified, token received of length:", token.length);
    setCaptchaToken(token);
    setCaptchaVerified(true);
    setCaptchaError(null);
  };
  
  const resetCaptcha = () => {
    console.log("Patient signup: Resetting captcha");
    setCaptchaVerified(false);
    setCaptchaToken(null);
    setCaptchaError(null);
    
    // Use the ref to reset the captcha
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const uploadDocuments = async (userId: string) => {
    const files = formData.documentFiles || [];
    if (files.length === 0) return [];
    
    try {
      const documentUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('medical_documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        const fileUrl = data?.path;
        documentUrls.push({
          path: fileUrl,
          name: file.name,
          type: fileExt
        });
        
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      return documentUrls;
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Document upload failed",
        description: "There was an issue uploading your documents. You can upload them later from your dashboard.",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate all required fields
      const validationError = validateRequiredFields();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
      
      if (!termsAccepted) {
        setError("You must accept the Terms & Conditions and Privacy Policy to create an account");
        setLoading(false);
        return;
      }
      
      if (!captchaVerified || !captchaToken) {
        toast({
          title: "Captcha Required",
          description: "Please complete the captcha verification before creating your account.",
          variant: "destructive",
        });
        setCaptchaError("Please complete the captcha verification before proceeding.");
        setLoading(false);
        return;
      }
      
      // Store token in a local variable and immediately clear state to prevent reuse
      const token = captchaToken;
      console.log(`Patient signup: Starting signup with captcha token of length: ${token.length}`);
      
      // Clear captcha token immediately to prevent reuse
      setCaptchaToken(null);
      setCaptchaVerified(false);
      
      // Create a signup session ID to track this attempt
      const signupSessionId = `signup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      console.log(`Signup attempt ID: ${signupSessionId}`);
      
      // First try to properly initialize the Supabase client
      console.log("Verifying Supabase client is initialized...");
      const { data: sessionCheck } = await supabase.auth.getSession();
      console.log("Current session check:", sessionCheck ? "successful" : "failed");
      
      // Attempt to sign up
      console.log("Attempting to sign up user with email:", formData.email);
      
      // Include all necessary user data in the metadata during signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'patient',
            province: formData.province,
            health_card_number: formData.healthCardNumber,
            health_card_version: formData.healthCardVersion,
            health_card_province: formData.healthCardProvince,
            health_card_expiry: formData.healthCardExpiry,
            signupSessionId,
          },
          captchaToken: token,
        },
      });
      
      if (error) {
        console.error(`Error during signup (${signupSessionId}):`, error);
        
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
          resetCaptcha();
          setLoading(false);
          return;
        }
        
        throw error;
      }
      
      console.log(`Signup successful (${signupSessionId}):`, data);
      
      if (!data.user) {
        throw new Error("Failed to create user account");
      }

      // Wait for the auth trigger to create the profile
      // Short delay to ensure the trigger has time to execute
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Insert medical history data directly with the user_id
      console.log("Saving medical history data...");
      const { error: medicalHistoryError } = await supabase
        .from('medical_history')
        .insert({
          user_id: data.user.id,
          conditions: formData.medicalHistory.conditions,
          allergies: formData.medicalHistory.allergies,
          medications: formData.medicalHistory.medications,
          past_treatments: formData.medicalHistory.pastTreatments,
        });
        
      if (medicalHistoryError) {
        console.error("Error saving medical history:", medicalHistoryError);
        // Continue despite error
      }
      
      if (formData.documentFiles && formData.documentFiles.length > 0) {
        const documentDetails = await uploadDocuments(data.user.id);
        
        if (documentDetails.length > 0) {
          const documentsToInsert = documentDetails.map(doc => ({
            user_id: data.user.id,
            document_path: doc.path,
            document_type: doc.type,
            document_name: doc.name,
            uploaded_at: new Date().toISOString(),
          }));
          
          const { error: documentsError } = await supabase
            .from('user_documents')
            .insert(documentsToInsert);
            
          if (documentsError) {
            console.error("Error saving document references:", documentsError);
            // Continue despite error
          }
        }
      }
      
      // Successful signup
      toast({
        title: "Account created successfully",
        description: "Welcome to Vyra Health! You can now log in.",
      });
      
      // Call onComplete callback to trigger any parent component actions
      onComplete();
      
      // Navigate to login page instead of dashboard to ensure a clean session
      navigate('/login');
    } catch (error: any) {
      console.error("Error during signup:", error);
      setError(error.message || "There was an error creating your account. Please try again.");
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
      
      // Reset captcha if we get a general error
      resetCaptcha();
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 text-center font-poppins">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold">Ready to Create Your Account</h3>
      
      <p className="text-muted-foreground">
        Welcome to Vyra Health, {formData.name}! Your account details, medical information, and documents have been prepared for submission.
      </p>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {formData.documents && formData.documents.length > 0 && (
        <div className="bg-muted/20 p-4 rounded-lg border border-border/30 my-4 text-left">
          <div className="flex items-center mb-2">
            <Upload className="h-4 w-4 mr-2 text-primary" />
            <h4 className="font-medium">Documents to Upload</h4>
          </div>
          <ul className="space-y-1 text-sm">
            {formData.documents.map((doc, index) => (
              <li key={index} className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-primary/20 mr-2"></span>
                <span className="truncate">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-muted/30 h-2 rounded-full mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-muted-foreground mt-1">Uploading documents... {uploadProgress}%</p>
        </div>
      )}
      
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 my-6 text-left">
        <h4 className="font-medium mb-2">Next Steps</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">1</span>
            <span>Complete the security verification below</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">2</span>
            <span>Accept the Terms & Conditions and Privacy Policy</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">3</span>
            <span>Create your account with a single click</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">4</span>
            <span>Log in to access your personal dashboard</span>
          </li>
        </ul>
      </div>
      
      <div className="border-t border-border/30 pt-6">
        <h4 className="font-medium mb-4">Security Verification</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Please complete the security check below to verify you're human.
        </p>
        
        <div className="flex justify-center mb-4" id="captcha-container">
          <CaptchaComponentWithRef 
            captchaId={captchaId}
            onVerify={handleCaptchaVerify}
            callbackName={callbackName}
            ref={captchaRef}
          />
        </div>
        
        {captchaError && (
          <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm mb-4">
            {captchaError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 h-6 text-xs flex items-center"
              onClick={resetCaptcha}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Reset Verification
            </Button>
          </div>
        )}
        
        {captchaVerified && !captchaError && (
          <p className="text-green-500 text-sm font-medium flex items-center justify-center mb-4">
            <CheckCircle className="h-4 w-4 mr-1" /> Verification complete
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2 justify-center">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
        />
        <label
          htmlFor="terms"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left"
        >
          I agree to the{" "}
          <TermsDialog>
            <span className="text-primary hover:underline cursor-pointer">Terms and Conditions</span>
          </TermsDialog>{" "}
          ,{" "}
          <PrivacyDialog>
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </PrivacyDialog>{" "}
          and{" "}
          <HIPAAComplianceDialog>
            <span className="text-primary hover:underline cursor-pointer">HIPAA Compliance</span>
          </HIPAAComplianceDialog>
        </label>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Button 
          onClick={handleSignup} 
          disabled={loading || !captchaVerified || !termsAccepted}
          className={captchaVerified && termsAccepted ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : captchaVerified && termsAccepted ? "Create Account ✓" : "Create Account"}
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">
            I Already Have an Account
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SignupComplete;
