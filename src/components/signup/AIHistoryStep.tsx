
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendHorizontal, Plus, Bot, Trash, BookOpen } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";

interface AIHistoryStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData["medicalHistory"]>) => void;
}

const AIHistoryStep: React.FC<AIHistoryStepProps> = ({ formData, updateFormData }) => {
  // Chat state
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<{type: 'user' | 'ai', content: string}[]>([
    {type: 'ai', content: 'Hi there! I\'m here to help collect your medical history. Would you like to tell me about any existing medical conditions, allergies, medications, or past treatments?'}
  ]);
  const [userInput, setUserInput] = useState('');
  
  // Form inputs for manual entry
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newTreatment, setNewTreatment] = useState('');

  // Process chat message to identify medical history
  const processAIResponse = (userMessage: string) => {
    // This would be replaced with actual AI processing logic
    // For demo purposes, we'll use simple keyword matching
    
    setTimeout(() => {
      const lowerMsg = userMessage.toLowerCase();
      let aiResponse = "Thank you for sharing that information. ";
      
      // Very simple keyword detection - would be much more sophisticated in a real AI system
      if (lowerMsg.includes('condition') || lowerMsg.includes('diagnosed') || lowerMsg.includes('suffer')) {
        aiResponse += "I've noted your conditions. Do you have any allergies or medications you're currently taking?";
        
        // Extract potential conditions (this is oversimplified)
        const potentialConditions = ["diabetes", "asthma", "hypertension", "arthritis", "anxiety", "depression"];
        const detectedConditions = potentialConditions.filter(condition => lowerMsg.includes(condition));
        
        if (detectedConditions.length > 0) {
          const newConditions = [...formData.medicalHistory.conditions, ...detectedConditions];
          updateFormData({ conditions: Array.from(new Set(newConditions)) });
        }
      } 
      else if (lowerMsg.includes('allerg')) {
        aiResponse += "I've recorded your allergies. Are you currently taking any medications?";
        
        // Extract potential allergies (oversimplified)
        const potentialAllergies = ["peanuts", "shellfish", "dairy", "gluten", "penicillin", "dust", "pollen"];
        const detectedAllergies = potentialAllergies.filter(allergy => lowerMsg.includes(allergy));
        
        if (detectedAllergies.length > 0) {
          const newAllergies = [...formData.medicalHistory.allergies, ...detectedAllergies];
          updateFormData({ allergies: Array.from(new Set(newAllergies)) });
        }
      }
      else if (lowerMsg.includes('medication') || lowerMsg.includes('taking') || lowerMsg.includes('prescribed')) {
        aiResponse += "Thanks for telling me about your medications. Have you had any significant medical treatments or surgeries in the past?";
        
        // Extract potential medications (oversimplified)
        const potentialMeds = ["lipitor", "metformin", "lisinopril", "prozac", "advil", "tylenol", "aspirin"];
        const detectedMeds = potentialMeds.filter(med => lowerMsg.includes(med));
        
        if (detectedMeds.length > 0) {
          const newMeds = [...formData.medicalHistory.medications, ...detectedMeds];
          updateFormData({ medications: Array.from(new Set(newMeds)) });
        }
      }
      else if (lowerMsg.includes('treatment') || lowerMsg.includes('surgery') || lowerMsg.includes('procedure')) {
        aiResponse += "I've noted your past treatments. Is there anything else about your medical history you'd like to share?";
        
        // Extract potential treatments (oversimplified)
        const potentialTreatments = ["surgery", "physical therapy", "radiation", "chemotherapy"];
        const detectedTreatments = potentialTreatments.filter(treatment => lowerMsg.includes(treatment));
        
        if (detectedTreatments.length > 0) {
          const newTreatments = [...formData.medicalHistory.pastTreatments, ...detectedTreatments];
          updateFormData({ pastTreatments: Array.from(new Set(newTreatments)) });
        }
      }
      else {
        aiResponse += "Is there anything specific about your medical conditions, allergies, medications, or past treatments you'd like to share?";
      }
      
      setMessages([...messages, {type: 'user', content: userMessage}, {type: 'ai', content: aiResponse}]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;
    
    // Add user message to chat
    setMessages([...messages, {type: 'user', content: userInput}]);
    
    // Process the message with AI
    processAIResponse(userInput);
    
    // Clear input
    setUserInput('');
  };

  // Manual entry handlers
  const addCondition = () => {
    if (newCondition.trim() === '') return;
    const newConditions = [...formData.medicalHistory.conditions, newCondition];
    updateFormData({ conditions: newConditions });
    setNewCondition('');
  };

  const addAllergy = () => {
    if (newAllergy.trim() === '') return;
    const newAllergies = [...formData.medicalHistory.allergies, newAllergy];
    updateFormData({ allergies: newAllergies });
    setNewAllergy('');
  };
  
  const addMedication = () => {
    if (newMedication.trim() === '') return;
    const newMedications = [...formData.medicalHistory.medications, newMedication];
    updateFormData({ medications: newMedications });
    setNewMedication('');
  };
  
  const addTreatment = () => {
    if (newTreatment.trim() === '') return;
    const newTreatments = [...formData.medicalHistory.pastTreatments, newTreatment];
    updateFormData({ pastTreatments: newTreatments });
    setNewTreatment('');
  };

  // Remove items
  const removeItem = (category: keyof SignupFormData["medicalHistory"], index: number) => {
    const updatedItems = [...formData.medicalHistory[category]];
    updatedItems.splice(index, 1);
    updateFormData({ [category]: updatedItems } as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-4">
        <Button 
          type="button" 
          variant={chatMode ? "default" : "outline"} 
          className="flex-1"
          onClick={() => setChatMode(true)}
        >
          <Bot className="mr-2 h-4 w-4" />
          AI Chat Assistant
        </Button>
        <Button 
          type="button" 
          variant={!chatMode ? "default" : "outline"} 
          className="flex-1"
          onClick={() => setChatMode(false)}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      {chatMode ? (
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-lg h-72 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input 
              placeholder="Type your medical history here..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button type="button" onClick={handleSendMessage}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Medical Conditions */}
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Add a medical condition" 
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.conditions.map((condition, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{condition}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => removeItem('conditions', index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Allergies */}
          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Add an allergy" 
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={addAllergy}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{allergy}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => removeItem('allergies', index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Medications */}
          <div className="space-y-2">
            <Label>Current Medications</Label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Add a medication" 
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={addMedication}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.medications.map((medication, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{medication}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => removeItem('medications', index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Past Treatments */}
          <div className="space-y-2">
            <Label>Past Treatments or Surgeries</Label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Add a past treatment" 
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={addTreatment}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medicalHistory.pastTreatments.map((treatment, index) => (
                <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{treatment}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => removeItem('pastTreatments', index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHistoryStep;
