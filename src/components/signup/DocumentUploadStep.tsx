
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, File, X, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState<{[key: string]: boolean}>({});
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Check if the file is PDF
      if (file.type === "application/pdf") {
        newFiles.push(file);
        
        // Start parsing this file
        const fileId = `${file.name}-${Date.now()}`;
        setParsing(prev => ({ ...prev, [fileId]: true }));
        
        try {
          const summary = await parsePdfContent(file);
          setSummaries(prev => ({ ...prev, [fileId]: summary }));
          
          // Add summary to form data
          updateFormData({ 
            documentSummaries: { ...(formData.documentSummaries || {}), [file.name]: summary },
            documentVerified: { ...(formData.documentVerified || {}), [file.name]: false }
          });
          
          toast({
            title: "Document summarized",
            description: "We've extracted key information from your document",
          });
        } catch (error) {
          console.error("Error parsing PDF:", error);
          toast({
            title: "Could not analyze document",
            description: "We were unable to extract information from this PDF",
            variant: "destructive",
          });
        } finally {
          setParsing(prev => ({ ...prev, [fileId]: false }));
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        newFiles.push(file);
        toast({
          title: "DOCX file detected",
          description: "DOCX files cannot be automatically summarized at this time",
        });
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
    const fileToRemove = files[index];
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newDocuments = [...(formData.documents || [])];
    newDocuments.splice(index, 1);
    
    const newDocumentFiles = [...(formData.documentFiles || [])];
    newDocumentFiles.splice(index, 1);
    
    // Remove summary if it exists
    if (formData.documentSummaries && formData.documentSummaries[fileToRemove.name]) {
      const newSummaries = { ...formData.documentSummaries };
      delete newSummaries[fileToRemove.name];
      
      const newVerified = { ...formData.documentVerified };
      delete newVerified[fileToRemove.name];
      
      updateFormData({ 
        documents: newDocuments,
        documentFiles: newDocumentFiles,
        documentSummaries: newSummaries,
        documentVerified: newVerified
      });
    } else {
      updateFormData({ 
        documents: newDocuments,
        documentFiles: newDocumentFiles
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.docx')) return 'docx';
    return 'file';
  };

  const updateSummary = (fileName: string, newSummary: string) => {
    updateFormData({
      documentSummaries: {
        ...(formData.documentSummaries || {}),
        [fileName]: newSummary
      }
    });
  };

  const handleVerificationChange = (fileName: string, isVerified: boolean) => {
    updateFormData({
      documentVerified: {
        ...(formData.documentVerified || {}),
        [fileName]: isVerified
      }
    });
  };

  // Function to parse PDF content (will be implemented with a PDF parsing library)
  const parsePdfContent = async (file: File): Promise<string> => {
    // This is a simulated PDF parsing function
    // In a real implementation, you would use a library like pdf.js or make a server request
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // For demo purposes, return a mock medical summary based on filename
        if (file.name.toLowerCase().includes('blood')) {
          resolve("Blood Test Results Summary:\n• Hemoglobin: 14.2 g/dL (Normal)\n• White Blood Cells: 7,500/µL (Normal)\n• Platelets: 250,000/µL (Normal)\n• Vitamin B12: 190 pg/mL (Low - deficiency detected)\n• Vitamin D: 22 ng/mL (Insufficient)\n• Cholesterol: 185 mg/dL (Normal)");
        } else if (file.name.toLowerCase().includes('cardio')) {
          resolve("Cardiovascular Assessment Summary:\n• Blood Pressure: 128/82 mmHg (Normal)\n• Heart Rate: 72 bpm (Normal)\n• ECG: Normal sinus rhythm\n• No significant abnormalities detected");
        } else {
          resolve("Medical Document Summary:\n• Document contains medical information\n• Please review for specific details\n• Consult with healthcare provider for interpretation");
        }
      }, 1500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Upload Medical Documents</h3>
        <p className="text-muted-foreground mt-2">
          Securely upload any relevant medical reports or documents in PDF format for automatic analysis
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
          Supported formats: PDF (recommended for automatic analysis), DOCX
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Uploaded Documents ({files.length})</h4>
          
          <div className="space-y-4">
            {files.map((file, index) => {
              const fileId = `${file.name}-${Date.now()}`;
              const fileType = getFileIcon(file.name);
              const hasSummary = formData.documentSummaries && formData.documentSummaries[file.name];
              const isVerified = formData.documentVerified && formData.documentVerified[file.name];
              
              return (
                <div key={index} className="bg-muted/30 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm truncate max-w-[200px] font-medium">{file.name}</div>
                      
                      {fileType === 'pdf' && (
                        parsing[fileId] ? (
                          <div className="flex items-center text-amber-500 text-xs">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Analyzing...
                          </div>
                        ) : hasSummary ? (
                          <div className="flex items-center text-green-500 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Analyzed
                          </div>
                        ) : (
                          <div className="flex items-center text-muted-foreground text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" /> Not analyzed
                          </div>
                        )
                      )}
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
                  
                  {fileType === 'pdf' && hasSummary && (
                    <div className="mt-2 space-y-3">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="text-xs font-medium">Document Analysis</h5>
                          {isVerified && (
                            <span className="text-xs text-green-500 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </span>
                          )}
                        </div>
                        <Textarea
                          className="min-h-[100px] text-xs mt-1"
                          value={formData.documentSummaries[file.name]}
                          onChange={(e) => updateSummary(file.name, e.target.value)}
                          placeholder="Document summary will appear here..."
                        />
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`verify-${index}`}
                            checked={isVerified}
                            onChange={(e) => handleVerificationChange(file.name, e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`verify-${index}`} className="text-xs text-muted-foreground">
                            I confirm this summary is accurate and matches the document content
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground/70 mt-2">
        <p>PDF files will be automatically analyzed to extract key information. The summary can be reviewed and edited for accuracy.</p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
