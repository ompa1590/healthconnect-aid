
import React from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SignupCompleteProps {
  formData: ProviderFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleComplete = async () => {
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
        // Success - complete the signup process
        toast({
          title: "Account created",
          description: "Your provider account has been successfully created!",
        });
        onComplete();
        navigate('/provider/dashboard');
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
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
          <li>Our team will review your registration information</li>
          <li>We'll verify your professional credentials</li>
          <li>Once verified, you'll receive access to the provider dashboard</li>
          <li>You can start offering virtual care services to patients</li>
        </ol>
      </div>
      
      <Button onClick={handleComplete} className="w-full mt-6">
        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SignupComplete;
