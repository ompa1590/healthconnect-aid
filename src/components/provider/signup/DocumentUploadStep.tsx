
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import SignaturePad from "react-signature-canvas";
import { cn } from "@/lib/utils";

interface DocumentUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

// Maximum file size limit in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const { toast } = useToast();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please choose a smaller file.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
    
    // Store the file reference in formData
    updateFormData({ profilePicture: file });
    
    toast({
      title: "Profile picture added",
      description: "Your profile picture has been added successfully.",
    });
  };

  // Handle certificate upload
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please choose a smaller file.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check file type - only PDF or image files allowed
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file.",
        variant: "destructive",
      });
      return;
    }
    
    // For image files, create a preview
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setCertificatePreview(previewUrl);
    } else {
      // For PDFs, show a generic thumbnail
      setCertificatePreview('pdf');
    }
    
    // Store the file reference in formData
    updateFormData({ certificateFile: file });
    
    toast({
      title: "Certificate uploaded",
      description: "Your certificate has been uploaded successfully.",
    });
  };

  // Handle signature pad
  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
      updateFormData({ signatureImage: undefined });
    }
  };

  const saveSignature = () => {
    if (signaturePad && !signaturePad.isEmpty()) {
      // Convert to PNG data URL with smaller size (more optimized)
      const dataURL = signaturePad.toDataURL('image/png', 0.5);
      updateFormData({ signatureImage: dataURL });
      
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

  // Clear previews when component unmounts
  React.useEffect(() => {
    return () => {
      if (profilePreview && profilePreview !== 'pdf') URL.revokeObjectURL(profilePreview);
      if (certificatePreview && certificatePreview !== 'pdf') URL.revokeObjectURL(certificatePreview);
    };
  }, [profilePreview, certificatePreview]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <div 
            className={cn(
              "h-24 w-24 rounded-full border-2 flex items-center justify-center overflow-hidden",
              profilePreview ? "border-primary" : "border-dashed border-muted-foreground/50"
            )}
          >
            {profilePreview ? (
              <img 
                src={profilePreview} 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground/70" />
            )}
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('profile-upload')?.click()}
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {profilePreview ? "Change Picture" : "Upload Picture"}
            </Button>
            {profilePreview && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (profilePreview) URL.revokeObjectURL(profilePreview);
                  setProfilePreview(null);
                  updateFormData({ profilePicture: undefined });
                }}
                className="w-full text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfilePictureChange}
            />
            <p className="text-xs text-muted-foreground">
              Upload a professional photo for your provider profile.
              <br />
              Maximum size: 5MB
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-6">
        <h3 className="text-lg font-medium mb-4">Professional Certificate</h3>
        <div className="space-y-4">
          <div 
            className={cn(
              "border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer",
              certificatePreview ? "border-primary bg-primary/5" : "border-dashed border-muted-foreground/30 hover:bg-muted/50 transition-colors"
            )}
            onClick={() => document.getElementById('certificate-upload')?.click()}
          >
            {certificatePreview ? (
              certificatePreview === 'pdf' ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-primary mb-2" />
                  <p className="text-sm font-medium">PDF Document Uploaded</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="max-h-40 overflow-hidden rounded mb-2">
                    <img 
                      src={certificatePreview} 
                      alt="Certificate" 
                      className="max-h-40 object-contain" 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                </div>
              )
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Certificate</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF or Image (max 5MB)
                </p>
              </>
            )}
          </div>
          <input 
            id="certificate-upload" 
            type="file" 
            accept=".pdf,image/*" 
            className="hidden" 
            onChange={handleCertificateUpload}
          />
          {certificatePreview && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive"
              onClick={() => {
                if (certificatePreview && certificatePreview !== 'pdf') {
                  URL.revokeObjectURL(certificatePreview);
                }
                setCertificatePreview(null);
                updateFormData({ certificateFile: undefined });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove Certificate
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Upload a copy of your professional certification or license. This will be verified by our team.
        </p>
      </div>

      <div className="border-t border-border/40 pt-6">
        <h3 className="text-lg font-medium mb-4">Digital Signature</h3>
        <div className="space-y-4">
          <div 
            className={cn(
              "border-2 p-4 rounded-lg",
              signaturePad && !signaturePad.isEmpty() ? "border-primary" : "border-dashed border-muted-foreground/30"
            )}
          >
            <SignaturePad
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

      <div className="text-xs text-muted-foreground/70 mt-4 p-3 bg-muted/20 rounded-md">
        <p>Note: All documents are securely stored and encrypted. Your professional information will be verified by our team before your account is activated.</p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
