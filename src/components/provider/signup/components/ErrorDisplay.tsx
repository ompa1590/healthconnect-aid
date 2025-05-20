
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  detailedError: string | null;
  retryAttempt: number;
  maxRetries: number;
  handleRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  detailedError,
  retryAttempt,
  maxRetries,
  handleRetry,
}) => {
  if (!detailedError) return null;
  
  return (
    <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
      <details>
        <summary className="font-medium cursor-pointer">Technical error details</summary>
        <pre className="mt-2 text-xs whitespace-pre-wrap">{detailedError}</pre>
      </details>
      {retryAttempt >= maxRetries && (
        <div className="mt-3 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="text-xs flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Reset and try again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
