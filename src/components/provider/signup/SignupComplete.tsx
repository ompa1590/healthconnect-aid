
import React from "react";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useProviderSignup } from "./hooks/useProviderSignup";
import ConnectionStatus from "./components/ConnectionStatus";
import NextSteps from "./components/NextSteps";
import RegistrationProgress from "./components/RegistrationProgress";
import ErrorDisplay from "./components/ErrorDisplay";
import TermsAgreement from "./components/TermsAgreement";
import SuccessDialog from "./components/SuccessDialog";

interface SignupCompleteProps {
  formData: ProviderFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  const {
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
  } = useProviderSignup(formData, onComplete);

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
        
        <ConnectionStatus status={connectionStatus} />
        
        <NextSteps />
        
        {submitting && (
          <RegistrationProgress 
            registrationPhase={registrationPhase}
            retryAttempt={retryAttempt}
            maxRetries={maxRetries}
            uploadProgress={uploadProgress}
          />
        )}
        
        <ErrorDisplay 
          detailedError={detailedError}
          retryAttempt={retryAttempt}
          maxRetries={maxRetries}
          handleRetry={handleRetry}
        />
        
        <TermsAgreement 
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
        />
        
        <Button 
          onClick={handleCreateAccount} 
          className="w-full mt-6"
          disabled={!agreedToTerms || submitting || connectionStatus !== 'connected'}
        >
          {submitting ? `Creating Account...` : "Create Account"} 
          {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog}
        onClose={handleSuccessDialogClose}
      />
    </>
  );
};

export default SignupComplete;
