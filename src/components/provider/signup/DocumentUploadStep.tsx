
import React from "react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CertificateUpload from "./CertificateUpload";
import SignaturePad from "./SignaturePad";

interface DocumentUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <ProfilePictureUpload
        profilePicture={formData.profilePicture}
        updateProfilePicture={(file) => updateFormData({ profilePicture: file })}
      />

      <CertificateUpload
        certificateFile={formData.certificateFile}
        updateCertificateFile={(file) => updateFormData({ certificateFile: file })}
      />

      <SignaturePad
        signatureImage={formData.signatureImage}
        updateSignatureImage={(dataUrl) => updateFormData({ signatureImage: dataUrl })}
      />

      <div className="text-xs text-muted-foreground/70 mt-4 p-3 bg-muted/20 rounded-md">
        <p>Note: All documents are securely stored and encrypted. Your professional information will be verified by our team before your account is activated.</p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
