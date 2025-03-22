
import React from "react";
import { AlertCircle, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConditionDetailsProps {
  condition: string;
  diagnosis: string;
}

const ConditionDetails: React.FC<ConditionDetailsProps> = ({
  condition,
  diagnosis,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          Presenting Condition
        </h3>
        <p className="text-sm leading-relaxed">{condition}</p>
      </div>

      <div>
        <h3 className="font-medium flex items-center gap-2 mb-1">
          <Stethoscope className="h-4 w-4 text-blue-500" />
          Diagnosis
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-normal">
            {diagnosis}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ConditionDetails;
