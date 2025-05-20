
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsDialog, PrivacyDialog } from "@/components/signup/LegalPopups";

interface TermsAgreementProps {
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreedToTerms,
  setAgreedToTerms,
}) => {
  return (
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
  );
};

export default TermsAgreement;
