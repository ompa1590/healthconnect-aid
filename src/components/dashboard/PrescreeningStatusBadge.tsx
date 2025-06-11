
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Clock, Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PrescreeningStatusBadgeProps {
  patientId: string;
  appointmentId: string;
  onStartPrescreening?: () => void;
  onRetryPrescreening?: () => void;
}

type PrescreeningStatus = 'successful' | 'failed' | 'emergency_declared' | 'loading' | 'not_started';

const PrescreeningStatusBadge = ({ 
  patientId, 
  appointmentId, 
  onStartPrescreening, 
  onRetryPrescreening 
}: PrescreeningStatusBadgeProps) => {
  const [status, setStatus] = useState<PrescreeningStatus>('loading');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrescreeningStatus = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching prescreening status for patient ${patientId}, appointment ${appointmentId}`);
        
        const response = await fetch(`/api/vapi/prescreening-status/${patientId}?appointmentId=${appointmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prescreening status');
        }
        
        const data = await response.json();
        console.log('Prescreening status response:', data);
        
        setStatus(data.status || 'not_started');
        setMessage(data.message || '');
      } catch (error) {
        console.error('Error fetching prescreening status:', error);
        setStatus('not_started');
        setMessage('Prescreening not started');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId && appointmentId) {
      fetchPrescreeningStatus();
    }
  }, [patientId, appointmentId]);

  const getStatusConfig = (status: PrescreeningStatus) => {
    switch (status) {
      case 'successful':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Successful',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          showAction: false
        };
      case 'failed':
        return {
          icon: <XCircle className="h-3 w-3" />,
          label: 'Failed',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
          showAction: true,
          actionLabel: 'Retry',
          actionIcon: <RefreshCw className="h-3 w-3" />
        };
      case 'emergency_declared':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'Emergency Declared',
          variant: 'secondary' as const,
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          showAction: false
        };
      case 'loading':
        return {
          icon: <Clock className="h-3 w-3 animate-spin" />,
          label: 'Processing...',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          showAction: false
        };
      case 'not_started':
      default:
        return {
          icon: <Play className="h-3 w-3" />,
          label: 'Not Started',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          showAction: true,
          actionLabel: 'Start',
          actionIcon: <Play className="h-3 w-3" />
        };
    }
  };

  const config = getStatusConfig(status);

  const handleAction = () => {
    if (status === 'failed' && onRetryPrescreening) {
      onRetryPrescreening();
    } else if (status === 'not_started' && onStartPrescreening) {
      onStartPrescreening();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-3 w-3 animate-spin" />
        <span>Loading status...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Badge 
        variant={config.variant}
        className={cn("flex items-center gap-1 text-xs", config.className)}
      >
        {config.icon}
        <span>Prescreening: {config.label}</span>
      </Badge>
      
      {config.showAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAction}
          className="h-6 px-2 text-xs"
        >
          {config.actionIcon}
          <span className="ml-1">{config.actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default PrescreeningStatusBadge;
