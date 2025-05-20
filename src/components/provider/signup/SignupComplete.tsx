
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
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

// Extended error interface to handle Supabase errors better
interface EnhancedError extends Error {
  status?: number;
  code?: string;
  details?: string;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [detailedError, setDetailedError] = useState<string | null>(null);
  
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

  // Helper function to save provider profile with retries
  const saveProviderProfile = async (userId: string, retries = 3): Promise<{success: boolean, error?: any}> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting to save provider profile (attempt ${attempt}/${retries})...`);
        
        // Map form data to database schema
        const profileData = {
          id: userId,
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
        };
        
        // Log the data being saved (excluding sensitive info)
        console.log("Provider profile data structure:", Object.keys(profileData));
        
        const { error } = await supabase.from('provider_profiles').insert(profileData);
        
        if (error) {
          console.error(`Error saving provider profile (attempt ${attempt}/${retries}):`, error);
          
          // If this is the last attempt, propagate the error
          if (attempt === retries) {
            return { success: false, error };
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        console.log("Provider profile saved successfully!");
        return { success: true };
      } catch (err) {
        console.error(`Exception during profile save (attempt ${attempt}/${retries}):`, err);
        
        // If this is the last attempt, propagate the error
        if (attempt === retries) {
          return { success: false, error: err };
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return { success: false, error: new Error("Failed to save provider profile after multiple attempts") };
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
    
    // Create a signup session ID to track this attempt
    const signupSessionId = `provider-signup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Provider signup: Attempt with ID ${signupSessionId} starting...`);
    console.log(`Provider email: ${formData.email}`);
    
    try {
      // First verify the Supabase client is initialized
      console.log("Verifying Supabase client is initialized...");
      const { data: sessionCheck, error: sessionCheckError } = await supabase.auth.getSession();
      
      if (sessionCheckError) {
        throw new Error(`Session check failed: ${sessionCheckError.message}`);
      }
      
      console.log("Connection check successful:", sessionCheck ? "client ready" : "no active session");
      
      // Attempt to sign up the provider
      console.log(`Attempting to sign up provider (${signupSessionId}) with email:`, formData.email);
      
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
          }
        }
      });
      
      if (error) {
        console.error(`Error during sign up (${signupSessionId}):`, error);
        setDetailedError(`Authentication error: ${error.message}`);
        
        // Handle other signup errors
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        
        setSubmitting(false);
      } else {
        console.log(`Provider signup successful (${signupSessionId}):`, data);
        
        // Save provider profile data
        if (data.user) {
          try {
            const { success, error: profileError } = await saveProviderProfile(data.user.id);
            
            if (!success) {
              console.error("Error saving provider profile:", profileError);
              setDetailedError(`Auth success but profile save failed: ${profileError.message || JSON.stringify(profileError)}`);
              
              // Even if profile save fails, we'll still consider signup successful
              // as the auth record was created successfully
              toast({
                title: "Account created with warnings",
                description: "Your account was created but some profile details may be incomplete. You can update them later.",
                variant: "destructive"
              });
            }
          } catch (profileSaveError: any) {
            console.error("Exception during profile save:", profileSaveError);
            setDetailedError(`Profile save exception: ${profileSaveError.message || String(profileSaveError)}`);
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
      const enhancedError = error as EnhancedError;
      console.error("Unexpected error during sign up:", enhancedError);
      
      setDetailedError(`Unexpected error: ${enhancedError.message || String(enhancedError)}
        ${enhancedError.code ? `\nCode: ${enhancedError.code}` : ''}
        ${enhancedError.details ? `\nDetails: ${enhancedError.details}` : ''}
        ${enhancedError.status ? `\nStatus: ${enhancedError.status}` : ''}`);
      
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
        
        {detailedError && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
            <details>
              <summary className="font-medium cursor-pointer">Technical error details</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{detailedError}</pre>
            </details>
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
