import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Send, StopCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface AIHistoryStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const AIHistoryStep: React.FC<AIHistoryStepProps> = ({ formData, updateFormData }) => {
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [conditions, setConditions] = useState<string[]>(formData.medicalHistory?.conditions || []);
  const [allergies, setAllergies] = useState<string[]>(formData.medicalHistory?.allergies || []);
  const [medications, setMedications] = useState<string[]>(formData.medicalHistory?.medications || []);
  const [pastTreatments, setPastTreatments] = useState<string[]>(formData.medicalHistory?.pastTreatments || []);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          
          setUserInput(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}`,
            variant: "destructive",
          });
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserInput("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const processUserInput = () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const inputLower = userInput.toLowerCase();
      
      const newConditions = extractMedicalInfo(inputLower, ["diabetes", "asthma", "hypertension", "arthritis"]);
      const newAllergies = extractMedicalInfo(inputLower, ["peanut", "penicillin", "lactose", "gluten"]);
      const newMedications = extractMedicalInfo(inputLower, ["aspirin", "insulin", "ibuprofen", "metformin"]);
      const newTreatments = extractMedicalInfo(inputLower, ["surgery", "therapy", "transplant", "radiation"]);
      
      setConditions(prev => [...new Set([...prev, ...newConditions])]);
      setAllergies(prev => [...new Set([...prev, ...newAllergies])]);
      setMedications(prev => [...new Set([...prev, ...newMedications])]);
      setPastTreatments(prev => [...new Set([...prev, ...newTreatments])]);
      
      setUserInput("");
      setIsProcessing(false);
      
      updateFormData({
        conditions: [...new Set([...conditions, ...newConditions])],
        allergies: [...new Set([...allergies, ...newAllergies])],
        medications: [...new Set([...medications, ...newMedications])],
        pastTreatments: [...new Set([...pastTreatments, ...newTreatments])],
      });
      
      toast({
        title: "Medical Information Updated",
        description: "Your medical history has been updated based on your input.",
      });
    }, 1000);
  };
  
  const extractMedicalInfo = (text: string, keywords: string[]): string[] => {
    return keywords.filter(keyword => text.includes(keyword));
  };
  
  useEffect(() => {
    updateFormData({
      conditions,
      allergies,
      medications,
      pastTreatments,
    });
  }, [conditions, allergies, medications, pastTreatments, updateFormData]);
  
  const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    const newList = list.filter(i => i !== item);
    setList(newList);
  };
  
  const renderList = (title: string, items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">None reported</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <div key={index} className="bg-primary/10 px-3 py-1 rounded-full flex items-center">
                <span className="text-sm">{item}</span>
                <button 
                  type="button"
                  className="ml-2 text-primary hover:text-primary/70"
                  onClick={() => removeItem(items, setItems, item)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Your Medical History</h3>
        <p className="text-muted-foreground mt-2">
          Describe your medical history in your own words or use voice input
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe any medical conditions, allergies, medications, or past treatments..."
            className="min-h-[120px] pr-10"
          />
          <div className="absolute right-3 bottom-3 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={isRecording ? "text-red-500" : "text-primary"}
              onClick={toggleRecording}
            >
              {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-primary"
              onClick={processUserInput}
              disabled={!userInput.trim() || isProcessing}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Examples:</p>
          <ul className="list-disc list-inside">
            <li>"I have asthma and allergies to peanuts"</li>
            <li>"I take insulin for diabetes"</li>
            <li>"I had knee surgery last year"</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Your Medical Profile</h3>
        
        {renderList("Medical Conditions", conditions, setConditions)}
        {renderList("Allergies", allergies, setAllergies)}
        {renderList("Medications", medications, setMedications)}
        {renderList("Past Treatments", pastTreatments, setPastTreatments)}
        
        <div className="text-sm text-muted-foreground mt-4">
          <p>You can always edit or update this information later from your profile.</p>
        </div>
      </div>
    </div>
  );
};

export default AIHistoryStep;
