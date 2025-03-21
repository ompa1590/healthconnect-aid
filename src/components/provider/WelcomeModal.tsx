
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Vyra Health!</DialogTitle>
          <DialogDescription>
            Thank you for joining our network of healthcare providers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p>
            Your account is currently pending verification. Once our team has reviewed your credentials, you'll be able to fully access the platform.
          </p>
          
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-medium text-sm mb-2">While you wait, you can:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Complete your profile information</li>
              <li>Set up your availability calendar</li>
              <li>Explore the dashboard features</li>
              <li>Review our practice guidelines</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            We'll notify you by email once your account has been verified.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
