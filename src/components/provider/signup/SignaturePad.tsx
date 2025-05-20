
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  signatureImage?: string;
  updateSignatureImage: (dataUrl?: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureImage,
  updateSignatureImage,
}) => {
  const [signaturePad, setSignaturePad] = useState<SignatureCanvas | null>(null);
  const { toast } = useToast();

  // Handle signature pad
  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
      updateSignatureImage(undefined);
    }
  };

  const saveSignature = () => {
    if (signaturePad && !signaturePad.isEmpty()) {
      // Convert to PNG data URL with smaller size (more optimized)
      const dataURL = signaturePad.toDataURL('image/png', 0.5);
      updateSignatureImage(dataURL);
      
      toast({
        title: "Signature saved",
        description: "Your signature has been saved successfully.",
      });
    } else {
      toast({
        title: "Empty signature",
        description: "Please draw your signature before saving.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-t border-border/40 pt-6">
      <h3 className="text-lg font-medium mb-4">Digital Signature</h3>
      <div className="space-y-4">
        <div 
          className={cn(
            "border-2 p-4 rounded-lg",
            signaturePad && !signaturePad.isEmpty() ? "border-primary" : "border-dashed border-muted-foreground/30"
          )}
        >
          <SignatureCanvas
            ref={(ref) => setSignaturePad(ref)}
            canvasProps={{
              className: "w-full h-40 bg-white rounded",
            }}
            backgroundColor="white"
          />
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSignature}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={saveSignature}
            className="flex-1"
            disabled={!signaturePad || signaturePad.isEmpty()}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Signature
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Add your signature for prescriptions and medical documents. 
        Use your mouse or touchscreen to sign.
      </p>
    </div>
  );
};

export default SignaturePad;
