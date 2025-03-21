
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, PaperclipIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: { name: string; url: string }[];
};

type Contact = {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  status: "online" | "offline" | "away";
};

const PatientDoctorChat = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const contacts: Contact[] = [
    {
      id: "doc-1",
      name: "Dr. Sarah Johnson",
      specialty: "Dermatologist",
      lastMessage: "How are you feeling today?",
      lastMessageTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      unreadCount: 2,
      status: "online"
    },
    {
      id: "doc-2",
      name: "Dr. Michael Chen",
      specialty: "Psychiatrist",
      lastMessage: "Remember to take your medication as prescribed.",
      lastMessageTime: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      unreadCount: 0,
      status: "away"
    },
    {
      id: "doc-3",
      name: "Dr. Emma Williams",
      specialty: "Family Medicine",
      lastMessage: "Your test results look good.",
      lastMessageTime: new Date(Date.now() - 24 * 3600000), // 1 day ago
      unreadCount: 0,
      status: "offline"
    }
  ];

  const conversations: Record<string, Message[]> = {
    "doc-1": [
      {
        id: "msg-1",
        sender: "doctor",
        content: "Hello! How are you feeling after our last appointment?",
        timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
        read: true
      },
      {
        id: "msg-2",
        sender: "patient",
        content: "I'm feeling much better, thank you. The prescribed treatment is working well.",
        timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
        read: true
      },
      {
        id: "msg-3",
        sender: "doctor",
        content: "That's great to hear! Do you have any side effects?",
        timestamp: new Date(Date.now() - 35 * 60000), // 35 minutes ago
        read: true
      },
      {
        id: "msg-4",
        sender: "doctor",
        content: "Also, remember to apply the medication twice daily.",
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        read: false
      }
    ],
    "doc-2": [
      {
        id: "msg-1",
        sender: "doctor",
        content: "How are you managing with the new medication?",
        timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
        read: true
      },
      {
        id: "msg-2",
        sender: "patient",
        content: "I'm adjusting well, but I do feel a bit drowsy in the mornings.",
        timestamp: new Date(Date.now() - 2.5 * 3600000), // 2.5 hours ago
        read: true
      },
      {
        id: "msg-3",
        sender: "doctor",
        content: "That's a common side effect. Try taking it earlier in the evening. Remember to take your medication as prescribed.",
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        read: true
      }
    ],
    "doc-3": [
      {
        id: "msg-1",
        sender: "doctor",
        content: "I've received your lab results and everything looks normal.",
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
        read: true
      },
      {
        id: "msg-2",
        sender: "patient",
        content: "That's a relief! Thank you for checking.",
        timestamp: new Date(Date.now() - 23 * 3600000), // 23 hours ago
        read: true
      },
      {
        id: "msg-3",
        sender: "doctor",
        content: "Your test results look good. Keep up with your current health routine.",
        timestamp: new Date(Date.now() - 22 * 3600000), // 22 hours ago
        read: true
      }
    ]
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

  const handleSendMessage = () => {
    if (messageText.trim() === '' && attachments.length === 0) return;
    
    if (activeContact) {
      // In a real app, this would be sent to an API
      console.log(`Sending message to ${activeContact}: ${messageText}`);
      console.log(`Attachments: ${attachments.map(a => a.name).join(', ')}`);
      
      // Clear the input fields
      setMessageText("");
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat with Your Doctor
        </CardTitle>
        <CardDescription>
          Connect directly with your healthcare providers for follow-up questions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex overflow-hidden">
        <div className="w-1/3 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <input
                className="w-full px-3 py-2 bg-muted/50 rounded-md pl-8"
                placeholder="Search conversations..."
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-2 top-3 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(600px-110px)]">
            <div className="divide-y">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    "p-3 hover:bg-muted/50 cursor-pointer transition-colors",
                    activeContact === contact.id && "bg-muted"
                  )}
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                          getStatusColor(contact.status)
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(contact.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.lastMessage || contact.specialty}
                        </p>
                        {contact.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 min-w-5 px-1 rounded-full">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {contacts.find(c => c.id === activeContact)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {contacts.find(c => c.id === activeContact)?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {contacts.find(c => c.id === activeContact)?.specialty}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversations[activeContact].map((message, index) => {
                    // Check if we need a date separator
                    const showDateSeparator = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(conversations[activeContact][index - 1].timestamp);
                    
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
                            message.sender === "patient" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.sender === "patient"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p>{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, i) => (
                                  <div key={i} className="flex items-center gap-1 text-xs">
                                    <PaperclipIcon className="h-3 w-3" />
                                    <a href={attachment.url} className="underline">
                                      {attachment.name}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div
                              className={cn(
                                "text-xs mt-1 flex justify-end",
                                message.sender === "patient"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatTime(message.timestamp)}
                              {message.sender === "patient" && (
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
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a conversation from the list to start chatting with your doctor
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDoctorChat;
