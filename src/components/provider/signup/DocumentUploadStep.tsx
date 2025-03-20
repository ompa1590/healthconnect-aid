
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { Camera, File, X } from "lucide-react";

interface DocumentUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateFormData({ profilePicture: file });
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateFormData({ certificateFile: file });
      setCertificateFileName(file.name);
    }
  };

  const removeProfilePicture = () => {
    updateFormData({ profilePicture: undefined });
    setProfilePreview(null);
  };

  const removeCertificate = () => {
    updateFormData({ certificateFile: undefined });
    setCertificateFileName(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents Upload</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your profile picture and professional certificate
        </p>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Profile Picture *</Label>
            
            {profilePreview ? (
              <div className="relative w-32 h-32 mx-auto">
                <img 
                  src={profilePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-32 h-32 bg-muted rounded-full mb-2">
                  <Camera className="h-10 w-10 text-muted-foreground" />
                </div>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
                <Label 
                  htmlFor="profile-picture" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                >
                  Select Photo
                </Label>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Upload a professional photo that clearly shows your face
            </p>
          </div>

          <div className="space-y-3">
            <Label>Professional Certificate *</Label>
            
            {certificateFileName ? (
              <div className="p-4 border rounded-md bg-muted/30 flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{certificateFileName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeCertificate}
                  className="text-destructive hover:text-destructive/90"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center border-2 border-dashed border-muted-foreground/20 rounded-md p-8">
                <File className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your certificate, or click to browse
                </p>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleCertificateChange}
                />
                <Label 
                  htmlFor="certificate" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                >
                  Upload Certificate
                </Label>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Upload your professional college certificate (PDF, JPG, or PNG format)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
