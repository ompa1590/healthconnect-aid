
import React, { useState, useEffect, useMemo } from "react";
import { 
  CalendarClock, 
  Clock, 
  FileText, 
  MessageSquareText, 
  Pill, 
  User2, 
  X,
  Search,
  ArrowLeft,
  Stethoscope,
  Sparkles,
  Filter,
  ChevronRight,
  RefreshCw,
  ClipboardList,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartPulseLoader } from "@/components/ui/heart-pulse-loader";
import useAppointment from "@/hooks/useAppointment";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Appointment = {
  id: number | string;
  doctor?: string;
  doctor_name?: string;
  specialty?: string;
  service_name?: string;
  service_type?: string;
  date?: string;
  time?: string;
  appointment_date?: string;
  appointment_time?: string;
  status: "upcoming" | "completed" | "cancelled" | "in_progress";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
  reason?: string;
  ai_triage_data?: {
    symptoms?: string[];
    duration?: string;
    severity?: string;
    additional_notes?: string;
    preliminary_assessment?: string;
    recommended_action?: string;
    urgency_level?: "low" | "medium" | "high";
  };
};

const PastAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { getAppointments, isLoading, error } = useAppointment();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for past appointments page...");
        const fetchedAppointments = await getAppointments();
        
        // Transform the fetched appointments to match our component's expected format
        const formattedAppointments = fetchedAppointments.map(apt => {
          // Mock AI triage data (this would come from your database in a real scenario)
          const mockAiTriageData = {
            symptoms: ["Persistent cough", "Mild fever", "Fatigue"],
            duration: "5 days",
            severity: "Moderate",
            additional_notes: "Symptoms worsen at night. No known allergies.",
            preliminary_assessment: "Possible respiratory infection",
            recommended_action: "Consultation with general practitioner for evaluation and possible prescription",
            urgency_level: apt.reason?.toLowerCase().includes("urgent") ? "high" : "medium"
          };

          return {
            id: apt.id,
            doctor: apt.doctor_name || `Dr. ${apt.provider_id?.substring(0, 8) || "Unknown"}`,
            doctor_name: apt.doctor_name,
            specialty: apt.service_name || apt.service_type || "General Practitioner",
            service_name: apt.service_name,
            service_type: apt.service_type,
            date: apt.appointment_date || new Date().toISOString().split('T')[0],
            time: apt.appointment_time || "10:00 AM",
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time,
            status: apt.status as "upcoming" | "completed" | "cancelled" | "in_progress",
            reason: apt.reason || "No reason provided",
            ai_triage_data: mockAiTriageData
          };
        });

        setAppointments(formattedAppointments);
        
        // Automatically select the first appointment if available
        if (formattedAppointments.length > 0) {
          setSelectedAppointment(formattedAppointments[0]);
        }
      } catch (err) {
        console.error("Error in appointment fetch effect:", err);
      }
    };

    fetchAppointments();
  }, [getAppointments, retryCount]);
  
  // Extract all unique specialties for the filter
  const specialties = useMemo(() => {
    return [...new Set(appointments.map(appointment => appointment.specialty))];
  }, [appointments]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(appointment => 
        (searchQuery === "" || 
         appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
         appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (appointment.reason && appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (selectedSpecialties.length === 0 || 
         selectedSpecialties.includes(appointment.specialty))
      )
      .sort((a, b) => {
        // Sort by date (most recent first)
        const dateA = a.appointment_date || a.date || "";
        const dateB = b.appointment_date || b.date || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  }, [appointments, searchQuery, selectedSpecialties]);

  // Split appointments into upcoming and past
  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter(appointment => 
      appointment.status === "upcoming" || appointment.status === "in_progress"
    );
  }, [filteredAppointments]);

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter(appointment => 
      appointment.status === "completed" || appointment.status === "cancelled"
    );
  }, [filteredAppointments]);

  // Limit the number of displayed appointments unless "View All" is clicked
  const displayedUpcomingAppointments = showAllAppointments ? 
    upcomingAppointments : 
    upcomingAppointments.slice(0, 3);
    
  const displayedPastAppointments = showAllAppointments ? 
    pastAppointments : 
    pastAppointments.slice(0, 3);

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  // Handle specialty filter selection
  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialties([]);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return dateStr; // Return original string if parsing fails
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12">
          <HeartPulseLoader size="lg" />
          <p className="mt-4 text-muted-foreground font-medium">Loading your appointments...</p>
          <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
        <div className="text-center py-12 border rounded-xl p-8 bg-muted/10">
          <h3 className="text-xl font-medium mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-6">We couldn't load your appointments due to a connection issue.</p>
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-normal font-poppins flex items-center">
          Appointments
          <CalendarClock className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>

      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/30 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-primary/70 mr-2" />
                <h2 className="text-xl font-medium">Your Medical Journey</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Track your healthcare appointments, review past consultations, and manage upcoming visits.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/80 backdrop-blur-sm border-border/30"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm">
                    <Filter className="h-4 w-4" />
                    Filter
                    {selectedSpecialties.length > 0 && (
                      <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {selectedSpecialties.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Specialty</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {specialties.map((specialty) => (
                    <DropdownMenuCheckboxItem
                      key={specialty}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    >
                      {specialty}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Clear Filters
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full sm:w-auto bg-muted/30 mb-6">
          <TabsTrigger 
            value="upcoming" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Upcoming Appointments
            {upcomingAppointments.length > 0 && (
              <span className="ml-2 bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Past Appointments
            {pastAppointments.length > 0 && (
              <span className="ml-2 bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {pastAppointments.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          <div className="space-y-4">
            {displayedUpcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-border/30 backdrop-blur-sm">
                No upcoming appointments found
              </div>
            ) : (
              <>
                {displayedUpcomingAppointments.map((appointment) => (
                  <GlassCard 
                    key={appointment.id}
                    className="p-0 cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                    variant="elevated"
                    borderEffect
                    onClick={() => openAppointmentDetails(appointment)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-primary/80" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium font-poppins">{appointment.doctor}</h3>
                            <p className="text-primary/80">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:bg-primary/10 transition-colors duration-200 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAppointmentDetails(appointment);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            <span>View Details</span>
                            <Sparkles className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 mt-4 text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <CalendarClock className="h-4 w-4 text-primary/70" />
                          <span>{formatDisplayDate(appointment.appointment_date || appointment.date || "")}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-primary/70" />
                          <span>{appointment.appointment_time || appointment.time}</span>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="mt-3 text-sm text-muted-foreground border-t pt-3 border-border/30">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))}
                
                {upcomingAppointments.length > 3 && !showAllAppointments && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllAppointments(true)}
                      className="group"
                    >
                      View All Appointments
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="mt-0">
          <div className="space-y-4">
            {displayedPastAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-border/30 backdrop-blur-sm">
                No past appointments found matching your search
              </div>
            ) : (
              <>
                {displayedPastAppointments.map((appointment) => (
                  <GlassCard 
                    key={appointment.id}
                    className="p-0 cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                    variant="elevated"
                    borderEffect
                    onClick={() => openAppointmentDetails(appointment)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-primary/80" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium font-poppins">{appointment.doctor}</h3>
                            <p className="text-primary/80">{appointment.specialty}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-primary/10 transition-colors duration-200 group"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAppointmentDetails(appointment);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>View Details</span>
                          <Sparkles className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-6 mt-4 text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <CalendarClock className="h-4 w-4 text-primary/70" />
                          <span>{formatDisplayDate(appointment.appointment_date || appointment.date || "")}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-primary/70" />
                          <span>{appointment.appointment_time || appointment.time}</span>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="mt-3 text-sm text-muted-foreground border-t pt-3 border-border/30">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))}
                
                {pastAppointments.length > 3 && !showAllAppointments && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllAppointments(true)}
                      className="group"
                    >
                      View All Appointments
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-3xl animate-in fade-in-0 zoom-in-90 bg-white/95 backdrop-blur-lg border border-border/30">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-medium font-poppins">Appointment Details</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedAppointment(null)}
              className="h-8 w-8 hover:bg-primary/5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {selectedAppointment && (
            <div className="space-y-6 pt-2 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg font-poppins">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
                
                <Badge 
                  className={cn(
                    "ml-auto",
                    selectedAppointment.status === "completed" && "bg-green-500/20 text-green-700 hover:bg-green-500/30",
                    selectedAppointment.status === "upcoming" && "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30",
                    selectedAppointment.status === "cancelled" && "bg-red-500/20 text-red-700 hover:bg-red-500/30",
                    selectedAppointment.status === "in_progress" && "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30",
                  )}
                >
                  {selectedAppointment.status === "in_progress" ? "In Progress" : 
                   selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </Badge>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <CalendarClock className="h-4 w-4 text-primary/70" />
                  <span>{formatDisplayDate(selectedAppointment.appointment_date || selectedAppointment.date || "")}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>{selectedAppointment.appointment_time || selectedAppointment.time}</span>
                </div>
              </div>

              {/* AI Triage Data Section */}
              <div className="bg-gradient-to-r from-health-50/30 to-health-100/20 border border-health-200/30 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">AI Triage Assessment</h3>
                </div>
                
                <div className="space-y-4">
                  {selectedAppointment.reason && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Reason for Visit</h4>
                      <p className="text-base">{selectedAppointment.reason}</p>
                    </div>
                  )}
                  
                  {selectedAppointment.ai_triage_data?.symptoms && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Reported Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAppointment.ai_triage_data.symptoms.map((symptom, i) => (
                          <Badge key={i} variant="outline" className="bg-primary/10 border-primary/20">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedAppointment.ai_triage_data?.duration && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                        <p>{selectedAppointment.ai_triage_data.duration}</p>
                      </div>
                    )}
                    
                    {selectedAppointment.ai_triage_data?.severity && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Severity</h4>
                        <p>{selectedAppointment.ai_triage_data.severity}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedAppointment.ai_triage_data?.additional_notes && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</h4>
                      <p className="text-sm bg-white/50 p-3 rounded-md border border-health-200/20">
                        {selectedAppointment.ai_triage_data.additional_notes}
                      </p>
                    </div>
                  )}

                  <Separator className="my-2" />
                  
                  {selectedAppointment.ai_triage_data?.preliminary_assessment && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Preliminary Assessment</h4>
                      <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-md">
                        <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
                        <p>{selectedAppointment.ai_triage_data.preliminary_assessment}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.ai_triage_data?.recommended_action && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Recommended Action</h4>
                      <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-md">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p>{selectedAppointment.ai_triage_data.recommended_action}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.ai_triage_data?.urgency_level && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Urgency Level</h4>
                      <Badge 
                        className={cn(
                          selectedAppointment.ai_triage_data.urgency_level === "low" && "bg-green-500/20 text-green-700",
                          selectedAppointment.ai_triage_data.urgency_level === "medium" && "bg-amber-500/20 text-amber-700",
                          selectedAppointment.ai_triage_data.urgency_level === "high" && "bg-red-500/20 text-red-700",
                        )}
                      >
                        {selectedAppointment.ai_triage_data.urgency_level === "high" && (
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        )}
                        {selectedAppointment.ai_triage_data.urgency_level.charAt(0).toUpperCase() + 
                         selectedAppointment.ai_triage_data.urgency_level.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedAppointment.summary && (
                <div className="bg-gradient-to-r from-health-50 to-medical-light border border-health-200/40 p-4 rounded-xl shadow-sm">
                  <h4 className="font-medium flex items-center gap-2 font-poppins text-primary">
                    <FileText className="h-4 w-4 text-medical-DEFAULT" />
                    Summary from Doctor
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">{selectedAppointment.summary}</p>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group shadow-md"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                  <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PastAppointmentsPage;
