
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Check if the file is either PDF or DOCX
      if (file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        newFiles.push(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Only PDF and DOCX files are allowed",
          variant: "destructive",
        });
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    
    // Store file names in form data
    const fileNames = newFiles.map(file => file.name);
    updateFormData({ 
      documents: [...(formData.documents || []), ...fileNames],
      documentFiles: [...(formData.documentFiles || []), ...newFiles]
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newDocuments = [...(formData.documents || [])];
    newDocuments.splice(index, 1);
    
    const newDocumentFiles = [...(formData.documentFiles || [])];
    newDocumentFiles.splice(index, 1);
    
    updateFormData({ 
      documents: newDocuments,
      documentFiles: newDocumentFiles
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.docx')) return 'docx';
    return 'file';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Upload Medical Documents</h3>
        <p className="text-muted-foreground mt-2">
          Securely upload any relevant medical reports or documents in PDF or DOCX format
        </p>
      </div>

      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop files here, or <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Supported formats: PDF, DOCX
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Uploaded Documents ({files.length})</h4>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/30 rounded-md p-2">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <File className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm truncate max-w-[200px]">{file.name}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground/70 mt-2">
        <p>These documents will be securely stored and can be accessed from your dashboard after registration.</p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
