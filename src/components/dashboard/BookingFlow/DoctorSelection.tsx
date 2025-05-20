
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { useDoctors } from "@/hooks/useDoctors";
import DoctorCard from "./DoctorCard";
import DoctorSelectionLoading from "./DoctorSelectionLoading";

interface DoctorSelectionProps {
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string, doctorName: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const DoctorSelection = ({
  selectedDoctor,
  onSelectDoctor,
  onBack,
  onNext
}: DoctorSelectionProps) => {
  const { doctors, isLoading, error, refreshDoctors } = useDoctors();
  
  // Refresh the doctor list whenever this component is mounted
  useEffect(() => {
    refreshDoctors();
  }, [refreshDoctors]);
  
  const handleRefresh = () => {
    refreshDoctors();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium mb-2">Select a Specialist</h2>
          <p className="text-muted-foreground">Choose a healthcare provider for your appointment</p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefresh}
          title="Refresh doctor list"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <DoctorSelectionLoading />
      ) : error ? (
        <div className="text-center bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {doctors.length > 0 ? doctors.map(doctor => (
            <DoctorCard 
              key={doctor.id}
              doctor={doctor}
              isSelected={selectedDoctor === doctor.id}
              onSelect={onSelectDoctor}
            />
          )) : (
            <div className="col-span-2 text-center py-10 border border-dashed rounded-lg">
              No doctors available at the moment.
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!selectedDoctor}
          className="flex items-center"
        >
          Choose Time
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelection;
