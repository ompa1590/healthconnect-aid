
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, providerName }) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome, Dr. {providerName}!</DialogTitle>
          <DialogDescription>
            Thank you for joining VyraHealth! Let's set up your provider profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Here's what you can do:</h4>
          <ul className="space-y-3">
            {[
              "Manage your appointments in the Dashboard",
              "View and connect with patients",
              "Update your schedule and availability",
              "Complete your provider profile"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
