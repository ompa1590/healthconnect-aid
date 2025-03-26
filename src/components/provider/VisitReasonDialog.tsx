
import React from "react";
import { AlertCircle, FileText, Pill, Stethoscope, ClipboardList, Check } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

const formatReasonPoints = (reason: string): string[] => {
  // Split the text into sentences
  const sentences = reason.split(/(?<=\.)\s+/);
  // Filter out empty strings and trim each sentence
  return sentences.filter(sentence => sentence.trim().length > 0).map(sentence => sentence.trim());
};

const VisitReasonDialog: React.FC<VisitReasonDialogProps> = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  const visitReason = appointment.visitReason || defaultVisitReason;
  const { conditions, allergies, medications } = extractMedicalInfo(visitReason);
  const reasonPoints = formatReasonPoints(visitReason);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader className="bg-gradient-to-r from-primary/5 to-blue-100/70 rounded-t-lg p-4 -mt-6 -mx-6 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/20 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">Visit Reason</DialogTitle>
          </div>
          <DialogDescription className="text-base font-medium text-primary/90">
            {appointment.appointmentType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="flex items-center p-3 mb-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <Avatar className="h-14 w-14 mr-4 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {appointment.patientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-primary/90">{appointment.patientName}</h3>
              <p className="text-sm text-primary/70 font-medium">{appointment.patientId}</p>
            </div>
          </div>
          
          <div className="rounded-lg border border-blue-100 bg-white p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-lg text-primary/90">Reason for Visit</h3>
            </div>
            <div className="space-y-2 pl-1">
              {reasonPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 group">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {conditions.length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-blue-100">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-sm text-blue-800">Relevant Conditions</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0.5 px-1.5 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {medications.length > 0 && (
              <div className="rounded-lg border border-green-200 bg-gradient-to-br from-white to-green-50 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-green-100">
                  <Pill className="h-4 w-4 text-green-600" />
                  <h3 className="font-medium text-sm text-green-800">Current Medications</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0.5 px-1.5 bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {allergies.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-gradient-to-br from-white to-red-50 p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <h3 className="font-medium text-sm text-red-800">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0.5 px-1.5 bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-100">
              <Stethoscope className="h-5 w-5 text-amber-600" />
              <h3 className="font-medium text-amber-800">Recommended Focus Areas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Based on the patient's symptoms and history, consider focusing on:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 p-2 rounded-md bg-amber-50 hover:bg-amber-100 transition-colors">
                <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 font-semibold text-sm">1</div>
                <span className="text-amber-900">Evaluate for migraine vs. tension headache, considering patient's history of migraines</span>
              </li>
              <li className="flex items-start gap-3 p-2 rounded-md bg-amber-50 hover:bg-amber-100 transition-colors">
                <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 font-semibold text-sm">2</div>
                <span className="text-amber-900">Assess medication efficacy for current thyroid management</span>
              </li>
              <li className="flex items-start gap-3 p-2 rounded-md bg-amber-50 hover:bg-amber-100 transition-colors">
                <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 font-semibold text-sm">3</div>
                <span className="text-amber-900">Discuss stress management techniques and sleep hygiene</span>
              </li>
            </ul>
          </div>
          
          <Separator className="my-5" />
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-primary/20 hover:bg-primary/5">Close</Button>
            <Button className="bg-primary hover:bg-primary/90 shadow-sm">
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
