
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, FileText, User, Pill, Clipboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock appointment data - in a real app, this would come from Supabase
const pastAppointments = [
  {
    id: "1",
    doctor: "Dr. Michael Chen",
    specialty: "Dermatologist",
    date: "2024-03-01",
    time: "2:30 PM",
    status: "completed",
    summary: "Patient presented with persistent rash on forearms. Diagnosed as contact dermatitis.",
    recommendations: "Avoid scented soaps and detergents. Apply prescribed hydrocortisone cream twice daily.",
    medications: ["Hydrocortisone 1% cream", "Cetirizine 10mg tablets"],
    followUp: "Return in 2 weeks if symptoms persist."
  },
  {
    id: "2",
    doctor: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2024-02-15",
    time: "10:00 AM",
    status: "completed",
    summary: "Annual physical examination. All vitals within normal ranges.",
    recommendations: "Continue regular exercise and balanced diet. Increase daily water intake.",
    medications: [],
    followUp: "Schedule next annual checkup in February 2025."
  },
  {
    id: "3",
    doctor: "Dr. James Wilson",
    specialty: "Cardiologist",
    date: "2024-01-20",
    time: "3:45 PM",
    status: "completed",
    summary: "Routine heart checkup. ECG showed normal sinus rhythm.",
    recommendations: "Continue with current medication regimen. Maintain low-sodium diet.",
    medications: ["Lisinopril 10mg", "Aspirin 81mg"],
    followUp: "Return for follow-up in 6 months."
  },
  {
    id: "4",
    doctor: "Dr. Lisa Patel",
    specialty: "Endocrinologist",
    date: "2023-12-05",
    time: "1:15 PM",
    status: "completed",
    summary: "Follow-up for thyroid function. TSH levels slightly elevated.",
    recommendations: "Increasing levothyroxine dosage from 75mcg to 88mcg daily.",
    medications: ["Levothyroxine 88mcg"],
    followUp: "Recheck thyroid levels in 8 weeks."
  },
  {
    id: "5",
    doctor: "Dr. Robert Garcia",
    specialty: "Psychiatrist",
    date: "2023-11-10",
    time: "11:30 AM",
    status: "completed",
    summary: "Monthly check-in. Patient reports improved sleep patterns and reduced anxiety.",
    recommendations: "Continue with current therapy and medication plan.",
    medications: ["Sertraline 50mg"],
    followUp: "Next session scheduled for December 8."
  }
];

const PastAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<typeof pastAppointments[0] | null>(null);

  const handleOpenDetails = (appointment: typeof pastAppointments[0]) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-normal mb-6">Past Appointments</h1>
      
      <div className="space-y-4">
        {pastAppointments.map((appointment) => (
          <Card key={appointment.id} className="border-muted/50 hover:shadow-sm transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">{appointment.doctor}</h3>
                  <p className="text-primary/80">{appointment.specialty}</p>
                  
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4" />
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenDetails(appointment)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Appointment Details Dialog */}
      <Dialog open={selectedAppointment !== null} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 py-2">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-primary" />
                  Summary
                </h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.summary}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Recommendations
                </h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.recommendations}</p>
              </div>
              
              {selectedAppointment.medications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    Prescribed Medications
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground pl-1">
                    {selectedAppointment.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Follow-up
                </h4>
                <p className="text-sm text-muted-foreground">{selectedAppointment.followUp}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PastAppointmentsPage;
