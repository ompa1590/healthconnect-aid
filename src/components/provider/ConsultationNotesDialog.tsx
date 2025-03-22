
import React, { useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import ConsultationDisplay from "./consultation/ConsultationDisplay";
import EditConsultationForm from "./consultation/EditConsultationForm";
import { supabase } from "@/integrations/supabase/client";

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
  appointment,
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

  // Add state for editing mode and confirmation
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  // Define the form initial data
  const formInitialData = {
    condition: mockConsultationData.condition,
    diagnosis: mockConsultationData.diagnosis,
    recommendations: mockConsultationData.recommendations.join("\n"),
    medications: mockConsultationData.medications.map(med => 
      `${med.name}, ${med.dosage}, ${med.notes}`).join("\n"),
    followUp: mockConsultationData.followUp,
    acknowledgment: false
  };

  // Handle saving to database
  const saveToDatabase = async (data) => {
    setIsSaving(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would actually save to Supabase or your backend
      // Example:
      // await supabase
      //   .from('consultation_notes')
      //   .upsert({ 
      //     appointment_id: appointment.id,
      //     patient_id: appointment.patientId,
      //     condition: data.condition,
      //     diagnosis: data.diagnosis,
      //     recommendations: data.recommendations.split('\n'),
      //     medications: data.medications.split('\n').map(med => {
      //       const [name, dosage, notes] = med.split(',').map(s => s.trim());
      //       return { name, dosage, notes };
      //     }),
      //     follow_up: data.followUp,
      //     reviewed: true,
      //     reviewed_at: new Date().toISOString()
      //   });
      
      console.log("Saved consultation notes:", data);
      toast.success("Consultation notes confirmed and saved successfully");
      setIsConfirmed(true);
      
      // Close the dialog after confirmation
      setTimeout(() => {
        onClose();
        setIsConfirmed(false);
        setIsEditing(false);
        setIsSaving(false);
        setIsAcknowledged(false);
      }, 1500);
    } catch (error) {
      console.error("Error saving consultation notes:", error);
      toast.error("Failed to save consultation notes");
      setIsSaving(false);
    }
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (!isAcknowledged) {
      toast.error("Please acknowledge the disclaimer before confirming");
      return;
    }
    
    saveToDatabase(formInitialData);
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    if (!data.acknowledgment) {
      toast.error("Please acknowledge the disclaimer before confirming");
      return;
    }
    
    saveToDatabase(data);
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const legalText = "I have reviewed these consultation notes and confirm their accuracy. I acknowledge that while Vyra Health's AI assists in documentation, I remain responsible for the medical content and any clinical decisions based on these notes. Vyra Health is not liable for any discrepancies in its AI-generated documentation.";

  // Patient and doctor info for components
  const patientInfo = {
    name: appointment.patient,
    id: appointment.patientId
  };

  const doctorInfo = {
    name: mockConsultationData.doctor,
    specialty: mockConsultationData.specialty
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
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
        
        <ScrollArea className="flex-1 px-1">
          <div className="p-1">
            {!isEditing ? (
              <ConsultationDisplay
                patient={patientInfo}
                appointment={appointment}
                doctor={doctorInfo}
                consultationData={mockConsultationData}
                isConfirmed={isConfirmed}
                isAcknowledged={isAcknowledged}
                onAcknowledgeChange={setIsAcknowledged}
                onConfirm={handleConfirm}
                onEditClick={toggleEditing}
                isSaving={isSaving}
                legalText={legalText}
              />
            ) : (
              <EditConsultationForm
                initialData={formInitialData}
                onCancel={toggleEditing}
                onSubmit={handleFormSubmit}
                isSaving={isSaving}
                legalText={legalText}
                patient={patientInfo}
                appointment={appointment}
                doctor={doctorInfo}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationNotesDialog;
