// src/components/prescreening/PrescreeningStatus.tsx
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrescreeningStatusProps {
  status: 'pending' | 'successful' | 'failed';
  onRetry: () => void;
  attempts: number;
}

const PrescreeningStatus: React.FC<PrescreeningStatusProps> = ({ 
  status, 
  onRetry, 
  attempts 
}) => {
  if (status === 'successful') {
    return (
      <div className="text-center p-6 border rounded-lg bg-green-50">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">
          ✅ Prescreening Completed Successfully
        </h3>
        <p className="text-green-600 mt-2">
          Ready for your appointment - All information has been collected
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center p-6 border rounded-lg bg-red-50">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800">
          ❌ Prescreening Unsuccessful
        </h3>
        <p className="text-red-600 mt-2">
          Please try again to complete your medical history
        </p>
        {attempts < 3 && (
          <Button 
            onClick={onRetry}
            className="mt-4"
            variant="outline"
          >
            Try Again (Attempt {attempts + 1}/3)
          </Button>
        )}
        {attempts >= 3 && (
          <p className="text-sm text-red-500 mt-4">
            Maximum attempts reached. Please contact support.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center p-6 border rounded-lg bg-yellow-50">
      <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-yellow-800">
        Prescreening Pending
      </h3>
      <p className="text-yellow-600 mt-2">
        Please complete your prescreening session
      </p>
    </div>
  );
};

export default PrescreeningStatus;
