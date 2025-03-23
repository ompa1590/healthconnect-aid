
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle } from "lucide-react";

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
  onVerify: () => void;
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({
  open,
  onOpenChange,
  summary,
  onVerify
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Summary
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis of your document content
          </DialogDescription>
        </DialogHeader>
        
        {summary ? (
          <>
            <div className="bg-muted/20 p-4 rounded-md whitespace-pre-line max-h-[400px] overflow-y-auto border text-sm">
              {summary}
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-amber-800 dark:text-amber-400 text-sm">
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <span>
                  This is an AI-generated summary. Please verify its accuracy against the original document before making medical decisions.
                </span>
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No summary available for this document.</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onVerify} className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            Verify Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
