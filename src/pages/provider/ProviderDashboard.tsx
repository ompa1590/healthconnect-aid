
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  ClipboardList, 
  FileText, 
  Bell, 
  Settings,
  AlertCircle,
  CheckCircle,
  UserRound
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import WelcomeModal from "@/components/provider/WelcomeModal";

const ProviderDashboard = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientId: "PTN-CE550N",
      appointmentType: "Specialist consultation",
      date: new Date(2023, 2, 21),
      time: "06:00 - 06:30 PM",
      status: "upcoming"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      patientId: "PTN-CE550N",
      appointmentType: "Psychiatry consultation",
      date: new Date(2023, 2, 21),
      time: "03:00 - 03:30 PM",
      status: "upcoming"
    },
    {
      id: 3,
      patientName: "Emma Williams",
      patientId: "PTN-CE550N",
      appointmentType: "Family Planning counseling",
      date: new Date(2023, 2, 21),
      time: "05:00 - 05:30 PM",
      status: "upcoming"
    }
  ]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/provider-login");
        return;
      }
      
      // Get provider profile
      const { data: profileData, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(profileData);
        
        // Check if this is a new user (first time login)
        // For demo purposes, we're using a hardcoded value
        // In production, you would check a field like 'first_login' in the database
        if (isNewUser) {
          setShowWelcomeModal(true);
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [navigate, isNewUser]);

  const getStats = () => {
    return [
      { 
        title: "Total Appointments", 
        value: 16, 
        icon: <Calendar className="h-5 w-5 text-blue-500" />, 
        bgColor: "bg-blue-50" 
      },
      { 
        title: "Upcoming Appointments", 
        value: 8, 
        icon: <Clock className="h-5 w-5 text-green-500" />, 
        bgColor: "bg-green-50" 
      },
      { 
        title: "Completed Appointments", 
        value: 8, 
        icon: <CheckCircle className="h-5 w-5 text-indigo-500" />, 
        bgColor: "bg-indigo-50" 
      },
      { 
        title: "Follow-Up Appointments", 
        value: 0, 
        icon: <Bell className="h-5 w-5 text-amber-500" />, 
        bgColor: "bg-amber-50" 
      },
      { 
        title: "Extension Requests", 
        value: 0, 
        icon: <FileText className="h-5 w-5 text-rose-500" />, 
        bgColor: "bg-rose-50" 
      }
    ];
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false);
    setIsNewUser(false);
    
    toast({
      title: "Welcome to Vyra Health Provider Dashboard",
      description: "Your account is now set up and ready to go.",
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-semibold">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome modal for new users */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal} 
        onComplete={handleWelcomeComplete} 
      />
      
      {/* Header */}
      <header className="bg-background border-b border-border/40 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary text-2xl font-bold">Vyra</span>
            <span className="text-secondary text-2xl font-bold">Health</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Settings</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="Provider" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Dr. Demo Provider</p>
                <p className="text-xs text-muted-foreground">Sea Point Arena Promenade</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-muted/20 rounded-lg p-4 flex items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt="Provider" />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium">Dr. Demo Provider</h3>
                <p className="text-xs text-muted-foreground">Sea Point Arena Promenade</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#" className="font-medium text-primary">
                  <Calendar className="mr-2 h-5 w-5" />
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#">
                  <Users className="mr-2 h-5 w-5" />
                  Patients
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#">
                  <Video className="mr-2 h-5 w-5" />
                  Consultations
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Prescriptions
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </a>
              </Button>
            </nav>
            
            <GlassCard className="p-4">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </GlassCard>
          </aside>
          
          {/* Main content */}
          <main className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {getStats().map((stat, index) => (
                <GlassCard key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            
            {/* Appointments */}
            <GlassCard className="mb-8">
              <Tabs defaultValue="upcoming">
                <div className="flex justify-between items-center p-4 border-b border-border/40">
                  <h2 className="text-xl font-semibold">Appointments</h2>
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="upcoming" className="p-0">
                  <div className="divide-y divide-border/40">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <UserRound className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.appointmentType}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.patientId} - {appointment.patientName}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">
                              {formatDate(appointment.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Video className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">Video Call</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                          <Button size="sm">
                            <Video className="mr-1 h-4 w-4" />
                            Video Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="p-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No completed appointments yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
            
            {/* Additional cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recent Patients</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-xs text-muted-foreground">{appointment.patientId}</p>
                      </div>
                      <Badge className="ml-auto">{appointment.appointmentType.split(' ')[0]}</Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Your Schedule Today</h3>
                  <Button variant="ghost" size="sm">Set Availability</Button>
                </div>
                <div className="space-y-3">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                      <div className="bg-primary/10 text-primary font-medium rounded p-1 w-16 text-center mr-3 text-sm">
                        {appointment.time.split(' - ')[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{appointment.appointmentType}</p>
                        <p className="text-xs text-muted-foreground">{appointment.patientName}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
