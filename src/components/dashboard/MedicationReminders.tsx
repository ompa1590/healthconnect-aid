
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Bell, Calendar, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for medication reminders
const mockMedications = [
  {
    id: 1,
    name: "Tacrolimus Ointment",
    dosage: "0.1%",
    schedule: "Twice daily",
    nextDose: "Today, 8:00 PM",
    remindersEnabled: true
  },
  {
    id: 2,
    name: "Hydrocortisone Cream",
    dosage: "1%",
    schedule: "As needed for flare-ups",
    nextDose: "As needed",
    remindersEnabled: false
  },
  {
    id: 3,
    name: "Cetirizine",
    dosage: "10mg",
    schedule: "Once daily",
    nextDose: "Tomorrow, 9:00 AM",
    remindersEnabled: true,
    renewalDue: "5 days"
  }
];

const MedicationReminders = () => {
  const [medications, setMedications] = useState(mockMedications);
  const { toast } = useToast();
  
  const toggleReminder = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? {...med, remindersEnabled: !med.remindersEnabled} : med
    ));
    
    const medication = medications.find(med => med.id === id);
    
    toast({
      title: `Reminders ${!medication.remindersEnabled ? 'enabled' : 'disabled'}`,
      description: `Reminders for ${medication.name} have been ${!medication.remindersEnabled ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleSaveReminderSettings = () => {
    toast({
      title: "Reminder settings saved",
      description: "Your medication reminder preferences have been updated."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medication Reminders</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Configure Reminders</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reminder Settings</DialogTitle>
              <DialogDescription>
                Configure how and when you receive medication reminders.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-method">Reminder Method</Label>
                <Select defaultValue="push">
                  <SelectTrigger id="reminder-method">
                    <SelectValue placeholder="Select reminder method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push Notifications</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="all">All Methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Select reminder time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="renewal-reminders" className="flex-1">
                  Prescription renewal reminders
                </Label>
                <Switch id="renewal-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="missed-dose" className="flex-1">
                  Missed dose reminders
                </Label>
                <Switch id="missed-dose" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveReminderSettings}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {medications.map((med) => (
          <Card key={med.id} className={med.renewalDue ? "border-yellow-200 bg-yellow-50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">{med.dosage} - {med.schedule}</p>
                  
                  {med.nextDose !== "As needed" && (
                    <div className="flex items-center mt-2 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      Next dose: {med.nextDose}
                    </div>
                  )}
                  
                  {med.renewalDue && (
                    <div className="flex items-center mt-2 text-sm text-yellow-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Renewal due in {med.renewalDue}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`reminder-${med.id}`}
                    checked={med.remindersEnabled}
                    onCheckedChange={() => toggleReminder(med.id)}
                  />
                  <Label htmlFor={`reminder-${med.id}`} className="sr-only">
                    Enable reminders
                  </Label>
                </div>
              </div>
              
              {med.renewalDue && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    Request Renewal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {medications.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No medications to display</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicationReminders;
