
import React from "react";
import { Pill } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  notes?: string;
}

interface MedicationsListProps {
  medications: Medication[];
}

const MedicationsList: React.FC<MedicationsListProps> = ({ medications }) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-2">
        <Pill className="h-4 w-4 text-indigo-500" />
        Prescribed Medications
      </h3>
      <div className="space-y-3">
        {medications.map((med, index) => (
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
  );
};

export default MedicationsList;
