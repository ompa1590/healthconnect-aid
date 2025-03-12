
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const MedicalHistory = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Medication name" />
            <Input placeholder="Dosage" className="w-32" />
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Allergies</h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Add allergy" />
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Medical Conditions</h3>
        <Textarea
          placeholder="List any chronic conditions, previous surgeries, or other relevant medical history"
          className="min-h-[100px]"
        />
      </div>

      <Button>Save Changes</Button>
    </div>
  );
};

export default MedicalHistory;
