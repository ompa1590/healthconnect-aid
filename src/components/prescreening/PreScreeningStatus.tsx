
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrescreeningStatusProps {
  status: 'pending' | 'successful' | 'failed' | 'emergency_declared';
  onRetry: () => void;
  attempts: number;
  reason?: string;
}

const PrescreeningStatus: React.FC<PrescreeningStatusProps> = ({ 
  status, 
  onRetry, 
  attempts,
  reason 
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

  if (status === 'emergency_declared') {
    return (
      <div className="text-center p-6 border rounded-lg bg-orange-50">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-orange-800">
          ⚠️ Immediate Medical Attention Required
        </h3>
        <p className="text-orange-600 mt-2 mb-4">
          Your symptoms require immediate medical attention. This platform cannot treat your condition.
        </p>
        {reason && (
          <div className="bg-orange-100 border border-orange-200 rounded p-3 mb-4 text-left">
            <p className="text-sm text-orange-700">
              <strong>Details:</strong> {reason}
            </p>
          </div>
        )}
        <p className="text-sm font-medium text-orange-800">
          Please contact emergency services or visit your nearest emergency room.
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
        <p className="text-red-600 mt-2 mb-4">
          Please try again to complete your medical history
        </p>
        {reason && (
          <div className="bg-red-100 border border-red-200 rounded p-3 mb-4 text-left">
            <p className="text-sm text-red-700">
              <strong>Reason:</strong> {reason}
            </p>
          </div>
        )}
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
