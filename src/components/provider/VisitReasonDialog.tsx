
import React from "react";
import { FileText, AlertCircle, Pill, Stethoscope, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { extractMedicalInfo } from "@/utils/medicalExtractor";

interface VisitReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    patientName: string;
    patientId: string;
    appointmentType: string;
    date: Date;
    time: string;
    visitReason?: string;
  };
}

const defaultVisitReason = `Patient reports experiencing persistent headaches for the past two weeks, with pain primarily concentrated in the frontal and temporal regions. The headaches are described as throbbing and rate 6-7/10 in intensity. Patient has tried over-the-counter pain relievers (ibuprofen) with only temporary relief. Reports increased stress at work and changes in sleep patterns. No fever, visual changes, or neck stiffness. Has history of migraines and is allergic to penicillin. Currently taking levothyroxine for hypothyroidism.`;

const VisitReasonDialog: React.FC<VisitReasonDialogProps> = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  const visitReason = appointment.visitReason || defaultVisitReason;
  const { conditions, allergies, medications } = extractMedicalInfo(visitReason);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>Visit Reason</DialogTitle>
          </div>
          <DialogDescription className="text-base font-medium">
            {appointment.appointmentType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.patientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">{appointment.patientId}</p>
            </div>
          </div>
          
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Reason for Visit</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{visitReason}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {conditions.length > 0 && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Relevant Conditions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {medications.length > 0 && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Current Medications</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {allergies.length > 0 && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Recommended Focus Areas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Based on the patient's symptoms and history, consider focusing on:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <span>Evaluate for migraine vs. tension headache, considering patient's history of migraines</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <span>Assess medication efficacy for current thyroid management</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <span>Discuss stress management techniques and sleep hygiene</span>
              </li>
            </ul>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Prepare Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitReasonDialog;
