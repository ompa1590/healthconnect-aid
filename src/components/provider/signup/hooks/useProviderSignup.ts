
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

type RegistrationPhase = 
  | 'initial' 
  | 'creating_auth' 
  | 'creating_profile' 
  | 'uploading_documents'
  | 'complete';

export const useProviderSignup = (formData: ProviderFormData, onComplete: () => void) => {
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

  return {
    agreedToTerms,
    setAgreedToTerms,
    submitting,
    showSuccessDialog,
    setShowSuccessDialog,
    connectionStatus,
    detailedError,
    retryAttempt,
    registrationPhase,
    uploadProgress,
    maxRetries,
    handleRetry,
    handleCreateAccount,
    handleSuccessDialogClose
  };
};
