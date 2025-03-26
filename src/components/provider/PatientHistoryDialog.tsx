
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, FileText, Pill, AlertCircle, History, Clock } from "lucide-react";

type Appointment = {
  date: Date;
  reason: string;
  provider: string;
  notes?: string;
};

type PatientHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: {
    id: string;
    name: string;
    appointmentType?: string;
    medications?: string[];
    conditions?: string[];
    allergies?: string[];
    pastAppointments?: Appointment[];
  } | null;
};

const PatientHistoryDialog: React.FC<PatientHistoryDialogProps> = ({
  open,
  onOpenChange,
  patient
}) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {patient.name}'s Medical History
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>
            Review the patient's comprehensive medical history and past appointments
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="summary" className="flex-1 flex flex-col mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="appointments">Past Appointments</TabsTrigger>
            <TabsTrigger value="conditions">Conditions & Allergies</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="summary" className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-background/50">
                  <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                    <Pill className="h-4 w-4 text-blue-500" />
                    Current Medications
                  </h3>
                  {patient.medications && patient.medications.length > 0 ? (
                    <ul className="space-y-2">
                      {patient.medications.map((med, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No current medications</p>
                  )}
                </div>

                <div className="border rounded-lg p-4 bg-background/50">
                  <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Allergies
                  </h3>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, i) => (
                        <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No known allergies</p>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Medical Conditions
                </h3>
                {patient.conditions && patient.conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((condition, i) => (
                      <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No known conditions</p>
                )}
              </div>

              <div className="border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="text-sm border-l-2 border-indigo-200 pl-3">
                    <p className="font-medium">Last appointment</p>
                    <p className="text-muted-foreground">
                      {patient.pastAppointments && patient.pastAppointments.length > 0
                        ? new Date(patient.pastAppointments[0].date).toLocaleDateString()
                        : "No recent appointments"}
                    </p>
                  </div>
                  <div className="text-sm border-l-2 border-indigo-200 pl-3">
                    <p className="font-medium">Next scheduled appointment</p>
                    <p className="text-muted-foreground">None scheduled</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4 p-1">
              {patient.pastAppointments && patient.pastAppointments.length > 0 ? (
                <div className="space-y-3">
                  {patient.pastAppointments.map((appointment, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-background/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant="outline">{appointment.reason}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Provider: {appointment.provider}
                      </p>
                      {appointment.notes && (
                        <div className="mt-2 text-sm border-l-2 border-primary/30 pl-3">
                          <p className="font-medium">Notes</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium">No appointment history</p>
                  <p className="text-sm text-muted-foreground">
                    This patient hasn't had any appointments yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4 p-1">
              <div className="border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Medical Conditions
                </h3>
                {patient.conditions && patient.conditions.length > 0 ? (
                  <div className="space-y-3">
                    {patient.conditions.map((condition, i) => (
                      <div key={i} className="border-l-2 border-emerald-200 pl-3">
                        <p className="font-medium">{condition}</p>
                        <p className="text-sm text-muted-foreground">Diagnosed: Unknown</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known medical conditions</p>
                )}
              </div>

              <div className="border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Allergies
                </h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="space-y-3">
                    {patient.allergies.map((allergy, i) => (
                      <div key={i} className="border-l-2 border-amber-200 pl-3">
                        <p className="font-medium">{allergy}</p>
                        <p className="text-sm text-muted-foreground">Severity: Unknown</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known allergies</p>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHistoryDialog;
