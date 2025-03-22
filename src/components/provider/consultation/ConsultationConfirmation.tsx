
import React from "react";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";

interface ConsultationConfirmationProps {
  legalText: string;
  isAcknowledged: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
  onConfirm: () => void;
  isSaving: boolean;
}

const ConsultationConfirmation: React.FC<ConsultationConfirmationProps> = ({
  legalText,
  isAcknowledged,
  onAcknowledgeChange,
  onConfirm,
  isSaving,
}) => {
  return (
    <div className="border-t pt-4 mt-6">
      <div className="flex items-start gap-2 mb-4">
        <div className="h-5 w-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="h-3 w-3" />
        </div>
        <p className="text-sm text-muted-foreground">
          Please review these AI-generated consultation notes. You can edit them if needed by clicking the "Edit Notes" button above. Your confirmation indicates that you have reviewed and verified the accuracy of these notes.
        </p>
      </div>

      <div className="flex items-start gap-3 mb-4 border p-4 rounded-md bg-muted/20">
        <Checkbox
          id="acknowledge"
          checked={isAcknowledged}
          onCheckedChange={(checked) => {
            onAcknowledgeChange(checked === true);
          }}
          className="mt-1"
        />
        <label htmlFor="acknowledge" className="text-sm cursor-pointer">
          {legalText}
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button
          onClick={onConfirm}
          disabled={!isAcknowledged || isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirm & Finalize
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConsultationConfirmation;
