
import React from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProviders } from "@/hooks/useProviders";

interface DoctorSelectionProps {
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string) => void;
  selectedSpecialty: string | null;
  onSelectSpecialty: (specialty: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const DoctorSelection = ({ 
  selectedDoctor, 
  onSelectDoctor,
  selectedSpecialty,
  onSelectSpecialty,
  onBack, 
  onNext 
}: DoctorSelectionProps) => {
  const { providers, loading } = useProviders();
  
  // Get unique specialties
  const specialties = React.useMemo(() => {
    const allSpecialties = providers.flatMap(p => p.specializations || []);
    return [...new Set(allSpecialties)].filter(Boolean).sort();
  }, [providers]);
  
  // Get filtered doctors based on selected specialty
  const filteredDoctors = React.useMemo(() => {
    if (!selectedSpecialty) return providers;
    return providers.filter(p => 
      p.specializations?.includes(selectedSpecialty)
    );
  }, [providers, selectedSpecialty]);
  
  // Get selected doctor details
  const selectedDoctorDetails = React.useMemo(() => {
    return providers.find(p => p.id === selectedDoctor);
  }, [providers, selectedDoctor]);

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Specialty</label>
            {loading ? (
              <div className="h-10 bg-muted/30 animate-pulse rounded"></div>
            ) : (
              <Select value={selectedSpecialty || ""} onValueChange={onSelectSpecialty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Select Doctor</label>
            {loading ? (
              <div className="h-10 bg-muted/30 animate-pulse rounded"></div>
            ) : (
              <Select 
                value={selectedDoctor || ""} 
                onValueChange={onSelectDoctor}
                disabled={!selectedSpecialty || filteredDoctors.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue 
                    placeholder={selectedSpecialty 
                      ? filteredDoctors.length > 0 
                        ? "Select a doctor" 
                        : "No doctors available for this specialty" 
                      : "Select a specialty first"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.full_name || `${doctor.first_name} ${doctor.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="bg-muted/20 p-5 rounded-lg border border-muted/30">
          <h3 className="font-medium text-lg mb-4 flex items-center">
            <Stethoscope className="mr-2 h-5 w-5 text-primary/80" />
            Doctor Profile
          </h3>

          {selectedDoctor && selectedDoctorDetails ? (
            <div className="space-y-4">
              <div className="h-24 w-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-primary/80">
                  {selectedDoctorDetails.first_name?.[0]}{selectedDoctorDetails.last_name?.[0]}
                </span>
              </div>
              
              <h4 className="font-medium text-lg text-center">
                {selectedDoctorDetails.full_name || `${selectedDoctorDetails.first_name} ${selectedDoctorDetails.last_name}`}
              </h4>
              
              <div className="text-sm space-y-2">
                {selectedDoctorDetails.specializations?.map((specialty, index) => (
                  <div key={index} className="bg-primary/5 px-3 py-1.5 rounded-full inline-block mr-2 mb-2">
                    {specialty}
                  </div>
                ))}
                
                {selectedDoctorDetails.biography && (
                  <p className="mt-4 text-muted-foreground">{selectedDoctorDetails.biography}</p>
                )}
                
                {selectedDoctorDetails.provider_type && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Provider Type:</span> 
                    <span>{selectedDoctorDetails.provider_type}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Select a doctor to view their profile
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedDoctor} 
          className="group"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelection;
