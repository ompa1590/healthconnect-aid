import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import useVapi from "@/hooks/use-vapi";
import Transcriber from "@/components/ui/transcriber";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TrialVoiceAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrialVoiceAssistant: React.FC<TrialVoiceAssistantProps> = ({
  open,
  onOpenChange,
}) => {
  const { volumeLevel, isSessionActive, toggleCall, conversation } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(0));
  const [hasStarted, setHasStarted] = useState(false);

  const formattedConversation = conversation.map((msg) => ({
    ...msg,
    timestamp: new Date().toLocaleTimeString(),
    isFinal: true,
  }));

  // Auto-start when dialog opens
  useEffect(() => {
    if (open && !hasStarted && !isSessionActive) {
      setHasStarted(true);
      toggleCall();
    }
  }, [open]);

  // Stop session when dialog closes
  useEffect(() => {
    if (!open && isSessionActive) {
      toggleCall();
    }
    if (!open) {
      setHasStarted(false);
    }
  }, [open]);

  useEffect(() => {
    if (isSessionActive) {
      setBars((prev) => prev.map(() => Math.random() * volumeLevel * 50));
    } else {
      setBars(Array(50).fill(0));
    }
  }, [volumeLevel, isSessionActive]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Experience Vyra AI
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Our intelligent health assistant — try it live
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visualizer */}
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center relative"
              style={{ width: "220px", height: "220px" }}
            >
              {isSessionActive ? (
                <MicOff
                  size={22}
                  className="text-foreground cursor-pointer z-10"
                  onClick={toggleCall}
                />
              ) : (
                <Mic
                  size={26}
                  className="text-foreground cursor-pointer z-10"
                  onClick={toggleCall}
                />
              )}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 300"
                className="absolute top-0 left-0"
              >
                {bars.map((height, index) => {
                  const angle = (index / bars.length) * 360;
                  const radians = (angle * Math.PI) / 180;
                  const x1 = 150 + Math.cos(radians) * 50;
                  const y1 = 150 + Math.sin(radians) * 50;
                  const x2 = 150 + Math.cos(radians) * (100 + height);
                  const y2 = 150 + Math.sin(radians) * (100 + height);

                  return (
                    <motion.line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="stroke-current text-primary opacity-70"
                      strokeWidth="2"
                      initial={{ x2: x1, y2: y1 }}
                      animate={{ x2, y2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  );
                })}
              </svg>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/30 blur-[60px] rounded-full"></span>
            </div>
          </div>

          {/* Transcript */}
          <div className="h-[250px] border rounded-lg overflow-hidden">
            <Transcriber conversation={formattedConversation} />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-6"
            >
              End Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrialVoiceAssistant;
