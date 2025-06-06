import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

interface Message {
  role: string;
  text: string;
  timestamp?: string;
  isFinal?: boolean;
}

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [callCompleted, setCallCompleted] = useState(false);
  const [prescreeningStatus, setPrescreeningStatus] = useState<'pending' | 'successful' | 'failed'>('pending');
  const vapiRef = useRef<any>(null);

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;

      vapiInstance.on('call-start', () => {
        setIsSessionActive(true);
        setCallCompleted(false);
        setPrescreeningStatus('pending');
      });

      vapiInstance.on('call-end', () => {
        setIsSessionActive(false);
        setCallCompleted(true);
        setConversation([]); // Reset conversation on call end
        // Check prescreening status after call ends
        checkPrescreeningStatus();
      });

      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });

      vapiInstance.on('error', (e: Error) => {
        console.error('Vapi error:', e);
      });
    }
  }, []);

  const checkPrescreeningStatus = async () => {
    try {
      // Implementation to check appointment prescreening status
      // This will be called after call ends to update UI
      // You can fetch the call analysis from Vapi API here
      // and determine if the prescreening was successful or failed
      console.log('Checking prescreening status...');
      
      // Placeholder logic - replace with actual API call to check status
      // setPrescreeningStatus('successful'); // or 'failed' based on analysis
    } catch (error) {
      console.error('Error checking prescreening status:', error);
      setPrescreeningStatus('failed');
    }
  };

  useEffect(() => {
    initializeVapi();

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        await vapiRef.current.start(assistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };

  return { 
    volumeLevel, 
    isSessionActive, 
    conversation, 
    toggleCall,
    callCompleted,
    prescreeningStatus
  };
};

export default useVapi;
