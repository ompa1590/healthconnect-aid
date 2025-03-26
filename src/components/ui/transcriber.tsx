"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// ...Avatar components from your provided code...

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

  return (
    <div className="flex flex-col size-full max-w-full mx-auto bg-background rounded-lg shadow-lg overflow-hidden dark:bg-background">
      <div className="bg-secondary px-4 py-3 flex items-center justify-between dark:bg-secondary">
        <div className="font-medium text-foreground dark:text-foreground">Live Transcript</div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <AvatarPrimitive.Avatar className="w-8 h-8 shrink-0">
                <AvatarPrimitive.AvatarFallback>AI</AvatarPrimitive.AvatarFallback>
              </AvatarPrimitive.Avatar>
            )}
            <div className={`bg-${message.role === 'user' ? 'primary' : 'secondary'} px-4 py-1 rounded-lg max-w-[70%] ${message.role === 'user' ? 'text-background' : 'dark:text-foreground'}`}>
              <p>{message.text}</p>
              <div className="text-xs text-secondary">{message.timestamp}</div>
            </div>
            {message.role === 'user' && (
              <AvatarPrimitive.Avatar className="w-8 h-8 shrink-0">
                <AvatarPrimitive.AvatarFallback>You</AvatarPrimitive.AvatarFallback>
              </AvatarPrimitive.Avatar>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transcriber;
