
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Clock, Users, Video, ClipboardList, FileText, Bell, Settings, HelpCircle, Book, AlertCircle, CheckCircle, UserRound, X, LogOut, Info, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import WelcomeModal from "@/components/provider/WelcomeModal";
import ProviderPatients from "@/components/provider/ProviderPatients";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import CancelAppointmentDialog from "@/components/provider/CancelAppointmentDialog";
import VisitReasonDialog from "@/components/provider/VisitReasonDialog";
import ProviderPatientChat from "@/components/provider/ProviderPatientChat";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import NotificationsPopover from "@/components/notifications/NotificationsPopover";

const ProviderDashboard = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [appointments, setAppointments] = useState([{
    id: 1,
    patientName: "Sarah Johnson",
    patientId: "PTN-CE550N",
    appointmentType: "Specialist consultation",
    date: new Date(2023, 2, 21),
    time: "06:00 - 06:30 PM",
    status: "upcoming",
    visitReason: "Patient presents with recurrent migraine headaches that have increased in frequency over the past month. Reports visual aura before onset and nausea during episodes. Pain typically lasts 4-6 hours and is unresponsive to OTC pain relievers. Has family history of migraines. Currently taking propranolol for hypertension and has penicillin allergy."
  }, {
    id: 2,
    patientName: "Michael Chen",
    patientId: "PTN-CH442M",
    appointmentType: "Psychiatry consultation",
    date: new Date(2023, 2, 21),
    time: "03:00 - 03:30 PM",
    status: "upcoming",
    visitReason: "Patient seeking consultation for increasing anxiety and difficulty sleeping. Reports experiencing panic attacks 2-3 times weekly, with symptoms including racing heart, shortness of breath, and feeling of impending doom. Notes work-related stress as a trigger. No previous psychiatric diagnosis. Currently taking lisinopril for hypertension and has tried melatonin for sleep without significant improvement."
  }, {
    id: 3,
    patientName: "Emma Williams",
    patientId: "PTN-WL339E",
    appointmentType: "Family Planning counseling",
    date: new Date(2023, 2, 21),
    time: "05:00 - 05:30 PM",
    status: "upcoming",
    visitReason: "Patient seeking family planning counseling. Currently using hormonal contraception (oral) but experiencing side effects including mood changes and breakthrough bleeding. Interested in discussing long-term contraceptive options. No current plans for pregnancy but may want children in 3-5 years. Has history of mild endometriosis diagnosed 2 years ago. No known drug allergies."
  }]);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "appointment" as const,
      title: "New Appointment Request",
      description: "Sarah Johnson has requested a consultation for tomorrow at 2:00 PM",
      timestamp: "5 minutes ago",
      read: false,
      action: {
        label: "Review Request",
        href: "#"
      }
    },
    {
      id: "2",
      type: "message" as const,
      title: "Lab Results Ready",
      description: "Michael Rodriguez's blood work results are ready for review",
      timestamp: "1 hour ago",
      read: false,
      action: {
        label: "View Results",
        href: "#"
      }
    },
    {
      id: "3",
      type: "report" as const,
      title: "Patient Update",
      description: "Emma Williams has updated her medical history",
      timestamp: "2 hours ago",
      read: true,
      action: {
        label: "View Profile",
        href: "#"
      }
    }
  ]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/provider-login");
        return;
      }
      const userMetadata = data.session.user.user_metadata;
      const providerProfile = {
        id: data.session.user.id,
        firstName: userMetadata?.firstName || "Demo",
        lastName: userMetadata?.lastName || "Provider",
        email: data.session.user.email,
        specialization: userMetadata?.specialization || "General Practice",
        address: userMetadata?.address || "Sea Point Arena Promenade"
      };
      setProfile(providerProfile);
      const hasSeenWelcomeModal = localStorage.getItem(`welcome_modal_shown_${data.session.user.id}`);
      if (userMetadata?.isNewUser === true && !hasSeenWelcomeModal) {
        setShowWelcomeModal(true);
        await supabase.auth.updateUser({
          data: {
            ...userMetadata,
            isNewUser: false
          }
        });
        localStorage.setItem(`welcome_modal_shown_${data.session.user.id}`, 'true');
      }
      setLoading(false);
    };
    checkSession();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sign out successful",
        description: "You have been signed out from Vyra Health"
      });
      navigate("/provider-login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive"
      });
    }
  };

  const getStats = () => {
    return [{
      title: "Total Appointments",
      value: 16,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-50"
    }, {
      title: "Upcoming Appointments",
      value: 8,
      icon: <Clock className="h-5 w-5 text-green-500" />,
      bgColor: "bg-green-50"
    }, {
      title: "Completed Appointments",
      value: 8,
      icon: <CheckCircle className="h-5 w-5 text-indigo-500" />,
      bgColor: "bg-indigo-50"
    }, {
      title: "Follow-Up Appointments",
      value: 0,
      icon: <Bell className="h-5 w-5 text-amber-500" />,
      bgColor: "bg-amber-50"
    }, {
      title: "Extension Requests",
      value: 0,
      icon: <FileText className="h-5 w-5 text-rose-500" />,
      bgColor: "bg-rose-50"
    }];
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false);
    toast({
      title: "Welcome to Vyra Health Provider Dashboard",
      description: "Your account is now set up and ready to go."
    });
  };

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointmentToCancel(appointmentId);
  };

  const handleConfirmCancel = (reason: string, details?: string) => {
    setAppointments(appointments.map(appointment => appointment.id === appointmentToCancel ? {
      ...appointment,
      status: "cancelled"
    } : appointment));
    setAppointmentToCancel(null);
    toast({
      title: "Appointment Cancelled",
      description: `The appointment has been cancelled successfully.`
    });
  };

  const handleShowVisitReason = (appointmentId: number) => {
    setSelectedAppointment(appointmentId);
  };

  const closeVisitReasonDialog = () => {
    setSelectedAppointment(null);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({
      ...n,
      read: true
    })));
  };

  const formatDate = date => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "patients":
        return <ProviderPatients />;
      case "consultations":
        return <ProviderAppointments />;
      case "prescriptions":
        return <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Prescriptions</h2>
            <p className="text-muted-foreground">No active prescriptions to display.</p>
          </div>;
      case "chat":
        return <ProviderPatientChat patients={appointments.map(a => ({
            id: a.patientId,
            name: a.patientName,
            appointmentType: a.appointmentType,
            lastSeen: a.date
          }))} />;
      case "settings":
        return <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <div className="mt-1 p-2 border rounded-md">{profile?.firstName || "Demo"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <div className="mt-1 p-2 border rounded-md">{profile?.lastName || "Provider"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="mt-1 p-2 border rounded-md">{profile?.email || "provider@example.com"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                    <div className="mt-1 p-2 border rounded-md">{profile?.specialization || "General Practice"}</div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Edit Profile</Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Availability Management</h3>
                <p className="text-sm text-muted-foreground">Set your working hours and appointment slots.</p>
                <Button>Manage Availability</Button>
              </div>
            </div>
          </div>;
      case "help":
        return <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">How do I schedule an appointment?</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can schedule appointments through the Consultations section. Click on "Set Availability" 
                      to define your available time slots.
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">How can I access patient records?</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can access patient records by clicking on the Patients section and selecting a patient from the list.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  We value your feedback to improve our services. Please let us know if you have any suggestions.
                </p>
                <div className="p-4 border rounded-md">
                  <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Enter your feedback here..." />
                  <Button className="mt-4">Submit Feedback</Button>
                </div>
              </div>
            </div>
          </div>;
      case "legal":
        return <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Legal Documents</h2>
            <div className="space-y-8">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium">Terms of Use</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  By accessing this platform, you agree to be bound by these Terms of Use, all applicable laws and regulations, 
                  and agree that you are responsible for compliance with any applicable local laws.
                </p>
                <Button variant="outline" className="mt-4">Read Full Terms</Button>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This Privacy Policy describes how your personal information is collected, used, and shared when you use our platform.
                </p>
                <Button variant="outline" className="mt-4">Read Full Policy</Button>
              </div>
            </div>
          </div>;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    return <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Welcome, Dr. {profile?.lastName || "Provider"}</h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-0">
            <Calendar className="h-4 w-4 inline mr-1" /> 
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {getStats().map((stat, index) => <GlassCard key={index} className="p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </GlassCard>)}
        </div>
        
        <div className="mb-12">
          <GlassCard className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-background/60">
            <Tabs defaultValue="upcoming">
              <div className="flex justify-between items-center p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
                <h2 className="text-xl font-poppins font-semibold tracking-tight">Your Schedule</h2>
                <TabsList className="bg-background/60 backdrop-blur-sm border border-border/30">
                  <TabsTrigger value="upcoming" className="font-medium text-sm">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed" className="font-medium text-sm">Completed</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming" className="p-0">
                <div className="divide-y divide-border/20">
                  {appointments.filter(a => a.status !== "cancelled").map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="p-6 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                            <UserRound className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg tracking-tight font-poppins">{appointment.appointmentType}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-sm font-medium text-primary">{appointment.patientId}</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                <span className="text-sm">{appointment.patientName}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary shadow-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(appointment.date)}
                              </div>
                              
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-medical/10 text-medical shadow-sm">
                                <Clock className="h-3 w-3 mr-1" />
                                {appointment.time}
                              </div>
                              
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary shadow-sm">
                                <Video className="h-3 w-3 mr-1" />
                                Video Call
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-4 justify-end">
                        <Button variant="outline" size="sm" className="bg-background border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 shadow-sm" 
                                onClick={() => handleShowVisitReason(appointment.id)}>
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Visit Reason
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background hover:bg-destructive/5 border-destructive/20 text-destructive hover:border-destructive/40 shadow-sm" 
                                onClick={() => handleCancelAppointment(appointment.id)}>
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Cancel
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-sm">
                          <Video className="h-3.5 w-3.5 mr-1.5" />
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="p-4">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No completed appointments today.</p>
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-6 hover:shadow-md transition-all overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">Recent Patients</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5" onClick={() => setActiveSection("patients")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {appointments.map((appointment, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 hover:bg-muted/20 rounded-lg transition-colors"
                >
                  <Avatar className="h-10 w-10 mr-3 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">{appointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.patientId}</p>
                  </div>
                  <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/20">
                    {appointment.appointmentType.split(' ')[0]}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 hover:shadow-md transition-all overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">Your Schedule Today</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5" onClick={() => setActiveSection("consultations")}>
                Set Availability
              </Button>
            </div>
            <div className="space-y-3">
              {appointments.filter(a => a.status !== "cancelled").map((appointment, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium rounded-full px-3 py-1 w-20 text-center mr-3 text-sm shadow-sm">
                    {appointment.time.split(' - ')[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{appointment.appointmentType}</p>
                    <p className="text-xs text-muted-foreground">{appointment.patientName}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </>;
  };

  const getActiveAppointment = () => {
    return appointments.find(a => a.id === appointmentToCancel);
  };

  const getSelectedAppointment = () => {
    return appointments.find(a => a.id === selectedAppointment);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleClearAllNotifications = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-semibold gradient-text">Loading your dashboard...</div>
        </div>
      </div>;
  }

  return <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full font-poppins">
        <WelcomeModal isOpen={showWelcomeModal} onOpenChange={setShowWelcomeModal} onComplete={handleWelcomeComplete} />
        
        <CancelAppointmentDialog isOpen={appointmentToCancel !== null} onClose={() => setAppointmentToCancel(null)} appointmentId={appointmentToCancel || 0} patientName={getActiveAppointment()?.patientName || ""} onConfirmCancel={handleConfirmCancel} />
        
        {selectedAppointment && <VisitReasonDialog isOpen={selectedAppointment !== null} onClose={closeVisitReasonDialog} appointment={getSelectedAppointment() || {
        id: 0,
        patientName: "",
        patientId: "",
        appointmentType: "",
        date: new Date(),
        time: ""
      }} />}
        
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={`Dr. ${profile?.lastName || 'Provider'}`} />
                <AvatarFallback>{profile?.firstName?.[0]}{profile?.lastName?.[0] || "DP"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  Dr. {profile?.firstName} {profile?.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile?.specialization}
                </span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "dashboard"} onClick={() => setActiveSection("dashboard")}>
                      <Calendar className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "patients"} onClick={() => setActiveSection("patients")}>
                      <Users className="h-4 w-4" />
                      <span>Patients</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "consultations"} onClick={() => setActiveSection("consultations")}>
                      <Video className="h-4 w-4" />
                      <span>Consultations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "prescriptions"} onClick={() => setActiveSection("prescriptions")}>
                      <ClipboardList className="h-4 w-4" />
                      <span>Prescriptions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "chat"} onClick={() => setActiveSection("chat")}>
                      <MessageSquare className="h-4 w-4" />
                      <span>Patient Chat</span>
                      <Badge className="ml-auto" variant="outline">New</Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Support & Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "settings"} onClick={() => setActiveSection("settings")}>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "help"} onClick={() => setActiveSection("help")}>
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeSection === "legal"} onClick={() => setActiveSection("legal")}>
                      <Book className="h-4 w-4" />
                      <span>Legal</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="space-y-2 w-full px-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="destructive" className="w-full justify-start" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="p-4 border-b bg-gradient-to-r from-background via-background to-background/70 backdrop-blur-sm flex justify-between items-center">
              <div className="flex items-center cursor-pointer" onClick={handleSignOut}>
                <span className="text-primary text-xl font-bold tracking-tight">Vyra</span>
                <span className="text-secondary text-xl font-bold tracking-tight">Health</span>
              </div>
              <div className="flex items-center gap-2">
                <NotificationsPopover
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onClearAll={handleClearAllNotifications}
                />
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </header>
            
            <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-background to-background/95">
              {renderContent()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};

export default ProviderDashboard;
