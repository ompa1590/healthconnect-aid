
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MedicalHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [pastTreatments, setPastTreatments] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;
        
        const { data, error } = await supabase
          .from('medical_history')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setMedications(data.medications || []);
          setAllergies(data.allergies || []);
          setConditions(data.conditions || []);
          setPastTreatments(data.past_treatments || []);
        }
      } catch (error) {
        console.error("Error fetching medical history:", error);
        toast({
          title: "Error",
          description: "Failed to load your medical history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicalHistory();
  }, [toast]);
  
  const saveMedicalHistory = async () => {
    try {
      setIsSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }
      
      // Check if medical history record exists
      const { data: existingData, error: checkError } = await supabase
        .from('medical_history')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('medical_history')
          .update({
            medications,
            allergies,
            conditions,
            past_treatments: pastTreatments,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('medical_history')
          .insert({
            user_id: session.user.id,
            medications,
            allergies,
            conditions,
            past_treatments: pastTreatments,
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Your medical history has been updated",
      });
    } catch (error) {
      console.error("Error saving medical history:", error);
      toast({
        title: "Error",
        description: "Failed to save your medical history",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication("");
    }
  };
  
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };
  
  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };
  
  const addTreatment = () => {
    if (newTreatment.trim()) {
      setPastTreatments([...pastTreatments, newTreatment.trim()]);
      setNewTreatment("");
    }
  };
  
  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  
  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };
  
  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };
  
  const removeTreatment = (index: number) => {
    setPastTreatments(pastTreatments.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading your medical history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <div className="space-y-2">
          {medications.map((medication, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <span>{medication}</span>
              <Button size="sm" variant="ghost" onClick={() => removeMedication(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add medication" 
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <Button size="icon" variant="outline" onClick={addMedication}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Allergies</h3>
        <div className="space-y-2">
          {allergies.map((allergy, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <span>{allergy}</span>
              <Button size="sm" variant="ghost" onClick={() => removeAllergy(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add allergy" 
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <Button size="icon" variant="outline" onClick={addAllergy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Medical Conditions</h3>
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <span>{condition}</span>
              <Button size="sm" variant="ghost" onClick={() => removeCondition(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add condition" 
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCondition()}
            />
            <Button size="icon" variant="outline" onClick={addCondition}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Past Treatments or Surgeries</h3>
        <div className="space-y-2">
          {pastTreatments.map((treatment, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <span>{treatment}</span>
              <Button size="sm" variant="ghost" onClick={() => removeTreatment(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add past treatment" 
              value={newTreatment}
              onChange={(e) => setNewTreatment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTreatment()}
            />
            <Button size="icon" variant="outline" onClick={addTreatment}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button 
        className="w-full sm:w-auto" 
        onClick={saveMedicalHistory} 
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : "Save Changes"}
      </Button>
    </div>
  );
};

export default MedicalHistory;
