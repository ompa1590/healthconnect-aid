
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CancelAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  patientName: string;
  onConfirmCancel: (reason: string, details?: string) => void;
}

const cancelReasons = [
  { id: "emergency", label: "Emergency" },
  { id: "no_symptoms", label: "No More Symptoms" },
  { id: "no_reason", label: "No Reason" },
  { id: "prefers_other", label: "Prefers Another Option" },
  { id: "other", label: "Other (Please Specify)" },
];

const CancelAppointmentDialog: React.FC<CancelAppointmentDialogProps> = ({
  isOpen,
  onClose,
  appointmentId,
  patientName,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState<string>("");
  const [otherDetails, setOtherDetails] = useState<string>("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    const details = reason === "other" ? otherDetails : undefined;
    onConfirmCancel(reason, details);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setReason("");
    setOtherDetails("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cancel Appointment</DialogTitle>
          <DialogDescription>
            Please provide reason for cancelling this appointment and we will notify the patient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select your reason" />
            </SelectTrigger>
            <SelectContent>
              {cancelReasons.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {reason === "other" && (
            <Textarea
              placeholder="Please provide details..."
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              className="min-h-[100px]"
            />
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelAppointmentDialog;
