
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface TranscriptMessage {
  role: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
}

function Transcriber({ conversation }: { conversation: TranscriptMessage[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  if (!conversation || conversation.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground">No transcript available for this consultation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-full rounded-lg overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <AvatarPrimitive.Root className="w-8 h-8 rounded-full">
                <AvatarPrimitive.Fallback className="bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  DR
                </AvatarPrimitive.Fallback>
              </AvatarPrimitive.Root>
            )}
            <div 
              className={`px-4 py-3 rounded-lg max-w-[85%] ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm break-words">{message.text}</p>
              <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
            </div>
            {message.role === 'user' && (
              <AvatarPrimitive.Root className="w-8 h-8 rounded-full">
                <AvatarPrimitive.Fallback className="bg-secondary/10 text-secondary flex items-center justify-center text-xs font-medium">
                  PT
                </AvatarPrimitive.Fallback>
              </AvatarPrimitive.Root>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transcriber;
