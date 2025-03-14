
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Loader2 } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CaptchaComponent from "@/components/auth/CaptchaComponent";

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
  
  const handleCaptchaVerify = (token: string) => {
    console.log("Captcha verified with token:", token);
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
      
      if (!captchaVerified || !captchaToken) {
        toast({
          title: "Captcha Required",
          description: "Please complete the captcha verification before creating your account.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log("Starting signup with captcha token:", captchaToken);
      
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
      
      if (error) throw error;
      
      console.log("Signup successful:", data);
      
      if (!data.user) {
        throw new Error("Failed to create user account");
      }
      
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
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Altheo Health! You are now logged in.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during signup:", error);
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

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold">Ready to Create Your Account</h3>
      
      <p className="text-muted-foreground">
        Welcome to Altheo Health, {formData.name}! Your account details, medical information, and documents have been prepared for submission.
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
            <span>Create your account with a single click</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">3</span>
            <span>Log in to access your personal dashboard</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">4</span>
            <span>Book your first virtual consultation</span>
          </li>
        </ul>
      </div>
      
      <div className="border-t border-border/30 pt-6">
        <h4 className="font-medium mb-4">Security Verification</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Please complete the security check below to verify you're human.
        </p>
        
        <div className="flex justify-center mb-4">
          <CaptchaComponent 
            captchaId="signup-captcha" 
            onVerify={handleCaptchaVerify}
            callbackName="signupCaptchaCallback"
          />
        </div>
        
        {captchaVerified && (
          <p className="text-green-500 text-sm font-medium flex items-center justify-center mb-4">
            <CheckCircle className="h-4 w-4 mr-1" /> Verification complete
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Button 
          onClick={handleSignup} 
          disabled={loading || !captchaVerified}
          className={captchaVerified ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : captchaVerified ? "Create Account ✓" : "Create Account"}
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
