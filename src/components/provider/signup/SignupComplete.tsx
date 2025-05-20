
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

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [registrationPhase, setRegistrationPhase] = useState<'initial' | 'creating_auth' | 'creating_profile' | 'complete'>('initial');
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
  };
  
  const createProviderProfile = async (userId: string): Promise<{ success: boolean; error?: any }> => {
    try {
      console.log("Creating provider profile via edge function...");
      
      // Only send necessary data for profile creation, not files
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
      
      // Call the edge function to create the provider profile
      const { data, error } = await supabase.functions.invoke('provider-signup/create-profile', {
        body: { 
          userId, 
          providerData 
        }
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        return { success: false, error };
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
      
      // PHASE 1: Minimal Auth Signup - only email and password
      // This minimizes the data sent in the initial auth call to reduce timeouts
      setRegistrationPhase('creating_auth');
      console.log(`Attempting minimal auth signup (${signupSessionId}) with email:`, formData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Only include essential minimal metadata - no large objects
          data: {
            role: 'provider',
            firstName: formData.firstName,
            lastName: formData.lastName,
            signupSessionId
          }
        }
      });
      
      if (error) {
        console.error(`Error during sign up (${signupSessionId}):`, error);
        
        // Detailed error logging for debugging
        const errorDetails = {
          message: error.message,
          code: error?.code,
          status: error?.status,
          name: error?.name,
          stack: error?.stack
        };
        console.error("Detailed error info:", errorDetails);
        
        setDetailedError(`Authentication error: ${JSON.stringify(errorDetails)}`);
        
        toast({
          title: "Sign up failed",
          description: error.message || "Authentication error occurred",
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
      } else {
        console.warn("Auth signup returned no user data, but also no error.");
        setDetailedError("Auth signup returned no user data, but also no error.");
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
      
      // Enhanced error logging
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
        phaseProgress = 50;
        break;
      case 'creating_profile':
        phaseText = "Setting up your provider profile...";
        phaseProgress = 75;
        break;
      case 'complete':
        phaseText = "Registration complete!";
        phaseProgress = 100;
        break;
      default:
        phaseText = "Processing...";
        phaseProgress = 25;
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
