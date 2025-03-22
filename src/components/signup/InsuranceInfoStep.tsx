
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Upload, Info, DollarSign, FileText } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InsuranceInfoStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const InsuranceInfoStep: React.FC<InsuranceInfoStepProps> = ({ formData, updateFormData }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    formData.insuranceCardFiles || []
  );
  
  const [hasInsurance, setHasInsurance] = useState<string>(
    formData.hasPrivateInsurance === false 
      ? "no" 
      : formData.hasPrivateInsurance === true 
        ? "yes" 
        : ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      updateFormData({ 
        insuranceCardFiles: updatedFiles,
        insuranceCards: updatedFiles.map(file => file.name)
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    updateFormData({ 
      insuranceCardFiles: updatedFiles,
      insuranceCards: updatedFiles.map(file => file.name)
    });
  };
  
  const handleInsuranceOptionChange = (value: string) => {
    setHasInsurance(value);
    updateFormData({ 
      hasPrivateInsurance: value === "yes",
      // Reset insurance fields if user selects "no"
      ...(value === "no" ? {
        insuranceProvider: "",
        insurancePolicyNumber: "",
        insuranceCoverageDetails: "",
        insuranceCardFiles: [],
        insuranceCards: []
      } : {})
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 mb-6">
        <div className="flex items-start mb-2">
          <Shield className="text-primary h-5 w-5 mr-2 mt-1" />
          <h3 className="text-lg font-medium">Private Insurance Information</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Adding your private insurance details allows us to streamline the billing process 
          and accurately determine your coverage for services. This information helps minimize 
          out-of-pocket expenses when applicable.
        </p>
      </div>
      
      <div className="space-y-4">
        <Label>Do you have private health insurance?</Label>
        <RadioGroup 
          value={hasInsurance} 
          onValueChange={handleInsuranceOptionChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="insurance-yes" />
            <Label htmlFor="insurance-yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="insurance-no" />
            <Label htmlFor="insurance-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      {hasInsurance === "yes" && (
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
            <Input
              id="insuranceProvider"
              type="text"
              placeholder="e.g., Manulife, Sun Life, etc."
              value={formData.insuranceProvider || ""}
              onChange={(e) => updateFormData({ insuranceProvider: e.target.value })}
              required={hasInsurance === "yes"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insurancePolicyNumber">Policy/Group Number *</Label>
            <Input
              id="insurancePolicyNumber"
              type="text"
              placeholder="Enter your policy or group number"
              value={formData.insurancePolicyNumber || ""}
              onChange={(e) => updateFormData({ insurancePolicyNumber: e.target.value })}
              required={hasInsurance === "yes"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="insuranceCoverageDetails">Coverage Details</Label>
            <Textarea
              id="insuranceCoverageDetails"
              placeholder="Details about co-pays, deductibles, pre-authorization requirements, etc."
              value={formData.insuranceCoverageDetails || ""}
              onChange={(e) => updateFormData({ insuranceCoverageDetails: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload Insurance Card (Front and Back) *</Label>
            <div className="border border-dashed border-input rounded-md p-6 text-center">
              <Input
                type="file"
                id="insuranceCardUpload"
                className="hidden"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileChange}
              />
              <Label 
                htmlFor="insuranceCardUpload" 
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium mb-1">Click to upload</span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG or PDF (max 10MB)
                </span>
              </Label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Uploaded Files:</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-muted/30 rounded-md p-2 text-sm"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => handleRemoveFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Please review your plan for co-pays, deductibles, and any pre-authorization requirements. 
                This information helps optimize your coverage and minimize out-of-pocket expenses.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hasInsurance === "no" && (
        <div className={cn(
          "border rounded-lg p-4 mt-4",
          "bg-gradient-to-br from-muted/50 to-muted/30"
        )}>
          <h4 className="font-medium flex items-center mb-2">
            <DollarSign className="h-4 w-4 mr-1.5 text-primary" />
            Self-Pay and Financial Assistance Options
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Without private insurance, you have several options to manage healthcare costs:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Self-pay plans with transparent pricing and payment options</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Financial assistance programs for eligible patients</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Payment plans to distribute costs over time</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Our patient support team can help you explore these options further during your consultation.
          </p>
        </div>
      )}
      
      <div className="mt-6 flex items-center justify-center">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm">Your information is encrypted and secure</span>
      </div>
    </div>
  );
};

export default InsuranceInfoStep;
