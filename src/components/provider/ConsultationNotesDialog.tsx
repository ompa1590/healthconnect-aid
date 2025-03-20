
import React from "react";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  ListChecks, 
  Pill, 
  CalendarClock, 
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ConsultationNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    patient: string;
    patientId: string;
    reason: string;
    date: Date;
    time: string;
  };
}

const ConsultationNotesDialog: React.FC<ConsultationNotesDialogProps> = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  // This would come from an API in a real app
  const mockConsultationData = {
    doctor: "Dr. Michael Chen",
    specialty: "Dermatologist",
    condition: "Patient presented with a persistent rash on their forearms that has been present for approximately two weeks. The affected area shows signs of inflammation with minimal scaling. Patient reports mild itching, particularly at night, and has tried over-the-counter hydrocortisone with limited success.",
    diagnosis: "Contact dermatitis, likely triggered by a new laundry detergent the patient began using three weeks ago.",
    recommendations: [
      "Switch to fragrance-free, hypoallergenic laundry products",
      "Avoid hot water when washing the affected area",
      "Apply a cool compress to reduce inflammation as needed",
      "Minimize exposure to potential irritants such as household cleaners without gloves"
    ],
    medications: [
      {
        name: "Triamcinolone 0.1% cream",
        dosage: "Apply a thin layer to affected areas twice daily for 7 days",
        notes: "If no improvement after 7 days, discontinue use and follow up"
      },
      {
        name: "Oral Antihistamine (Cetirizine 10mg)",
        dosage: "Take one tablet daily as needed for itching",
        notes: "May cause drowsiness; take at bedtime if this occurs"
      }
    ],
    followUp: "Schedule a follow-up appointment in two weeks if symptoms persist. If the rash spreads or worsens significantly, contact the office immediately for an earlier appointment."
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>Consultation Notes</DialogTitle>
          </div>
          <DialogDescription className="text-base font-medium">
            AI-generated summary of the consultation
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2 space-y-5">
          {/* Patient and Appointment Details */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Patient Info */}
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {appointment.patient.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{appointment.patient}</h3>
                <p className="text-sm text-muted-foreground">{appointment.patientId}</p>
              </div>
            </div>
            
            {/* Doctor & Time Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4 text-primary" />
                <span className="font-medium">{mockConsultationData.doctor}</span>
                <Badge variant="outline" className="ml-1">
                  {mockConsultationData.specialty}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{appointment.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Condition & Diagnosis */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Presenting Condition
              </h3>
              <p className="text-sm leading-relaxed">{mockConsultationData.condition}</p>
            </div>
            
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-1">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                Diagnosis
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {mockConsultationData.diagnosis}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Recommendations */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <ListChecks className="h-4 w-4 text-green-500" />
              Recommendations
            </h3>
            <ul className="text-sm space-y-2">
              {mockConsultationData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                    {index + 1}
                  </div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Medications */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Pill className="h-4 w-4 text-indigo-500" />
              Prescribed Medications
            </h3>
            <div className="space-y-3">
              {mockConsultationData.medications.map((med, index) => (
                <div key={index} className="border rounded-md p-3">
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm my-1">{med.dosage}</p>
                  {med.notes && (
                    <p className="text-xs text-muted-foreground">{med.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Follow-up */}
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Follow-up Instructions
            </h3>
            <p className="text-sm">{mockConsultationData.followUp}</p>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogClose>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Print Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationNotesDialog;
