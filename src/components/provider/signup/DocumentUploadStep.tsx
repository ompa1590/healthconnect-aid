
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { Camera, File, X, Pen, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DocumentUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ formData, updateFormData }) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);
  const [signatureMethod, setSignatureMethod] = useState<"upload" | "draw">("upload");
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(formData.signatureImage || null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && signatureMethod === "draw") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        setCanvasContext(ctx);
      }
    }
  }, [signatureMethod]);

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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        const signatureData = reader.result as string;
        setSignature(signatureData);
        updateFormData({ signatureImage: signatureData });
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas || !canvasContext) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.clientY - rect.top;

    canvasContext.lineTo(x, y);
    canvasContext.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (!canvasContext) return;
    canvasContext.closePath();
    
    if (canvasRef.current) {
      const signatureData = canvasRef.current.toDataURL('image/png');
      setSignature(signatureData);
      updateFormData({ signatureImage: signatureData });
    }
  };

  const clearSignature = () => {
    if (canvasRef.current && canvasContext) {
      canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setSignature(null);
      updateFormData({ signatureImage: undefined });
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

  const removeSignature = () => {
    setSignature(null);
    updateFormData({ signatureImage: undefined });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents Upload</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your profile picture and professional certificate
        </p>

        <div className="space-y-6">
          {/* Profile Picture Section */}
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

          {/* Certificate Section */}
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

          {/* E-Signature Section */}
          <div className="space-y-3 border-t border-muted pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Pen className="h-5 w-5 text-primary" />
              <Label className="text-lg font-medium">E-Signature *</Label>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your signature will be used on reports and documentation
            </p>

            <div className="space-y-4">
              <RadioGroup 
                value={signatureMethod} 
                onValueChange={(value) => setSignatureMethod(value as "upload" | "draw")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload signature image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draw" id="draw" />
                  <Label htmlFor="draw">Draw signature</Label>
                </div>
              </RadioGroup>

              {signatureMethod === "upload" ? (
                <div>
                  {signature ? (
                    <div className="p-4 border rounded-md bg-muted/30">
                      <div className="relative">
                        <img 
                          src={signature} 
                          alt="Signature" 
                          className="max-h-[100px] mx-auto"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={removeSignature}
                          className="absolute -top-2 -right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center border-2 border-dashed border-muted-foreground/20 rounded-md p-6">
                      <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your signature image
                      </p>
                      <Input
                        id="signature-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSignatureUpload}
                      />
                      <Label 
                        htmlFor="signature-upload" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                      >
                        Select Signature
                      </Label>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border rounded-md p-2 bg-white">
                    {signature ? (
                      <div className="relative">
                        <img 
                          src={signature} 
                          alt="Drawn signature" 
                          className="max-h-[100px] mx-auto"
                        />
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={150}
                        className="border border-dashed border-muted-foreground/20 w-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                      />
                    )}
                  </div>
                  <div className="flex justify-center gap-2">
                    {signature && signatureMethod === "draw" && (
                      <Button 
                        variant="outline" 
                        onClick={clearSignature}
                        type="button"
                      >
                        Clear & Redraw
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Your e-signature will be securely stored and used for your professional documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
