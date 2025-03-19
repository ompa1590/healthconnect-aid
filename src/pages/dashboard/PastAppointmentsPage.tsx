
import React, { useState } from "react";
import { 
  CalendarClock, 
  Clock, 
  FileText, 
  MessageSquareText, 
  Pill, 
  User2, 
  X 
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "completed";
  summary?: string;
  recommendations?: string;
  medications?: string[];
  followUp?: string;
};

const PastAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const pastAppointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "February 29, 2024",
      time: "2:30 PM",
      status: "completed",
      summary: "Patient presented with persistent rash on forearms. Diagnosed as contact dermatitis.",
      recommendations: "Avoid scented soaps and detergents. Apply prescribed hydrocortisone cream twice daily.",
      medications: ["Hydrocortisone 1% cream", "Cetirizine 10mg tablets"],
      followUp: "Return in 2 weeks if symptoms persist."
    },
    {
      id: 2,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      date: "February 14, 2024",
      time: "10:00 AM",
      status: "completed",
      summary: "Annual check-up. All vitals within normal range.",
      recommendations: "Continue regular exercise and balanced diet.",
      medications: [],
      followUp: "Schedule next annual check-up in 12 months."
    },
    {
      id: 3,
      doctor: "Dr. James Wilson",
      specialty: "Cardiologist",
      date: "January 19, 2024",
      time: "3:45 PM",
      status: "completed",
      summary: "Follow-up after mild palpitations. ECG showed normal sinus rhythm.",
      recommendations: "Continue monitoring. Reduce caffeine intake.",
      medications: ["Propranolol 10mg as needed"],
      followUp: "Return in 3 months for follow-up ECG."
    },
    {
      id: 4,
      doctor: "Dr. Lisa Patel",
      specialty: "Endocrinologist",
      date: "December 4, 2023",
      time: "1:15 PM",
      status: "completed",
      summary: "Thyroid function assessment. TSH slightly elevated.",
      recommendations: "Regular monitoring of thyroid function.",
      medications: ["Levothyroxine 25mcg daily"],
      followUp: "Blood work in 6 weeks to check medication efficacy."
    },
    {
      id: 5,
      doctor: "Dr. Robert Garcia",
      specialty: "Psychiatrist",
      date: "November 9, 2023",
      time: "11:30 AM",
      status: "completed",
      summary: "Initial consultation for mild anxiety and sleep disturbance.",
      recommendations: "Practice recommended mindfulness techniques and sleep hygiene.",
      medications: ["Melatonin 3mg before bedtime as needed"],
      followUp: "Follow-up in 4 weeks to assess progress."
    }
  ];

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-normal mb-8">Past Appointments</h1>
      
      <div className="space-y-4">
        {pastAppointments.map((appointment) => (
          <div 
            key={appointment.id}
            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium">{appointment.doctor}</h3>
                <p className="text-primary/80">{appointment.specialty}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-primary/10 transition-colors duration-200"
                onClick={() => openAppointmentDetails(appointment)}
              >
                <FileText className="h-4 w-4" />
                View Details
              </Button>
            </div>
            
            <div className="flex gap-6 mt-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-md sm:max-w-lg animate-in fade-in-0 zoom-in-90">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-medium">Appointment Details</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedAppointment(null)}
              className="h-8 w-8"
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
                  <h3 className="font-medium text-lg">{selectedAppointment.doctor}</h3>
                  <p className="text-primary/80">{selectedAppointment.specialty}</p>
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>

              {selectedAppointment.summary && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.summary}</p>
                </div>
              )}

              {selectedAppointment.recommendations && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    Recommendations
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.recommendations}</p>
                </div>
              )}

              {selectedAppointment.medications && selectedAppointment.medications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
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

              {selectedAppointment.followUp && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Follow-up
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.followUp}</p>
                </div>
              )}

              <div className="pt-2">
                <Button 
                  className="w-full"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
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
