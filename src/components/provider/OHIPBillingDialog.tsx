
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  DollarSign, 
  Save, 
  ClipboardCheck, 
  Ban,
  Edit, 
  Receipt 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OHIPBillingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    patient: string;
    patientId: string;
    reason: string;
    date: Date;
    time: string;
  };
}

const OHIPBillingDialog: React.FC<OHIPBillingDialogProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  // Mock OHIP billing data that would normally be AI-generated based on appointment details
  const mockBillingData = {
    serviceDate: appointment.date,
    patientName: appointment.patient,
    patientId: appointment.patientId,
    billingCodes: [
      {
        code: appointment.reason.includes("checkup") ? "K131" : 
              appointment.reason.includes("counseling") ? "K032" : 
              appointment.reason.includes("consultation") ? "K023" : "K013",
        description: appointment.reason,
        fee: appointment.reason.includes("checkup") ? 77.20 : 
             appointment.reason.includes("counseling") ? 62.75 : 
             appointment.reason.includes("consultation") ? 82.90 : 45.15,
        quantity: 1
      }
    ],
    diagnosisCodes: [
      {
        code: "300", // Mock ICD-9 code for general health examination
        description: "Anxiety states"
      }
    ],
    totalAmount: appointment.reason.includes("checkup") ? 77.20 : 
                appointment.reason.includes("counseling") ? 62.75 : 
                appointment.reason.includes("consultation") ? 82.90 : 45.15,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedForLater, setIsSavedForLater] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVoided, setIsVoided] = useState(false);
  
  const [billingData, setBillingData] = useState(mockBillingData);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setBillingData(mockBillingData);
  };
  
  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedCodes = [...billingData.billingCodes];
    updatedCodes[index] = {
      ...updatedCodes[index],
      [field]: field === 'fee' || field === 'quantity' ? Number(value) : value
    };
    
    // Recalculate total amount
    const newTotal = updatedCodes.reduce((sum, code) => sum + (code.fee * code.quantity), 0);
    
    setBillingData({
      ...billingData,
      billingCodes: updatedCodes,
      totalAmount: newTotal
    });
  };
  
  const handleDiagnosisChange = (index: number, field: string, value: string) => {
    const updatedCodes = [...billingData.diagnosisCodes];
    updatedCodes[index] = {
      ...updatedCodes[index],
      [field]: value
    };
    
    setBillingData({
      ...billingData,
      diagnosisCodes: updatedCodes
    });
  };
  
  const handleSaveForLater = async () => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Claim saved for later review");
      setIsSavedForLater(true);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving claim:", error);
      toast.error("Failed to save claim");
      setIsSaving(false);
    }
  };
  
  const handleSubmitClaim = async () => {
    if (!isAcknowledged) {
      toast.error("Please acknowledge the terms before submitting");
      return;
    }
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Claim submitted successfully");
      setIsSubmitted(true);
      setIsSaving(false);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error("Failed to submit claim");
      setIsSaving(false);
    }
  };
  
  const handleVoidClaim = async () => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Claim has been voided");
      setIsVoided(true);
      setIsSaving(false);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error voiding claim:", error);
      toast.error("Failed to void claim");
      setIsSaving(false);
    }
  };
  
  const legalText = "I acknowledge that I have reviewed this claim for accuracy and completeness. I certify that the services billed were rendered as described. I understand that submitting a false claim may result in penalties under the Ontario Health Insurance Act. I also acknowledge that while Vyra Health's AI assists in generating billing codes, I remain responsible for the accuracy of all submitted claims.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>OHIP Billing Claim</DialogTitle>
          </div>
          <DialogDescription className="text-base font-medium">
            AI-generated billing details for reimbursement
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-1 space-y-6">
            {isVoided ? (
              <div className="p-6 text-center">
                <Ban className="h-16 w-16 text-destructive mx-auto mb-4 opacity-70" />
                <h3 className="text-xl font-medium mb-2">Claim Voided</h3>
                <p className="text-muted-foreground">
                  This claim has been voided and will not be submitted for reimbursement.
                </p>
              </div>
            ) : isSubmitted ? (
              <div className="p-6 text-center">
                <ClipboardCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Claim Submitted Successfully</h3>
                <p className="text-muted-foreground">
                  Your claim has been submitted to OHIP for processing.
                </p>
              </div>
            ) : (
              <>
                {/* Patient Information Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient-name">Patient Name</Label>
                      <Input 
                        id="patient-name" 
                        value={billingData.patientName} 
                        readOnly 
                        className="bg-muted/50" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="patient-id">Patient ID</Label>
                      <Input 
                        id="patient-id" 
                        value={billingData.patientId} 
                        readOnly 
                        className="bg-muted/50" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-date">Service Date</Label>
                      <Input 
                        id="service-date" 
                        type="date" 
                        value={formatDate(billingData.serviceDate)} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""} 
                        onChange={(e) => setBillingData({
                          ...billingData, 
                          serviceDate: new Date(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Billing Codes Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Billing Codes</h3>
                    {!isEditing && !isSavedForLater && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1.5"
                        onClick={handleEdit}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Codes
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {billingData.billingCodes.map((code, index) => (
                      <div key={index} className="p-4 border rounded-md bg-muted/20">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label htmlFor={`code-${index}`}>Service Code</Label>
                            <Input 
                              id={`code-${index}`} 
                              value={code.code} 
                              readOnly={!isEditing} 
                              className={!isEditing ? "bg-muted/50" : ""}
                              onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                            <Input 
                              id={`quantity-${index}`} 
                              type="number" 
                              value={code.quantity} 
                              readOnly={!isEditing} 
                              className={!isEditing ? "bg-muted/50" : ""}
                              onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label htmlFor={`fee-${index}`}>Fee ($)</Label>
                            <Input 
                              id={`fee-${index}`} 
                              type="number" 
                              step="0.01" 
                              value={code.fee} 
                              readOnly={!isEditing} 
                              className={!isEditing ? "bg-muted/50" : ""}
                              onChange={(e) => handleInputChange(index, 'fee', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`amount-${index}`}>Amount</Label>
                            <Input 
                              id={`amount-${index}`} 
                              value={`$${(code.fee * code.quantity).toFixed(2)}`} 
                              readOnly 
                              className="bg-muted/50" 
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea 
                            id={`description-${index}`} 
                            value={code.description} 
                            readOnly={!isEditing} 
                            className={!isEditing ? "bg-muted/50" : ""}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Diagnosis Codes Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Diagnosis Codes (ICD-9)</h3>
                  <div className="space-y-4">
                    {billingData.diagnosisCodes.map((diagnosis, index) => (
                      <div key={index} className="p-4 border rounded-md bg-muted/20">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label htmlFor={`diagnosis-code-${index}`}>ICD-9 Code</Label>
                            <Input 
                              id={`diagnosis-code-${index}`} 
                              value={diagnosis.code} 
                              readOnly={!isEditing} 
                              className={!isEditing ? "bg-muted/50" : ""}
                              onChange={(e) => handleDiagnosisChange(index, 'code', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`diagnosis-description-${index}`}>Description</Label>
                          <Textarea 
                            id={`diagnosis-description-${index}`} 
                            value={diagnosis.description} 
                            readOnly={!isEditing} 
                            className={!isEditing ? "bg-muted/50" : ""}
                            onChange={(e) => handleDiagnosisChange(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Total Section */}
                <div className="p-4 border rounded-md bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Total Amount</h3>
                    <div className="text-xl font-semibold">
                      ${billingData.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                {!isSavedForLater && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={isAcknowledged}
                        onCheckedChange={(checked) => setIsAcknowledged(checked as boolean)}
                        disabled={isSaving}
                      />
                      <Label 
                        htmlFor="terms" 
                        className="text-sm leading-tight"
                      >
                        {legalText}
                      </Label>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        
        {/* Dialog Footer with Action Buttons */}
        {!isVoided && !isSubmitted && (
          <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0 pt-4">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleVoidClaim}
                  disabled={isSaving || isSavedForLater}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  <Ban className="mr-1.5 h-4 w-4" />
                  Void Claim
                </Button>
                
                {isSavedForLater ? (
                  <Button 
                    onClick={handleSubmitClaim}
                    disabled={isSaving || !isAcknowledged}
                  >
                    <ClipboardCheck className="mr-1.5 h-4 w-4" />
                    Submit Claim
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveForLater}
                      disabled={isSaving}
                    >
                      <Save className="mr-1.5 h-4 w-4" />
                      Save for Later
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitClaim}
                      disabled={isSaving || !isAcknowledged}
                    >
                      <DollarSign className="mr-1.5 h-4 w-4" />
                      Submit Claim
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OHIPBillingDialog;
