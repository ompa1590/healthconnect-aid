
import React, { useState } from "react";
import { Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PatientHeader from "./PatientHeader";
import ConditionDetails from "./ConditionDetails";
import RecommendationsList from "./RecommendationsList";
import MedicationsList from "./MedicationsList";
import FollowUpInstructions from "./FollowUpInstructions";
import ConsultationConfirmation from "./ConsultationConfirmation";
import TranscriptDialog from "../TranscriptDialog";

interface Medication {
  name: string;
  dosage: string;
  notes?: string;
}

interface ConsultationDisplayProps {
  patient: {
    name: string;
    id: string;
  };
  appointment: {
    date: Date;
    time: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
  consultationData: {
    condition: string;
    diagnosis: string;
    recommendations: string[];
    medications: Medication[];
    followUp: string;
  };
  isConfirmed: boolean;
  isAcknowledged: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
  onConfirm: () => void;
  onEditClick: () => void;
  isSaving: boolean;
  legalText: string;
}

const ConsultationDisplay: React.FC<ConsultationDisplayProps> = ({
  patient,
  appointment,
  doctor,
  consultationData,
  isConfirmed,
  isAcknowledged,
  onAcknowledgeChange,
  onConfirm,
  onEditClick,
  isSaving,
  legalText,
}) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Patient and Appointment Details */}
      <div className="flex items-center justify-between">
        <PatientHeader
          patient={patient}
          appointment={appointment}
          doctor={doctor}
        />
        
        {!isConfirmed && (
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-center"
              onClick={() => setIsTranscriptOpen(true)}
            >
              <FileText className="h-4 w-4 mr-1" />
              View Transcript
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-center"
              onClick={onEditClick}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Notes
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Condition & Diagnosis */}
      <ConditionDetails
        condition={consultationData.condition}
        diagnosis={consultationData.diagnosis}
      />

      <Separator />

      {/* Recommendations */}
      <RecommendationsList recommendations={consultationData.recommendations} />

      {/* Medications */}
      <MedicationsList medications={consultationData.medications} />

      {/* Follow-up */}
      <FollowUpInstructions followUp={consultationData.followUp} />

      {/* Confirmation section */}
      {!isConfirmed && (
        <ConsultationConfirmation
          legalText={legalText}
          isAcknowledged={isAcknowledged}
          onAcknowledgeChange={onAcknowledgeChange}
          onConfirm={onConfirm}
          isSaving={isSaving}
        />
      )}

      {/* Transcript Dialog */}
      <TranscriptDialog 
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        patient={patient}
      />
    </div>
  );
};

export default ConsultationDisplay;
