
import React from "react";
import { CalendarClock } from "lucide-react";

interface FollowUpInstructionsProps {
  followUp: string;
}

const FollowUpInstructions: React.FC<FollowUpInstructionsProps> = ({
  followUp,
}) => {
  return (
    <div className="border rounded-md p-4 bg-muted/30">
      <h3 className="font-medium flex items-center gap-2 mb-2">
        <CalendarClock className="h-4 w-4 text-primary" />
        Follow-up Instructions
      </h3>
      <p className="text-sm">{followUp}</p>
    </div>
  );
};

export default FollowUpInstructions;
