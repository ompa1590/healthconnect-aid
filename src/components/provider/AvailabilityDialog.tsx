
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarClock, Plus, Clock, Trash, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface AvailabilitySlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (availability: AvailabilitySlot[]) => void;
  initialAvailability?: AvailabilitySlot[];
}

const AvailabilityDialog = ({
  isOpen,
  onClose,
  onSave,
  initialAvailability = []
}: AvailabilityDialogProps) => {
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>(
    initialAvailability.length > 0 
      ? initialAvailability 
      : [
          { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00" },
          { id: 2, day: "Tuesday", startTime: "09:00", endTime: "17:00" },
          { id: 3, day: "Wednesday", startTime: "09:00", endTime: "17:00" },
          { id: 4, day: "Thursday", startTime: "09:00", endTime: "17:00" },
          { id: 5, day: "Friday", startTime: "09:00", endTime: "15:00" },
        ]
  );

  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00"
  });

  const { toast } = useToast();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleAddSlot = () => {
    const newId = Math.max(0, ...availabilities.map(slot => slot.id)) + 1;
    setAvailabilities([...availabilities, { id: newId, ...newSlot }]);
  };

  const handleRemoveSlot = (id: number) => {
    setAvailabilities(availabilities.filter(slot => slot.id !== id));
  };

  const handleSave = () => {
    onSave(availabilities);
    toast({
      title: "Availability updated",
      description: "Your availability has been successfully updated.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Set Your Availability</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h3 className="text-lg font-medium mb-3">Current Availability</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {availabilities.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between bg-background p-3 rounded-md border border-border/30">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{slot.day}</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveSlot(slot.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h3 className="text-lg font-medium mb-3">Add New Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Day</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={newSlot.day}
                  onChange={e => setNewSlot({...newSlot, day: e.target.value})}
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Start Time</label>
                <Input 
                  type="time" 
                  value={newSlot.startTime}
                  onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Time</label>
                <Input 
                  type="time" 
                  value={newSlot.endTime}
                  onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleAddSlot}>
              <Plus className="mr-2 h-4 w-4" /> Add Time Slot
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;
