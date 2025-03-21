
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pen, X } from "lucide-react";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import SignatureCanvas from "react-signature-canvas";

interface SignatureUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const SignatureUploadStep: React.FC<SignatureUploadStepProps> = ({ formData, updateFormData }) => {
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    formData.signatureFile ? URL.createObjectURL(formData.signatureFile) : null
  );

  const handleSaveSignature = () => {
    if (signatureRef && !signatureRef.isEmpty()) {
      // Get the signature as a PNG data URL
      const dataURL = signatureRef.toDataURL('image/png');
      
      // Convert data URL to a File object
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "provider-signature.png", { type: "image/png" });
      
      // Update form data
      updateFormData({ signatureFile: file });
      
      // Set preview
      setSignaturePreview(dataURL);
    }
  };

  const handleClearSignature = () => {
    if (signatureRef) {
      signatureRef.clear();
      setSignaturePreview(null);
      updateFormData({ signatureFile: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">E-Signature</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide your electronic signature for medical records and prescriptions
        </p>

        {signaturePreview ? (
          <div className="border rounded-md p-4 bg-white relative">
            <img 
              src={signaturePreview} 
              alt="Your signature" 
              className="max-h-48 mx-auto"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleClearSignature}
            >
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-4 bg-white">
              <SignatureCanvas
                ref={(ref) => setSignatureRef(ref)}
                canvasProps={{
                  className: 'w-full h-48',
                }}
                backgroundColor="white"
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={handleClearSignature}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
              
              <Button
                onClick={handleSaveSignature}
              >
                <Pen className="h-4 w-4 mr-1" /> Save Signature
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          This signature will be used for digital prescriptions and official documents
        </p>
      </div>
    </div>
  );
};

export default SignatureUploadStep;
