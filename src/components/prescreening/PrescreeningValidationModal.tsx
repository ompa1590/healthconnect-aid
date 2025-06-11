
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface PrescreeningValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
  onRetry: () => void;
  maxAttempts?: number;
  currentAttempts?: number;
}

interface PrescreeningStatus {
  status: 'loading' | 'successful' | 'failed' | 'emergency_declared';
  message: string;
  reason?: string;
  patientId: string;
  timestamp?: string;
}

const PrescreeningValidationModal: React.FC<PrescreeningValidationModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onRetry,
  maxAttempts = 3,
  currentAttempts = 0
}) => {
  const [prescreeningStatus, setPrescreeningStatus] = useState<PrescreeningStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPrescreeningStatus = async () => {
    if (!patientId) return;

    try {
      const response = await fetch(`/api/vapi/prescreening-status/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to check prescreening status');
      }

      const data = await response.json();
      setPrescreeningStatus(data);
      
      // Stop polling if we have a final status
      if (data.status !== 'loading') {
        setIsPolling(false);
      }
    } catch (err) {
      console.error('Error checking prescreening status:', err);
      setError('Unable to check prescreening status. Please try again.');
      setIsPolling(false);
    }
  };

  // Start polling when modal opens and we have a patient ID
  useEffect(() => {
    if (isOpen && patientId && !prescreeningStatus) {
      setIsPolling(true);
      setPrescreeningStatus(null);
      setError(null);
      checkPrescreeningStatus();
    }
  }, [isOpen, patientId]);

  // Polling effect
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      checkPrescreeningStatus();
    }, 5000); // Poll every 5 seconds

    // Stop polling after 3 minutes timeout
    const timeout = setTimeout(() => {
      setIsPolling(false);
      setError('Prescreening analysis is taking longer than expected. Please contact support.');
    }, 180000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPolling, patientId]);

  const handleRetry = () => {
    setPrescreeningStatus(null);
    setError(null);
    onRetry();
  };

  const handleClose = () => {
    setIsPolling(false);
    setPrescreeningStatus(null);
    setError(null);
    onClose();
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleClose} variant="outline">
            Close
          </Button>
        </div>
      );
    }

    if (!prescreeningStatus || prescreeningStatus.status === 'loading') {
      return (
        <div className="text-center p-6">
          <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Processing Your Prescreening
          </h3>
          <p className="text-blue-600">
            Please wait while we analyze your prescreening session...
          </p>
        </div>
      );
    }

    if (prescreeningStatus.status === 'successful') {
      return (
        <div className="text-center p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Prescreening Completed Successfully!
          </h3>
          <p className="text-green-600 mb-4">
            {prescreeningStatus.message}
          </p>
          <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
            Continue to Appointment
          </Button>
        </div>
      );
    }

    if (prescreeningStatus.status === 'emergency_declared') {
      return (
        <div className="text-center p-6">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Immediate Medical Attention Required
          </h3>
          <p className="text-orange-600 mb-4">
            {prescreeningStatus.message}
          </p>
          {prescreeningStatus.reason && (
            <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 text-left">
              <p className="text-sm text-orange-700">
                <strong>Details:</strong> {prescreeningStatus.reason}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-800">
              Please contact emergency services or visit your nearest emergency room.
            </p>
            <Button onClick={handleClose} variant="outline">
              I Understand
            </Button>
          </div>
        </div>
      );
    }

    if (prescreeningStatus.status === 'failed') {
      return (
        <div className="text-center p-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Prescreening Incomplete
          </h3>
          <p className="text-red-600 mb-4">
            {prescreeningStatus.message}
          </p>
          {prescreeningStatus.reason && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-left">
              <p className="text-sm text-red-700">
                <strong>Reason:</strong> {prescreeningStatus.reason}
              </p>
            </div>
          )}
          <div className="space-y-3">
            {currentAttempts < maxAttempts ? (
              <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
                Try Again ({currentAttempts + 1}/{maxAttempts})
              </Button>
            ) : (
              <div>
                <p className="text-sm text-red-600 mb-2">
                  Maximum attempts reached. Please contact support for assistance.
                </p>
                <Button onClick={handleClose} variant="outline">
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Prescreening Validation</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PrescreeningValidationModal;
