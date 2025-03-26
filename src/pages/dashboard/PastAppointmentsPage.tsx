
import React, { useState, useMemo } from "react";
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
  ChevronRight
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

type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
};

const PastAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };
  
  const allAppointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-04-15",
      time: "2:30 PM",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      date: "2024-05-03",
      time: "9:15 AM",
      status: "upcoming",
    },
    {
      id: 3,
      doctor: "Dr. James Wilson",
      specialty: "Cardiologist",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "completed",
      summary: "Follow-up after mild palpitations. ECG showed normal sinus rhythm.",
      recommendations: "Continue monitoring. Reduce caffeine intake.",
      medications: ["Propranolol 10mg as needed"],
      followUp: "Return in 3 months for follow-up ECG."
    },
    {
      id: 4,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      date: "2024-02-14",
      time: "10:00 AM",
      status: "completed",
      summary: "Annual check-up. All vitals within normal range.",
      recommendations: "Continue regular exercise and balanced diet.",
      medications: [],
      followUp: "Schedule next annual check-up in 12 months."
    },
    {
      id: 5,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-02-29",
      time: "2:30 PM",
      status: "completed",
      summary: "Patient presented with persistent rash on forearms. Diagnosed as contact dermatitis.",
      recommendations: "Avoid scented soaps and detergents. Apply prescribed hydrocortisone cream twice daily.",
      medications: ["Hydrocortisone 1% cream", "Cetirizine 10mg tablets"],
      followUp: "Return in 2 weeks if symptoms persist."
    },
    {
      id: 6,
      doctor: "Dr. Lisa Patel",
      specialty: "Endocrinologist",
      date: "2023-12-04",
      time: "1:15 PM",
      status: "completed",
      summary: "Thyroid function assessment. TSH slightly elevated.",
      recommendations: "Regular monitoring of thyroid function.",
      medications: ["Levothyroxine 25mcg daily"],
      followUp: "Blood work in 6 weeks to check medication efficacy."
    },
    {
      id: 7,
      doctor: "Dr. Robert Garcia",
      specialty: "Psychiatrist",
      date: "2023-11-09",
      time: "11:30 AM",
      status: "completed",
      summary: "Initial consultation for mild anxiety and sleep disturbance.",
      recommendations: "Practice recommended mindfulness techniques and sleep hygiene.",
      medications: ["Melatonin 3mg before bedtime as needed"],
      followUp: "Follow-up in 4 weeks to assess progress."
    }
  ];

  // Extract all unique specialties for the filter
  const specialties = useMemo(() => {
    return [...new Set(allAppointments.map(appointment => appointment.specialty))];
  }, [allAppointments]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    return allAppointments
      .filter(appointment => 
        (searchQuery === "" || 
         appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
         appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedSpecialties.length === 0 || 
         selectedSpecialties.includes(appointment.specialty))
      )
      .sort((a, b) => {
        // Sort by date (most recent first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [allAppointments, searchQuery, selectedSpecialties]);

  // Split appointments into upcoming and past
  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter(appointment => 
      appointment.status === "upcoming"
    );
  }, [filteredAppointments]);

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter(appointment => 
      appointment.status === "completed"
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

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return dateStr; // Return original string if parsing fails
    }
  };

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
                          <span>{formatDisplayDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-primary/70" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
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
                        >
                          <FileText className="h-4 w-4" />
                          <span>View Details</span>
                          <Sparkles className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-6 mt-4 text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <CalendarClock className="h-4 w-4 text-primary/70" />
                          <span>{formatDisplayDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4 text-primary/70" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
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
        <DialogContent className="max-w-md sm:max-w-lg animate-in fade-in-0 zoom-in-90 bg-white/95 backdrop-blur-lg border border-border/30">
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
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg font-poppins">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <CalendarClock className="h-4 w-4 text-primary/70" />
                  <span>{formatDisplayDate(selectedAppointment.date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>

              {selectedAppointment.status === "upcoming" ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                  <h4 className="font-medium flex items-center gap-2 font-poppins text-blue-700">
                    <CalendarClock className="h-4 w-4 text-blue-500" />
                    Upcoming Appointment
                  </h4>
                  <p className="text-sm text-blue-600 mt-2">
                    This appointment is scheduled for {formatDisplayDate(selectedAppointment.date)} at {selectedAppointment.time}.
                  </p>
                  <div className="pt-2 flex gap-2 mt-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Reschedule
                    </Button>
                    <Button variant="outline" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {selectedAppointment.summary && (
                    <div className="bg-gradient-to-r from-health-50 to-medical-light border border-health-200/40 p-4 rounded-xl shadow-sm">
                      <h4 className="font-medium flex items-center gap-2 font-poppins text-primary">
                        <FileText className="h-4 w-4 text-medical-DEFAULT" />
                        Summary
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">{selectedAppointment.summary}</p>
                    </div>
                  )}

                  {selectedAppointment.recommendations && (
                    <div className="bg-gradient-to-r from-wellness-light to-blue-50 border border-wellness-DEFAULT/20 p-4 rounded-xl shadow-sm">
                      <h4 className="font-medium flex items-center gap-2 font-poppins text-green-700">
                        <MessageSquareText className="h-4 w-4 text-wellness-DEFAULT" />
                        Recommendations
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">{selectedAppointment.recommendations}</p>
                    </div>
                  )}

                  {selectedAppointment.medications && selectedAppointment.medications.length > 0 && (
                    <div className="bg-gradient-to-r from-medical-light to-blue-50/50 border border-medical-DEFAULT/20 p-4 rounded-xl shadow-sm">
                      <h4 className="font-medium flex items-center gap-2 font-poppins text-blue-700">
                        <Pill className="h-4 w-4 text-medical-DEFAULT" />
                        Prescribed Medications
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground pl-1 mt-2">
                        {selectedAppointment.medications.map((medication, index) => (
                          <li key={index} className="mb-1">{medication}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAppointment.followUp && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-xl shadow-sm">
                      <h4 className="font-medium flex items-center gap-2 font-poppins text-indigo-700">
                        <CalendarClock className="h-4 w-4 text-indigo-500" />
                        Follow-up
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">{selectedAppointment.followUp}</p>
                    </div>
                  )}
                </>
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
