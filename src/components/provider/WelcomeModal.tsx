
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
          <DialogTitle>Welcome, Dr. {providerName}!</DialogTitle>
          <DialogDescription>
            Thank you for joining VyraHealth! Let's set up your provider profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-2">Here's what you can do:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Manage your appointments in the Dashboard</li>
            <li>View and connect with patients</li>
            <li>Update your schedule and availability</li>
            <li>Complete your provider profile</li>
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
