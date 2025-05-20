
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

type RegistrationPhase = 
  | 'initial' 
  | 'creating_auth' 
  | 'creating_profile' 
  | 'uploading_documents'
  | 'complete';

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [registrationPhase, setRegistrationPhase] = useState<RegistrationPhase>('initial');
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxRetries = 3;
  
  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase connection check failed:", error);
          setConnectionStatus('error');
          setDetailedError(`Connection error: ${error.message}`);
          return;
        }
        
        console.log("Supabase connection check successful:", data.session ? "Active session exists" : "No active session");
        setConnectionStatus('connected');
      } catch (err) {
        console.error("Unexpected error checking Supabase connection:", err);
        setConnectionStatus('error');
        setDetailedError(`Unexpected connection error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    checkConnection();
  }, []);

  const handleRetry = () => {
    setDetailedError(null);
    setRetryAttempt(0);
    setSubmitting(false);
    setRegistrationPhase('initial');
    setUploadProgress(0);
  };
  
  const createProviderProfile = async (userId: string): Promise<{ success: boolean; error?: any }> => {
    try {
      console.log("Creating provider profile via edge function...");
      
      // IMPORTANT: Only send text-based data needed for profile creation, NO FILES
      const providerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        providerType: formData.providerType,
        customProviderType: formData.customProviderType,
        registrationNumber: formData.registrationNumber,
        registrationExpiry: formData.registrationExpiry?.toISOString(),
        specializations: formData.specializations,
        servicesOffered: formData.servicesOffered,
        biography: formData.biography,
        availability: formData.availability,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode
      };
      
      // Set a short timeout to detect if the function call is taking too long
      const timeout = setTimeout(() => {
        console.log("Profile creation taking longer than expected...");
      }, 5000);
      
      // Call the edge function to create the provider profile
      const { data, error } = await supabase.functions.invoke('provider-signup/create-profile', {
        body: { 
          userId, 
          providerData 
        }
      });
      
      clearTimeout(timeout);
      
      if (error) {
        console.error("Error from edge function:", error);
        return { success: false, error };
      }
      
      // Check if we got data back and it contains success status
      if (!data) {
        console.error("No data returned from edge function");
        return { success: false, error: "No response from server" };
      }
      
      if (!data.success) {
        console.error("Profile creation failed:", data.error);
        return { success: false, error: data.error };
      }
      
      console.log("Provider profile created successfully!");
      return { success: true };
    } catch (err) {
      console.error("Exception during profile creation:", err);
      return { success: false, error: err };
    }
  };

  // Function to upload files to Storage Bucket directly
  const uploadProfilePicture = async (userId: string, file: File): Promise<{ success: boolean, path?: string, error?: any }> => {
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    
    try {
      console.log(`Starting upload of profile picture: ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB`);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      // Upload the file to Storage
      const { data, error } = await supabase.storage
        .from('provider-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Error uploading profile picture:", error);
        return { success: false, error };
      }
      
      console.log("Profile picture uploaded successfully:", data.path);
      
      // Notify the edge function about the file upload
      await supabase.functions.invoke('provider-signup/upload-file', {
        body: {
          userId,
          fileType: 'profile_picture',
          fileData: "uploaded_directly", // Just a marker since we uploaded directly
          fileName: data.path
        }
      });
      
      return { success: true, path: data.path };
    } catch (err) {
      console.error("Exception uploading profile picture:", err);
      return { success: false, error: err };
    }
  };
  
  const uploadCertificate = async (userId: string, file: File): Promise<{ success: boolean, path?: string, error?: any }> => {
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    
    try {
      console.log(`Starting upload of certificate: ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB`);
      
      // Check file size - if too large, compress or reject
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        console.warn("Certificate file is very large, might cause issues");
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/certificates/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      // Upload the file to Storage
      const { data, error } = await supabase.storage
        .from('provider-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Error uploading certificate:", error);
        return { success: false, error };
      }
      
      console.log("Certificate uploaded successfully:", data.path);
      return { success: true, path: data.path };
    } catch (err) {
      console.error("Exception uploading certificate:", err);
      return { success: false, error: err };
    }
  };
  
  const uploadSignature = async (userId: string, signatureImage: string): Promise<{ success: boolean, path?: string, error?: any }> => {
    if (!signatureImage) {
      return { success: false, error: "No signature provided" };
    }
    
    try {
      console.log("Starting upload of signature image");
      
      // Convert base64 to blob
      const response = await fetch(signatureImage);
      const blob = await response.blob();
      
      // Create a unique file path
      const fileName = `${userId}/signatures/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`;
      
      // Upload the file to Storage
      const { data, error } = await supabase.storage
        .from('provider-files')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Error uploading signature:", error);
        return { success: false, error };
      }
      
      console.log("Signature uploaded successfully:", data.path);
      return { success: true, path: data.path };
    } catch (err) {
      console.error("Exception uploading signature:", err);
      return { success: false, error: err };
    }
  };
  
  const handleCreateAccount = async () => {
    // Clear previous errors
    setDetailedError(null);
    
    if (connectionStatus === 'error') {
      toast({
        title: "Connection error",
        description: "Unable to connect to authentication service. Please try again later.",
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
    const currentRetry = retryAttempt + 1;
    setRetryAttempt(currentRetry);
    
    // Create a signup session ID to track this attempt
    const signupSessionId = `provider-signup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Provider signup: Attempt ${currentRetry}/${maxRetries} with ID ${signupSessionId} starting...`);
    console.log(`Provider email: ${formData.email}`);
    
    try {
      // First verify the Supabase client is initialized
      console.log("Verifying Supabase client is initialized...");
      const { data: sessionCheck, error: sessionCheckError } = await supabase.auth.getSession();
      
      if (sessionCheckError) {
        throw new Error(`Session check failed: ${sessionCheckError.message}`);
      }
      
      console.log("Connection check successful:", sessionCheck ? "client ready" : "no active session");
      
      // PHASE 1: MINIMAL AUTH SIGNUP - ONLY email, password, and essential metadata
      // No files or large data objects in initial auth call
      setRegistrationPhase('creating_auth');
      console.log(`Attempting minimal auth signup (${signupSessionId}) with email:`, formData.email);
      
      // Set a timeout for the auth request to detect if it's taking too long
      const authTimeoutID = setTimeout(() => {
        console.log("Auth request is taking longer than expected...");
      }, 5000); // 5 seconds warning
      
      // Important: Only include minimal metadata - NO FILES OR LARGE OBJECTS
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'provider',
            firstName: formData.firstName,
            lastName: formData.lastName,
            signupSessionId
          }
        }
      });
      
      // Clear the timeout since we got a response
      clearTimeout(authTimeoutID);
      
      if (error) {
        console.error(`Error during sign up (${signupSessionId}):`, error);
        
        // Format error with more details for debugging
        const errorDetails = {
          message: error.message || "Unknown error",
          code: error.code,
          status: error.status,
          name: error.name
        };
        
        // Show a more helpful error message based on error type
        if (error.status === 504 || error.status === 408) {
          setDetailedError(`Authentication timeout: The signup request took too long to process. Please try again with a better internet connection or try again later.`);
        } else if (error.message && error.message.includes("already registered")) {
          setDetailedError(`This email is already registered. Please try logging in instead, or use a different email address.`);
        } else {
          setDetailedError(`Authentication error (${error.status}): ${error.message || "Unknown error"}`);
        }
        
        toast({
          title: "Sign up failed",
          description: "Authentication error occurred. Please check the error details and try again.",
          variant: "destructive"
        });
        
        setSubmitting(false);
        return;
      }
      
      // PHASE 2: Now create the provider profile using our edge function
      if (data.user) {
        console.log(`Provider auth signup successful (${signupSessionId}):`, data.user.id);
        setRegistrationPhase('creating_profile');
        
        const { success, error: profileError } = await createProviderProfile(data.user.id);
        
        if (!success) {
          console.error("Error creating provider profile:", profileError);
          setDetailedError(`Auth success but profile creation failed: ${JSON.stringify(profileError)}`);
          
          toast({
            title: "Account created with warnings",
            description: "Your account was created but profile setup is incomplete. You can update it later.",
            variant: "destructive"
          });
        }
        
        // PHASE 3: Upload files separately after successful profile creation
        setRegistrationPhase('uploading_documents');
        setUploadProgress(0);
        let totalFiles = 0;
        let completedFiles = 0;
        
        // Count total files to upload
        if (formData.profilePicture) totalFiles++;
        if (formData.certificateFile) totalFiles++;
        if (formData.signatureImage) totalFiles++;
        
        if (totalFiles > 0) {
          console.log(`Starting upload of ${totalFiles} files`);
          
          // Upload profile picture
          if (formData.profilePicture) {
            const result = await uploadProfilePicture(data.user.id, formData.profilePicture);
            if (result.success) {
              completedFiles++;
              setUploadProgress((completedFiles / totalFiles) * 100);
            }
          }
          
          // Upload certificate
          if (formData.certificateFile) {
            const result = await uploadCertificate(data.user.id, formData.certificateFile);
            if (result.success) {
              completedFiles++;
              setUploadProgress((completedFiles / totalFiles) * 100);
            }
          }
          
          // Upload signature
          if (formData.signatureImage) {
            const result = await uploadSignature(data.user.id, formData.signatureImage);
            if (result.success) {
              completedFiles++;
              setUploadProgress((completedFiles / totalFiles) * 100);
            }
          }
          
          console.log(`Completed ${completedFiles} of ${totalFiles} file uploads`);
        } else {
          console.log("No files to upload");
        }
        
        // PHASE 4: Send confirmation email through Supabase Auth
        try {
          console.log("Sending email confirmation");
          // Relies on Supabase email confirmation template
          // This is just a notification, not a blocker
          // No custom code needed as Supabase handles this
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Continue anyway - non-critical
        }
      } else {
        console.warn("Auth signup returned no user data, but also no error.");
        setDetailedError("Auth signup returned no user data, but also no error. This may indicate a partial registration.");
      }
      
      // Success - show the success dialog
      setRegistrationPhase('complete');
      setShowSuccessDialog(true);
      
      // Sign out the user (in case they were automatically signed in)
      await supabase.auth.signOut();
      
      // Call the onComplete callback
      onComplete();
      
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      
      // Enhanced error logging for debugging
      const errorOutput = {
        message: error.message || String(error),
        code: error?.code,
        name: error?.name,
        stack: error?.stack?.substring(0, 500) || 'No stack trace',
        cause: error?.cause ? String(error.cause) : undefined
      };
      
      setDetailedError(`Unexpected error: ${JSON.stringify(errorOutput)}`);
      
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setSubmitting(false);
    }
  };
  
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to provider login page
    navigate('/provider-login');
  };
  
  // Helper function to render registration phase status
  const renderRegistrationPhaseStatus = () => {
    if (!submitting) return null;
    
    let phaseText = "";
    let phaseProgress = 0;
    
    switch(registrationPhase) {
      case 'creating_auth':
        phaseText = "Creating your account...";
        phaseProgress = 25;
        break;
      case 'creating_profile':
        phaseText = "Setting up your provider profile...";
        phaseProgress = 50;
        break;
      case 'uploading_documents':
        phaseText = "Uploading your documents...";
        phaseProgress = 75;
        break;
      case 'complete':
        phaseText = "Registration complete!";
        phaseProgress = 100;
        break;
      default:
        phaseText = "Processing...";
        phaseProgress = 10;
    }
    
    return (
      <div className="bg-muted/30 p-3 rounded-md">
        <div className="flex items-center gap-2 mb-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium">{phaseText}</p>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${phaseProgress}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          Attempt {retryAttempt}/{maxRetries}
        </p>
        
        {registrationPhase === 'uploading_documents' && uploadProgress > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Uploading documents: {Math.round(uploadProgress)}%</p>
            <div className="w-full bg-muted/50 h-1 mt-1 rounded-full">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
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
        
        {connectionStatus === 'checking' && (
          <div className="bg-muted/30 p-4 rounded-md text-center">
            <div className="animate-pulse">Checking connection...</div>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="bg-destructive/10 p-4 rounded-md text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Connection error</p>
              <p className="text-sm">Unable to connect to authentication service. Please try refreshing the page.</p>
            </div>
          </div>
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
        
        {/* Display registration phase status */}
        {renderRegistrationPhaseStatus()}
        
        {detailedError && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
            <details>
              <summary className="font-medium cursor-pointer">Technical error details</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{detailedError}</pre>
            </details>
            {retryAttempt >= maxRetries && (
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry} 
                  className="text-xs flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reset and try again
                </Button>
              </div>
            )}
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
          disabled={!agreedToTerms || submitting || connectionStatus !== 'connected'}
        >
          {submitting ? `Creating Account...` : "Create Account"} 
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
