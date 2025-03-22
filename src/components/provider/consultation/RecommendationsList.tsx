
import React from "react";
import { ListChecks } from "lucide-react";

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-2">
        <ListChecks className="h-4 w-4 text-green-500" />
        Recommendations
      </h3>
      <ul className="text-sm space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
              {index + 1}
            </div>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationsList;
