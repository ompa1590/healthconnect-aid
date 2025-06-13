"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/use-vapi";
import Transcriber from "@/components/ui/transcriber";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PreScreeningAssistantProps {
  autoStart?: boolean;
  onComplete?: () => void; // Add onComplete prop
}

const PreScreeningAssistant: React.FC<PreScreeningAssistantProps> = ({
  autoStart = false,
  onComplete,
}) => {
  const { volumeLevel, isSessionActive, toggleCall, conversation } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(0));
  const [isStarted, setIsStarted] = useState(autoStart);
  const { toast } = useToast();

  const formattedConversation = conversation.map((msg) => ({
    ...msg,
    timestamp: new Date().toLocaleTimeString(),
    isFinal: true,
  }));

  useEffect(() => {
    if (isSessionActive) {
      updateBars(volumeLevel);
    } else {
      resetBars();
    }
  }, [volumeLevel, isSessionActive]);

  // Handle auto-start
  useEffect(() => {
    if (autoStart && !isSessionActive && !isStarted) {
      console.log("Auto-starting prescreening session");
      setIsStarted(true);
      toggleCall();
    }
  }, [autoStart, isSessionActive, toggleCall]);

  const updateBars = (volume: number) => {
    setBars(bars.map(() => Math.random() * volume * 50));
  };

  const resetBars = () => {
    setBars(Array(50).fill(0));
  };

  const handleStart = () => {
    console.log("Starting prescreening session");
    setIsStarted(true);
    toggleCall();
  };

  const handleComplete = () => {
    console.log("Completing prescreening session");
    if (isSessionActive) {
      toggleCall(); // Stop the session if active
    }
    toast({
      title: "Pre-Screening Completed",
      description: "Your pre-screening information has been saved.",
    });
    if (onComplete) {
      onComplete(); // Trigger onComplete callback
    }
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <h2 className="text-2xl font-semibold">Pre-Screening Assistant</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Welcome to your pre-screening session. Our AI assistant will help gather
          important information before your appointment.
        </p>
        <Button size="lg" className="mt-4" onClick={handleStart}>
          Start Pre-Screening
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border text-center justify-items-center p-4 rounded-2xl">
        <div
          className="flex items-center justify-center h-full relative"
          style={{ width: "300px", height: "300px" }}
        >
          {isSessionActive ? (
            <MicOff
              size={24}
              className="text-black dark:text-white"
              onClick={toggleCall}
              style={{ cursor: "pointer", zIndex: 10 }}
            />
          ) : (
            <Mic
              size={28}
              className="text-black dark:text-white"
              onClick={toggleCall}
              style={{ cursor: "pointer", zIndex: 10 }}
            />
          )}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            style={{ position: "absolute", top: 0, left: 0 }}
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
                  className="stroke-current text-black dark:text-white dark:opacity-70 opacity-70"
                  strokeWidth="2"
                  initial={{ x2: x1, y2: y1 }}
                  animate={{ x2, y2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              );
            })}
          </svg>
          <span className="absolute top-48 w-[calc(100%-70%)] h-[calc(100%-70%)] bg-primary blur-[120px]"></span>
        </div>
      </div>

      <div className="h-[400px] mt-6">
        <Transcriber conversation={formattedConversation} />
      </div>

      {/* Add Complete Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleComplete}
          disabled={!isStarted || isSessionActive} // Disable if session is still active
        >
          Complete Pre-Screening
        </Button>
      </div>
    </div>
  );
};

export default PreScreeningAssistant;