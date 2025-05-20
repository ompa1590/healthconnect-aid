
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Maximum file size limit in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ProfilePictureUploadProps {
  profilePicture?: File;
  updateProfilePicture: (file?: File) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  updateProfilePicture,
}) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const { toast } = useToast();
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
    
    // Store the file reference
    updateProfilePicture(file);
    
    toast({
      title: "Profile picture added",
      description: "Your profile picture has been added successfully.",
    });
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  return (
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
                updateProfilePicture(undefined);
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
  );
};

export default ProfilePictureUpload;
