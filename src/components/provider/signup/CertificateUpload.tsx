
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Maximum file size limit in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface CertificateUploadProps {
  certificateFile?: File;
  updateCertificateFile: (file?: File) => void;
}

const CertificateUpload: React.FC<CertificateUploadProps> = ({
  certificateFile,
  updateCertificateFile,
}) => {
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const { toast } = useToast();

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
    
    // Store the file reference
    updateCertificateFile(file);
    
    toast({
      title: "Certificate uploaded",
      description: "Your certificate has been uploaded successfully.",
    });
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (certificatePreview && certificatePreview !== 'pdf') {
        URL.revokeObjectURL(certificatePreview);
      }
    };
  }, [certificatePreview]);

  return (
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
              updateCertificateFile(undefined);
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
  );
};

export default CertificateUpload;
