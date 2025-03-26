import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, PaperclipIcon, MessageSquare, Search, Clock, Calendar, Info, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import PatientHistoryDialog from "./PatientHistoryDialog";

type Patient = {
  id: string;
  name: string;
  appointmentType: string;
  lastSeen: Date;
  medications?: string[];
  conditions?: string[];
  allergies?: string[];
};

type Message = {
  id: string;
  sender: "provider" | "patient";
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: { name: string; url: string }[];
};

type Appointment = {
  date: Date;
  reason: string;
  provider: string;
  notes?: string;
};

type ProviderPatientChatProps = {
  patients: Patient[];
};

const ProviderPatientChat: React.FC<ProviderPatientChatProps> = ({ patients }) => {
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    const patientsWithHistory = patients.map(patient => {
      const possibleConditions = ["Hypertension", "Diabetes Type 2", "Asthma", "Migraines", "Arthritis"];
      const possibleAllergies = ["Penicillin", "Peanuts", "Latex", "Shellfish", "Pollen"];
      const possibleMedications = ["Lisinopril", "Metformin", "Albuterol", "Sumatriptan", "Ibuprofen"];
      
      const randomConditions = possibleConditions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3));
        
      const randomAllergies = possibleAllergies
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3));
        
      const randomMedications = possibleMedications
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3));
      
      return {
        ...patient,
        conditions: randomConditions,
        allergies: randomAllergies,
        medications: randomMedications
      };
    });
    
    const dummyConversations: Record<string, Message[]> = {};
    
    patientsWithHistory.forEach(patient => {
      const numMessages = Math.floor(Math.random() * 5) + 1;
      const patientMessages: Message[] = [];
      
      for (let i = 0; i < numMessages; i++) {
        const isProvider = i % 2 === 0;
        const timeOffset = (numMessages - i) * 20 * 60000;
        
        patientMessages.push({
          id: `msg-${patient.id}-${i}`,
          sender: isProvider ? "provider" : "patient",
          content: isProvider 
            ? `Hello ${patient.name}, how are you feeling after our last appointment?` 
            : `I'm feeling much better, thank you Doctor. The medication is helping.`,
          timestamp: new Date(Date.now() - timeOffset),
          read: true
        });
      }
      
      if (patientMessages.length > 0) {
        patientMessages.push({
          id: `msg-${patient.id}-unread`,
          sender: "patient",
          content: "I have a quick follow-up question about my prescription. Can I take it with food?",
          timestamp: new Date(Date.now() - 5 * 60000),
          read: false
        });
      }
      
      dummyConversations[patient.id] = patientMessages;
    });
    
    setConversations(dummyConversations);
    
    if (patientsWithHistory.length > 0) {
      setActivePatient(patientsWithHistory[0].id);
    }
  }, [patients]);

  const handleSendMessage = () => {
    if (messageText.trim() === '' && attachments.length === 0) return;
    
    if (activePatient) {
      console.log(`Sending message to ${activePatient}: ${messageText}`);
      console.log(`Attachments: ${attachments.map(a => a.name).join(', ')}`);
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "provider",
        content: messageText,
        timestamp: new Date(),
        read: true,
        attachments: attachments.length > 0 
          ? attachments.map(file => ({ name: file.name, url: '#' })) 
          : undefined
      };
      
      setConversations(prev => ({
        ...prev,
        [activePatient]: [...(prev[activePatient] || []), newMessage]
      }));
      
      setMessageText("");
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUnreadCount = (patientId: string) => {
    return conversations[patientId]?.filter(msg => !msg.read && msg.sender === "patient").length || 0;
  };

  const getLastMessage = (patientId: string) => {
    const patientConversation = conversations[patientId];
    if (!patientConversation || patientConversation.length === 0) return null;
    
    return patientConversation[patientConversation.length - 1];
  };

  const getStatusColor = (patientId: string) => {
    const statuses = ['online', 'away', 'offline'];
    const hash = patientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return statuses[hash % statuses.length];
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivePatient = () => {
    return activePatient ? patients.find(p => p.id === activePatient) : null;
  };

  const getPastAppointments = (patientId: string): Appointment[] => {
    const appointments: Appointment[] = [];
    
    const numAppointments = Math.floor(Math.random() * 3) + 2;
    const appointmentReasons = ["Annual Check-up", "Follow-up", "Urgent Care", "Consultation", "Prescription Renewal"];
    const providerNames = ["Dr. Johnson", "Dr. Patel", "Dr. Garcia", "Dr. Williams", "Dr. Lee"];
    
    for (let i = 0; i < numAppointments; i++) {
      const timeOffset = (i + 1) * 30 * 24 * 60 * 60 * 1000;
      appointments.push({
        date: new Date(Date.now() - timeOffset),
        reason: appointmentReasons[Math.floor(Math.random() * appointmentReasons.length)],
        provider: providerNames[Math.floor(Math.random() * providerNames.length)],
        notes: Math.random() > 0.5 ? "Patient responded well to treatment. Follow-up in 3 months." : undefined
      });
    }
    
    return appointments.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.appointmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Message Your Patients
        </CardTitle>
        <CardDescription>
          Follow up on treatment progress or provide additional guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex overflow-hidden">
        <div className="w-1/3 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Input
                className="w-full px-3 py-2 pl-8 bg-muted/50"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="h-4 w-4 absolute left-2 top-3 text-muted-foreground"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(600px-110px)]">
            <div className="divide-y">
              {filteredPatients.map((patient) => {
                const lastMessage = getLastMessage(patient.id);
                const unreadCount = getUnreadCount(patient.id);
                const status = getStatusColor(patient.id);
                
                return (
                  <div
                    key={patient.id}
                    className={cn(
                      "p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                      activePatient === patient.id && "bg-muted"
                    )}
                    onClick={() => setActivePatient(patient.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background", 
                          getStatusColorClass(status)
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-medium truncate text-lg">{patient.name}</h3>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage?.content || patient.appointmentType}
                          </p>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="ml-2 h-5 min-w-5 px-1 rounded-full">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No patients found matching "{searchQuery}"
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex-1 flex flex-col">
          {activePatient ? (
            <>
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {patients.find(p => p.id === activePatient)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {patients.find(p => p.id === activePatient)?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {patients.find(p => p.id === activePatient)?.appointmentType}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setIsHistoryDialogOpen(true)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">View History</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Patient Info</span>
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversations[activePatient]?.map((message, index) => {
                    const showDateSeparator = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(conversations[activePatient][index - 1].timestamp);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDateSeparator && (
                          <div className="flex justify-center my-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={cn(
                            "flex",
                            message.sender === "provider" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.sender === "provider"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="break-words">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, i) => (
                                  <div key={i} className="flex items-center gap-1 text-xs">
                                    <PaperclipIcon className="h-3 w-3" />
                                    <a href={attachment.url} className="underline truncate max-w-[200px]">
                                      {attachment.name}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div
                              className={cn(
                                "text-xs mt-1 flex justify-end",
                                message.sender === "provider"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatTime(message.timestamp)}
                              {message.sender === "provider" && (
                                <span className="ml-1">
                                  {message.read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {(!conversations[activePatient] || conversations[activePatient].length === 0) && (
                    <div className="text-center text-muted-foreground py-10">
                      No messages yet. Start the conversation with {patients.find(p => p.id === activePatient)?.name}.
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                {attachments.length > 0 && (
                  <div className="mb-2 p-2 bg-muted/30 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Attachments</div>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                          <PaperclipIcon className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <button
                            onClick={() => {
                              const newAttachments = [...attachments];
                              newAttachments.splice(index, 1);
                              setAttachments(newAttachments);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => document.getElementById('file-upload-provider')?.click()}
                  >
                    <input
                      id="file-upload-provider"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-10 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    className="shrink-0"
                    onClick={handleSendMessage}
                    disabled={messageText.trim() === '' && attachments.length === 0}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-[15px] mx-[32px]">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No patient selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a patient from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <PatientHistoryDialog 
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        patient={activePatient ? {
          ...getActivePatient()!,
          pastAppointments: getPastAppointments(activePatient)
        } : null}
      />
    </Card>
  );
};

export default ProviderPatientChat;
