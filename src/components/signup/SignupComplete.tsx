import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Upload, Loader2 } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CaptchaComponent from "@/components/auth/CaptchaComponent";
import { TermsDialog, PrivacyDialog, HIPAAComplianceDialog } from "./LegalPopups";
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
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showCaptchaErrorDialog, setShowCaptchaErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Generate a truly unique captcha instance ID that changes on component mount and reset
  const [captchaInstanceId, setCaptchaInstanceId] = useState(() => 
    `patient-captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );
  
  // Unique element ID for the captcha container
  const captchaElementId = useRef(`patient-captcha-element-${Date.now()}`).current;
  
  // Reset captcha function to generate a completely new instance
  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaVerified(false);
    // Generate a completely new instance ID to force remounting the captcha
    setCaptchaInstanceId(`patient-captcha-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);
  
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
  
  const handleCaptchaVerify = (token: string) => {
    console.log("Captcha verified with token");
    setCaptchaToken(token);
    setCaptchaVerified(true);
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
    } catch (error) {
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
        setLoading(false);
        return;
      }
      
      console.log("Starting signup with captcha token");
      
      // Immediately attempt signup without delay after captcha verification
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
          captchaToken: captchaToken,
        },
      });
      
      if (error) {
        console.error("Error during signup:", error);
        
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
          setError(error.message || "There was an error creating your account. Please try again.");
        }
        
        setLoading(false);
        return;
      }
      
      if (!data.user) {
        throw new Error("Failed to create user account");
      }
      
      // Handle profile and document uploads as before
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          province: formData.province,
          health_card_number: formData.healthCardNumber,
        })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
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
          }
        }
      }
      
      // Show success dialog instead of redirecting immediately
      setShowSuccessDialog(true);

      // Sign out the user first (in case they were automatically signed in)
      await supabase.auth.signOut();
      
      // Call the onComplete callback
      onComplete();
      
    } catch (error) {
      console.error("Error during signup:", error);
      resetCaptcha();
      setError(error.message || "There was an error creating your account. Please try again.");
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/login');
  };

  const handleRateLimitDialogClose = () => {
    setShowRateLimitDialog(false);
    setLoading(false);
  };

  const handleCaptchaErrorDialogClose = () => {
    setShowCaptchaErrorDialog(false);
    setLoading(false);
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
      
      {/* Display document information if available */}
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
      
      {/* Upload progress indicator */}
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
        
        {/* Each captcha gets a completely unique ID and container */}
        <div className="flex justify-center mb-4" id={captchaElementId} key={`captcha-wrapper-${captchaInstanceId}`}>
          <CaptchaComponent 
            captchaId={`signup-captcha-${captchaInstanceId}`}
            onVerify={handleCaptchaVerify}
            callbackName={`signupCaptchaCallback_${captchaInstanceId}`}
          />
        </div>
        
        {captchaVerified && (
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

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Complete</AlertDialogTitle>
            <AlertDialogDescription>
              Your account has been successfully created! You will now be redirected to the login page where you can sign in with your credentials.
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
    </div>
  );
};

export default SignupComplete;
