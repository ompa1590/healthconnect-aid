
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, File, X, FileText, CheckCircle, Loader2, Pen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ProviderFormData } from "@/pages/login/ProviderSignup";

interface DocumentUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState<{[key: string]: boolean}>({});
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"upload" | "draw">("upload");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);
  
  const { toast } = useToast();

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for your profile picture",
        variant: "destructive",
      });
      return;
    }

    updateFormData({ profilePicture: file });
  };

  const handleCertificateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file for your certificate",
        variant: "destructive",
      });
      return;
    }

    const fileId = `cert-${Date.now()}`;
    setParsing(prev => ({ ...prev, [fileId]: true }));
    
    try {
      const summary = await parsePdfContent(file);
      setSummaries(prev => ({ ...prev, [fileId]: summary }));
      
      // Add summary to form data
      updateFormData({ 
        certificateFile: file,
        certificateSummary: summary,
        certificateVerified: false
      });
      
      toast({
        title: "Certificate analyzed",
        description: "We've extracted key information from your certificate",
      });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      toast({
        title: "Could not analyze certificate",
        description: "We were unable to extract information from this PDF",
        variant: "destructive",
      });
      updateFormData({ certificateFile: file });
    } finally {
      setParsing(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for your signature",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateFormData({ signatureImage: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVerificationChange = (isVerified: boolean) => {
    updateFormData({
      certificateVerified: isVerified
    });
  };

  const updateSummary = (newSummary: string) => {
    updateFormData({
      certificateSummary: newSummary
    });
  };

  // Function to parse PDF content (will be implemented with a PDF parsing library)
  const parsePdfContent = async (file: File): Promise<string> => {
    // This is a simulated PDF parsing function
    // In a real implementation, you would use a library like pdf.js or make a server request
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // For demo purposes, return a mock certificate summary
        if (file.name.toLowerCase().includes('certif')) {
          resolve("Certificate Analysis:\n• Document Type: Professional Medical Certificate\n• Issuing Authority: Canadian Medical Association\n• License Type: Full Practice\n• Status: Active\n• Specialization: Internal Medicine\n• Date of Issue: 2022-05-15\n• Expiration Date: 2025-05-14");
        } else {
          resolve("Professional Document Summary:\n• Document appears to be a professional credential\n• Please verify all information for accuracy\n• Contains registration details and qualifications");
        }
      }, 1500);
    });
  };

  // Drawing signature functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawingActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;
    
    setLastPoint({x, y});
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive || !lastPoint) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPoint({x, y});
  };

  const endDrawing = () => {
    setIsDrawingActive(false);
    setLastPoint(null);
    
    // Save the signature as data URL
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      updateFormData({ signatureImage: dataURL });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateFormData({ signatureImage: undefined });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Document Upload & Signature</h3>
        <p className="text-muted-foreground mt-2">
          Please upload your profile picture, professional certificate, and add your e-signature
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
            onClick={() => document.getElementById('profile-upload')?.click()}
          >
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            
            {formData.profilePicture ? (
              <div className="flex flex-col items-center">
                <img 
                  src={URL.createObjectURL(formData.profilePicture)} 
                  alt="Profile Preview" 
                  className="w-24 h-24 object-cover rounded-full mb-2"
                />
                <span className="text-xs text-muted-foreground">Click to change</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Upload a professional headshot
                </p>
              </>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Professional Certificate (PDF)</label>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
            onClick={() => document.getElementById('certificate-upload')?.click()}
          >
            <input
              id="certificate-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleCertificateChange}
            />
            
            {formData.certificateFile ? (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center mb-1">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {formData.certificateFile.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">Click to change</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Upload your professional certificate
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {formData.certificateFile && formData.certificateSummary && (
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm font-medium">Certificate Analysis</h5>
            {formData.certificateVerified ? (
              <span className="text-xs text-green-500 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </span>
            ) : (
              <span className="text-xs text-amber-500 flex items-center">
                Needs verification
              </span>
            )}
          </div>
          <Textarea
            className="min-h-[100px] text-sm mb-2"
            value={formData.certificateSummary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Certificate summary will appear here..."
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verify-certificate"
              checked={formData.certificateVerified}
              onChange={(e) => handleVerificationChange(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="verify-certificate" className="text-xs text-muted-foreground">
              I confirm this summary is accurate and matches my professional certificate
            </label>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">E-Signature</label>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-medium">Your Electronic Signature</h5>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={signatureMode === "upload" ? "bg-muted" : ""}
                onClick={() => setSignatureMode("upload")}
              >
                Upload
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={signatureMode === "draw" ? "bg-muted" : ""}
                onClick={() => setSignatureMode("draw")}
              >
                Draw
              </Button>
            </div>
          </div>
          
          {signatureMode === "upload" ? (
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative"
              onClick={() => document.getElementById('signature-upload')?.click()}
            >
              <input
                id="signature-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSignatureUpload}
              />
              
              {formData.signatureImage && signatureMode === "upload" ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={formData.signatureImage} 
                    alt="Signature" 
                    className="max-h-24 mb-2"
                  />
                  <span className="text-xs text-muted-foreground">Click to change</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Upload an image of your signature
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="border-2 border-muted-foreground/25 rounded-lg bg-white">
              <div className="flex justify-between items-center p-2 bg-muted/20 border-b">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Pen className="h-3 w-3 mr-1" /> Draw your signature below
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSignature}
                >
                  Clear
                </Button>
              </div>
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full h-[150px] touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              ></canvas>
              {formData.signatureImage && signatureMode === "draw" && (
                <div className="p-2 text-center">
                  <span className="text-xs text-green-500 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Signature saved
                  </span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground/70 mt-2">
            Your e-signature will be securely stored and used for signing medical documents
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-2">
        <p>All uploaded documents will be securely stored and will require verification before your provider account is activated.</p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
