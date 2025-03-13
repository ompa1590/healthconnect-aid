
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  SendHorizontal, 
  Plus, 
  Bot, 
  Trash, 
  BookOpen, 
  Mic, 
  MicOff,
  Loader2
} from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIHistoryStepProps {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData["medicalHistory"]>) => void;
}

const AIHistoryStep: React.FC<AIHistoryStepProps> = ({ formData, updateFormData }) => {
  // Chat state
  const [chatMode, setChatMode] = useState(true);
  const [messages, setMessages] = useState<{type: 'user' | 'ai', content: string}[]>([
    {type: 'ai', content: 'Hi there! I\'m your Altheo Health Assistant. I\'ll help gather your medical history to provide better care. Would you like to tell me about any existing medical conditions, allergies, medications, or past treatments? You can type or use the mic button to speak.'}
  ]);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('medical-history');
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  
  // Form inputs for manual entry
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newTreatment, setNewTreatment] = useState('');

  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lifestyle assessment data
  const [lifestyleData, setLifestyleData] = useState({
    alcohol: {
      drinks: false,
      frequency: '',
      perWeek: 0,
    },
    smoking: {
      smokes: false,
      perDay: '',
    },
    drugs: {
      uses: false,
      types: [],
    },
    sexual: {
      active: false,
      protection: '',
    },
    sleep: {
      hours: 0,
    },
    exercise: {
      minutes: 0,
    }
  });

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup speech recognition when component mounts
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setUserInput(transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setShowConsentDialog(true);
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // Process chat message to identify medical history
  const processAIResponse = (userMessage: string) => {
    // Set processing state
    setIsProcessingVoice(true);
    
    setTimeout(() => {
      const lowerMsg = userMessage.toLowerCase();
      let aiResponse = "Thank you for sharing that information. ";
      let nextQuestion = currentQuestion;
      
      // Process based on current question context
      if (currentQuestion === 'medical-history') {
        aiResponse += "I've noted your medical history. Now, let's talk about allergies. Do you have any known allergies to medications, food, or other substances?";
        nextQuestion = 'allergies';
        
        // Extract potential conditions (this is oversimplified for demo)
        const potentialConditions = [
          "diabetes", "asthma", "hypertension", "arthritis", "anxiety", 
          "depression", "high blood pressure", "heart disease", "cancer",
          "thyroid", "migraine", "chronic pain"
        ];
        
        const detectedConditions = potentialConditions.filter(condition => 
          lowerMsg.includes(condition)
        );
        
        if (detectedConditions.length > 0) {
          const newConditions = [...formData.medicalHistory.conditions, ...detectedConditions];
          updateFormData({ conditions: Array.from(new Set(newConditions)) });
        }
      } 
      else if (currentQuestion === 'allergies') {
        aiResponse += "I've recorded your allergies. Are you currently taking any medications, vitamins, or supplements? Please include the dosage if you remember.";
        nextQuestion = 'medications';
        
        // Extract potential allergies
        const potentialAllergies = [
          "peanuts", "shellfish", "dairy", "gluten", "penicillin", 
          "dust", "pollen", "latex", "eggs", "nuts", "soy"
        ];
        
        const detectedAllergies = potentialAllergies.filter(allergy => 
          lowerMsg.includes(allergy)
        );
        
        if (detectedAllergies.length > 0) {
          const newAllergies = [...formData.medicalHistory.allergies, ...detectedAllergies];
          updateFormData({ allergies: Array.from(new Set(newAllergies)) });
        }
      }
      else if (currentQuestion === 'medications') {
        aiResponse += "Thanks for telling me about your medications. Have you had any significant medical treatments, procedures, or surgeries in the past?";
        nextQuestion = 'treatments';
        
        // Extract potential medications
        const potentialMeds = [
          "lipitor", "metformin", "lisinopril", "prozac", "advil", 
          "tylenol", "aspirin", "ibuprofen", "insulin", "amoxicillin"
        ];
        
        const detectedMeds = potentialMeds.filter(med => 
          lowerMsg.includes(med)
        );
        
        if (detectedMeds.length > 0) {
          const newMeds = [...formData.medicalHistory.medications, ...detectedMeds];
          updateFormData({ medications: Array.from(new Set(newMeds)) });
        }
      }
      else if (currentQuestion === 'treatments') {
        aiResponse += "I've noted your past treatments. Now, let's discuss your lifestyle. Do you consume alcohol? If so, how frequently?";
        nextQuestion = 'lifestyle-alcohol';
        
        // Extract potential treatments
        const potentialTreatments = [
          "surgery", "physical therapy", "radiation", "chemotherapy",
          "operation", "bypass", "transplant", "procedure"
        ];
        
        const detectedTreatments = potentialTreatments.filter(treatment => 
          lowerMsg.includes(treatment)
        );
        
        if (detectedTreatments.length > 0) {
          const newTreatments = [...formData.medicalHistory.pastTreatments, ...detectedTreatments];
          updateFormData({ pastTreatments: Array.from(new Set(newTreatments)) });
        }
      }
      else if (currentQuestion === 'lifestyle-alcohol') {
        // Process alcohol information
        const drinks = lowerMsg.includes("yes") || 
                      lowerMsg.includes("drink") || 
                      !lowerMsg.includes("no") && !lowerMsg.includes("don't") && !lowerMsg.includes("dont");
        
        setLifestyleData(prev => ({
          ...prev,
          alcohol: {
            ...prev.alcohol,
            drinks,
            frequency: lowerMsg.includes("daily") ? "daily" : 
                       lowerMsg.includes("weekly") ? "weekly" : 
                       lowerMsg.includes("monthly") ? "monthly" : 
                       lowerMsg.includes("rarely") ? "rarely" : ""
          }
        }));
        
        aiResponse += "Thank you. Do you smoke cigarettes or use tobacco products? If yes, how often?";
        nextQuestion = 'lifestyle-smoking';
      }
      else if (currentQuestion === 'lifestyle-smoking') {
        // Process smoking information
        const smokes = lowerMsg.includes("yes") || 
                      lowerMsg.includes("smoke") || 
                      !lowerMsg.includes("no") && !lowerMsg.includes("don't") && !lowerMsg.includes("dont");
        
        let perDay = "";
        if (lowerMsg.includes("1-5") || 
            (lowerMsg.includes("1") && lowerMsg.includes("5"))) {
          perDay = "1-5";
        } else if (lowerMsg.includes("5-10") || 
                  (lowerMsg.includes("5") && lowerMsg.includes("10"))) {
          perDay = "5-10";
        } else if (lowerMsg.includes("10-20") || 
                  (lowerMsg.includes("10") && lowerMsg.includes("20"))) {
          perDay = "10-20";
        } else if (lowerMsg.includes("more than 20") || lowerMsg.includes("over 20")) {
          perDay = "More than 20";
        }
        
        setLifestyleData(prev => ({
          ...prev,
          smoking: {
            smokes,
            perDay
          }
        }));
        
        aiResponse += "Thank you for sharing. How many hours of sleep do you typically get per night?";
        nextQuestion = 'lifestyle-sleep';
      }
      else if (currentQuestion === 'lifestyle-sleep') {
        // Process sleep information
        const sleepHours = lowerMsg.match(/\d+/);
        if (sleepHours) {
          setLifestyleData(prev => ({
            ...prev,
            sleep: {
              hours: parseInt(sleepHours[0])
            }
          }));
        }
        
        aiResponse += "How much exercise or physical activity do you get in a typical week? This can include walking, sports, gym, or any physical activities.";
        nextQuestion = 'lifestyle-exercise';
      }
      else if (currentQuestion === 'lifestyle-exercise') {
        // Process exercise information
        const exerciseMinutes = lowerMsg.match(/\d+/);
        if (exerciseMinutes) {
          setLifestyleData(prev => ({
            ...prev,
            exercise: {
              minutes: parseInt(exerciseMinutes[0])
            }
          }));
        }
        
        aiResponse += "Thank you for sharing all this information. I've recorded your medical history and lifestyle information. Is there anything else you'd like to add before we finish?";
        nextQuestion = 'final';
      }
      else if (currentQuestion === 'final') {
        aiResponse += "Great! I've compiled your medical profile. This information will help your healthcare provider deliver better care. You can review and edit this information at any time from your account settings.";
        nextQuestion = 'complete';
        
        // Here we could summarize the collected information
        const summary = {
          medicalHistory: formData.medicalHistory,
          lifestyle: lifestyleData
        };
        
        console.log("Collected health information:", summary);
      }
      else {
        aiResponse += "Is there anything specific about your medical conditions, allergies, medications, or past treatments you'd like to share?";
      }
      
      // Update current question context
      setCurrentQuestion(nextQuestion);
      
      // Add to messages
      setMessages([...messages, {type: 'user', content: userMessage}, {type: 'ai', content: aiResponse}]);
      
      // Clear processing state
      setIsProcessingVoice(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;
    
    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
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
            {isProcessingVoice && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing your response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex space-x-2">
            <Input 
              placeholder="Type your medical history here..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessingVoice}
            />
            <Button 
              type="button"
              variant="outline"
              onClick={toggleRecording}
              className={isRecording ? "bg-red-500 hover:bg-red-600 text-white" : ""}
              disabled={isProcessingVoice}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              type="button" 
              onClick={handleSendMessage}
              disabled={userInput.trim() === '' || isProcessingVoice}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Detected Information:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Medical Conditions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.medicalHistory.conditions.length > 0 ? (
                    formData.medicalHistory.conditions.map((item, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Allergies</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.medicalHistory.allergies.length > 0 ? (
                    formData.medicalHistory.allergies.map((item, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Medications</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.medicalHistory.medications.length > 0 ? (
                    formData.medicalHistory.medications.map((item, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Past Treatments</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.medicalHistory.pastTreatments.length > 0 ? (
                    formData.medicalHistory.pastTreatments.map((item, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
            </div>
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
          
          {/* Lifestyle Assessment */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="font-medium">Lifestyle Assessment</h3>
            
            {/* Alcohol Section */}
            <div className="space-y-2">
              <Label>Alcohol Consumption</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="drinks-alcohol" 
                    checked={lifestyleData.alcohol.drinks}
                    onChange={(e) => setLifestyleData(prev => ({ 
                      ...prev, 
                      alcohol: { ...prev.alcohol, drinks: e.target.checked } 
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="drinks-alcohol" className="text-sm font-normal">Do you drink alcohol?</Label>
                </div>
                
                {lifestyleData.alcohol.drinks && (
                  <div className="pl-6 space-y-2">
                    <Select 
                      value={lifestyleData.alcohol.frequency} 
                      onValueChange={(value) => setLifestyleData(prev => ({ 
                        ...prev, 
                        alcohol: { ...prev.alcohol, frequency: value } 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="How often do you drink?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      placeholder="Average drinks per week"
                      value={lifestyleData.alcohol.perWeek || ''}
                      onChange={(e) => setLifestyleData(prev => ({ 
                        ...prev, 
                        alcohol: { ...prev.alcohol, perWeek: parseInt(e.target.value) || 0 } 
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Smoking Section */}
            <div className="space-y-2">
              <Label>Smoking Habits</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="smokes" 
                    checked={lifestyleData.smoking.smokes}
                    onChange={(e) => setLifestyleData(prev => ({ 
                      ...prev, 
                      smoking: { ...prev.smoking, smokes: e.target.checked } 
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="smokes" className="text-sm font-normal">Do you smoke cigarettes?</Label>
                </div>
                
                {lifestyleData.smoking.smokes && (
                  <div className="pl-6">
                    <Select 
                      value={lifestyleData.smoking.perDay} 
                      onValueChange={(value) => setLifestyleData(prev => ({ 
                        ...prev, 
                        smoking: { ...prev.smoking, perDay: value } 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cigarettes per day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 per day</SelectItem>
                        <SelectItem value="5-10">5-10 per day</SelectItem>
                        <SelectItem value="10-20">10-20 per day</SelectItem>
                        <SelectItem value="More than 20">More than 20 per day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sleep Section */}
            <div className="space-y-2">
              <Label>Sleep Patterns</Label>
              <Input
                type="number"
                placeholder="Average hours of sleep per night"
                value={lifestyleData.sleep.hours || ''}
                onChange={(e) => setLifestyleData(prev => ({ 
                  ...prev, 
                  sleep: { hours: parseInt(e.target.value) || 0 } 
                }))}
              />
            </div>
            
            {/* Exercise Section */}
            <div className="space-y-2">
              <Label>Physical Activity</Label>
              <Input
                type="number"
                placeholder="Minutes of exercise per week"
                value={lifestyleData.exercise.minutes || ''}
                onChange={(e) => setLifestyleData(prev => ({ 
                  ...prev, 
                  exercise: { minutes: parseInt(e.target.value) || 0 } 
                }))}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Microphone Consent Dialog */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Microphone Access Required</DialogTitle>
            <DialogDescription>
              To use voice input, Altheo Health needs permission to access your microphone. 
              Your voice data is only used for transcription to text and is not stored.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowConsentDialog(false);
              if (recognitionRef.current) {
                setIsRecording(true);
                recognitionRef.current.start();
              }
            }}>
              Allow Microphone Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIHistoryStep;
