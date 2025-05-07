
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  User, 
  XCircle, 
  Edit, 
  Eye, 
  MessageSquare, 
  Phone, 
  Video 
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  status: string;
}

const ProviderAppointments = () => {
  // State variables
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch appointments when selected date changes
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        // Check authentication
        const { data: authData } = await supabase.auth.getSession();
        if (!authData.session) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view appointments",
            variant: "destructive"
          });
          return;
        }
        
        const providerId = authData.session.user.id;
        
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('provider_id', providerId)
          .eq('appointment_date', formattedDate)
          .order('appointment_time');
        
        if (error) {
          console.error('Error fetching appointments:', error);
          toast({
            title: "Error",
            description: "Failed to load appointments. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        setAppointments(data || []);
      } catch (error) {
        console.error('Error in fetchAppointments:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [selectedDate, toast]);
  
  // Handle appointment status change
  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);
      
      if (error) {
        console.error('Error updating appointment status:', error);
        toast({
          title: "Error",
          description: "Failed to update appointment status.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: newStatus } 
            : appointment
        )
      );
      
      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Upcoming</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Appointments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md p-3"
            />
          </CardContent>
        </Card>
        
        {/* Appointments List */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                <>Appointments for {format(selectedDate, 'MMMM d, yyyy')}</>
              ) : (
                <>Select a date</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No appointments scheduled for this date
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.appointment_time}</TableCell>
                      <TableCell>{appointment.patient_name}</TableCell>
                      <TableCell>{appointment.service_type}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointmentId(appointment.id);
                              setShowChartDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          
                          {appointment.status === 'upcoming' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'in_progress')}
                            >
                              <Video className="h-4 w-4 mr-1" /> Start
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Patient Chart Dialog */}
      <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Patient Chart</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedAppointmentId ? (
              <div className="grid gap-4">
                <div className="text-center">
                  Loading patient details...
                </div>
              </div>
            ) : (
              <div className="text-center">No appointment selected</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderAppointments;
