
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProviderFormData } from "@/pages/login/ProviderSignup";
import { FileSignature, RefreshCw, Check } from "lucide-react";

interface SignatureUploadStepProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
}

const SignatureUploadStep: React.FC<SignatureUploadStepProps> = ({ formData, updateFormData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position for both mouse and touch events
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    
    // Prevent scrolling when drawing on canvas with touch
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position for both mouse and touch events
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    
    setHasSignature(true);
    
    // Prevent scrolling when drawing on canvas with touch
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    
    if (hasSignature) {
      saveSignature();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    updateFormData({ signatureFile: undefined });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "signature.png", { type: "image/png" });
        updateFormData({ signatureFile: file });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">E-Signature</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide your electronic signature by drawing in the box below
        </p>

        <div className="space-y-3">
          <Label htmlFor="signature">Signature *</Label>
          
          <div className="border-2 border-dashed rounded-md p-2 bg-white">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="w-full h-48 touch-none cursor-crosshair border border-muted"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Clear
            </Button>
            
            {hasSignature && (
              <div className="flex items-center text-sm text-emerald-600">
                <Check className="h-4 w-4 mr-1" /> Signature captured
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Draw your signature above. This will be used for official documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignatureUploadStep;
