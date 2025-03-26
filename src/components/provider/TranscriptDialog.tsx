
import React, { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useVapi from "@/hooks/use-vapi";
import Transcriber from "@/components/ui/transcriber";

interface TranscriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    id: string;
  };
}

const TranscriptDialog: React.FC<TranscriptDialogProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  // For demo purposes, we'll generate some mock conversation data
  // In a real implementation, this would be fetched from an API
  const mockConversation = [
    { 
      role: "assistant", 
      text: "Hello, I'm Dr. Chen. How are you feeling today?", 
      timestamp: "2:00 PM", 
      isFinal: true 
    },
    { 
      role: "user", 
      text: "Hi doctor, I've been having this persistent rash on my forearms for about two weeks now.", 
      timestamp: "2:01 PM", 
      isFinal: true 
    },
    { 
      role: "assistant", 
      text: "I see. Can you describe the rash? Is it itchy or painful?", 
      timestamp: "2:02 PM", 
      isFinal: true 
    },
    { 
      role: "user", 
      text: "It's itchy, especially at night. The area is red and has some small bumps.", 
      timestamp: "2:03 PM", 
      isFinal: true 
    },
    { 
      role: "assistant", 
      text: "Have you started using any new products recently? Like a new laundry detergent, soap, or lotion?", 
      timestamp: "2:04 PM", 
      isFinal: true 
    },
    { 
      role: "user", 
      text: "Actually yes, I switched to a new laundry detergent about three weeks ago.", 
      timestamp: "2:05 PM", 
      isFinal: true 
    },
    { 
      role: "assistant", 
      text: "That could be the culprit. It sounds like contact dermatitis, which is often triggered by allergens in products like detergents. I'll document this and prepare some treatment recommendations.", 
      timestamp: "2:06 PM", 
      isFinal: true 
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle>Consultation Transcript</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-base font-medium">
            Conversation with {patient.name} ({patient.id})
          </DialogDescription>
          <Badge variant="outline" className="mt-2 bg-primary/5 text-primary">
            Video consultation
          </Badge>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-y-auto mt-4 max-h-[calc(80vh-120px)]">
          <div className="p-1">
            <Transcriber conversation={mockConversation} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptDialog;
