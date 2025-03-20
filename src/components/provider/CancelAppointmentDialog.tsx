
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
import { AlertCircle } from "lucide-react";

interface CancelAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  patientName: string;
  onConfirmCancel: (reason: string, details?: string) => void;
}

const cancelReasons = [
  { id: "emergency", label: "Provider Emergency" },
  { id: "schedule_conflict", label: "Schedule Conflict" },
  { id: "illness", label: "Provider Illness" },
  { id: "patient_request", label: "Patient Requested Cancellation" },
  { id: "reschedule", label: "Need to Reschedule" },
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

    if (reason === "other" && !otherDetails.trim()) {
      toast({
        title: "Error",
        description: "Please provide details for the cancellation reason",
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-poppins">Cancel Appointment</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling the appointment with <span className="font-medium">{patientName}</span>. 
            The patient will be notified of this cancellation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cancellation Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
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
          </div>

          {reason === "other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Details</label>
              <Textarea
                placeholder="Please provide details for the cancellation..."
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2 text-sm">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800">
              Cancelling appointments may affect patient satisfaction. Consider offering
              alternative appointment times when possible.
            </p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button onClick={handleConfirm} variant="destructive">
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelAppointmentDialog;
