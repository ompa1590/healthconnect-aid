import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Loader2, Upload, FileText, File, Sparkles, ArrowLeft, Edit, Save, X, Heart, Pill, Activity, Clock, Cigarette, Wine, Scissors, Dna, Stethoscope, Users, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditingState {
  medications: boolean;
  allergies: boolean;
  conditions: boolean;
  treatments: boolean;
  lifestyle: boolean;
  surgeries: boolean;
  genetic: boolean;
  emergency: boolean;
}

const MedicalHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Existing medical data with dummy data
  const [medications, setMedications] = useState<string[]>([
    "Lisinopril 10mg - Once daily",
    "Metformin 500mg - Twice daily with meals",
    "Vitamin D3 1000IU - Once daily",
    "Aspirin 81mg - Once daily (low dose)"
  ]);
  const [allergies, setAllergies] = useState<string[]>([
    "Penicillin - Severe rash",
    "Shellfish - Anaphylaxis",
    "Latex - Contact dermatitis"
  ]);
  const [conditions, setConditions] = useState<string[]>([
    "Type 2 Diabetes - Diagnosed 2019",
    "Hypertension - Well controlled",
    "Seasonal Allergies"
  ]);
  const [pastTreatments, setPastTreatments] = useState<string[]>([
    "Physical Therapy for lower back pain (2023)",
    "Dental cleaning and filling (March 2024)",
    "Annual eye exam (January 2024)"
  ]);

  // New health categories with dummy data
  const [lifestyle, setLifestyle] = useState<string[]>([
    "Non-smoker (quit 5 years ago)",
    "Social drinker - 1-2 glasses wine per week",
    "Regular exercise - 3x weekly",
    "Balanced diet with occasional sweets"
  ]);
  const [surgeries, setSurgeries] = useState<string[]>([
    "Appendectomy - Age 25 (2010)",
    "Wisdom teeth removal - Age 22 (2007)",
    "Mole removal - Left shoulder (2021)"
  ]);
  const [genetic, setGenetic] = useState<string[]>([
    "Family history of heart disease (father)",
    "Family history of breast cancer (maternal grandmother)",
    "No known genetic disorders"
  ]);
  const [emergency, setEmergency] = useState<string[]>([
    "Emergency Contact: Jane Doe - Spouse - (555) 123-4567",
    "Blood Type: O+",
    "Preferred Hospital: City General Hospital"
  ]);

  // New item states
  const [newMedication, setNewMedication] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newLifestyle, setNewLifestyle] = useState("");
  const [newSurgery, setNewSurgery] = useState("");
  const [newGenetic, setNewGenetic] = useState("");
  const [newEmergency, setNewEmergency] = useState("");
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Medical Report");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<EditingState>({
    medications: false,
    allergies: false,
    conditions: false,
    treatments: false,
    lifestyle: false,
    surgeries: false,
    genetic: false,
    emergency: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate("/dashboard");
  };

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

        // Fetch user documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('user_documents')
          .select('*')
          .eq('user_id', session.user.id)
          .order('uploaded_at', { ascending: false });
          
        if (documentsError) {
          throw documentsError;
        }

        if (documentsData) {
          setDocuments(documentsData);
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
  
  // Add functions
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

  const addLifestyle = () => {
    if (newLifestyle.trim()) {
      setLifestyle([...lifestyle, newLifestyle.trim()]);
      setNewLifestyle("");
    }
  };

  const addSurgery = () => {
    if (newSurgery.trim()) {
      setSurgeries([...surgeries, newSurgery.trim()]);
      setNewSurgery("");
    }
  };

  const addGenetic = () => {
    if (newGenetic.trim()) {
      setGenetic([...genetic, newGenetic.trim()]);
      setNewGenetic("");
    }
  };

  const addEmergency = () => {
    if (newEmergency.trim()) {
      setEmergency([...emergency, newEmergency.trim()]);
      setNewEmergency("");
    }
  };
  
  // Remove functions
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

  const removeLifestyle = (index: number) => {
    setLifestyle(lifestyle.filter((_, i) => i !== index));
  };

  const removeSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const removeGenetic = (index: number) => {
    setGenetic(genetic.filter((_, i) => i !== index));
  };

  const removeEmergency = (index: number) => {
    setEmergency(emergency.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile || !documentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a document name and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${session.user.id}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('medical_documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        throw storageError;
      }

      // Create record in user_documents table
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: session.user.id,
          document_name: documentName.trim(),
          document_type: documentType,
          document_path: filePath
        });

      if (error) {
        throw error;
      }

      // Refresh document list
      const { data: documentsData, error: documentsError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('uploaded_at', { ascending: false });
        
      if (documentsError) {
        throw documentsError;
      }

      setDocuments(documentsData || []);
      setSelectedFile(null);
      setDocumentName("");
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (id: string, path: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('medical_documents')
        .remove([path]);

      if (storageError) {
        throw storageError;
      }

      // Delete record from database
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update documents state
      setDocuments(documents.filter(doc => doc.id !== id));

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('medical_documents')
        .download(path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const toggleEditing = (section: keyof EditingState) => {
    setEditing(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const MedicalSection = ({ 
    title, 
    icon: Icon, 
    items, 
    newItem, 
    setNewItem, 
    addItem, 
    removeItem, 
    editKey,
    placeholder,
    color = "blue"
  }: {
    title: string;
    icon: any;
    items: string[];
    newItem: string;
    setNewItem: (value: string) => void;
    addItem: () => void;
    removeItem: (index: number) => void;
    editKey: keyof EditingState;
    placeholder: string;
    color?: string;
  }) => (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
            {title}
            <Badge variant="outline" className="text-xs">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditing(editKey)}
            className="text-gray-500 hover:text-gray-700"
          >
            {editing[editKey] ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No {title.toLowerCase()} recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <span className="text-gray-700">{item}</span>
                {editing[editKey] && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {editing[editKey] && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Input 
              placeholder={placeholder}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="flex-1"
            />
            <Button size="sm" onClick={addItem} disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your medical history...</p>
        </div>
      </div>
    );
  }

  const totalItems = medications.length + allergies.length + conditions.length + pastTreatments.length + lifestyle.length + surgeries.length + genetic.length + emergency.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToHome}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Complete Medical Profile
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive health information and medical records</p>
          </div>
        </div>
        <Button 
          onClick={saveMedicalHistory} 
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{medications.length}</p>
              <p className="text-sm text-gray-600">Medications</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{conditions.length}</p>
              <p className="text-sm text-gray-600">Conditions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{surgeries.length}</p>
              <p className="text-sm text-gray-600">Surgeries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Medical Information */}
      <Tabs defaultValue="medical" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medical">Medical Information</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle & History</TabsTrigger>
          <TabsTrigger value="emergency">Emergency & Genetic</TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicalSection
              title="Current Medications"
              icon={Pill}
              items={medications}
              newItem={newMedication}
              setNewItem={setNewMedication}
              addItem={addMedication}
              removeItem={removeMedication}
              editKey="medications"
              placeholder="Add medication with dosage..."
              color="blue"
            />

            <MedicalSection
              title="Known Allergies"
              icon={AlertTriangle}
              items={allergies}
              newItem={newAllergy}
              setNewItem={setNewAllergy}
              addItem={addAllergy}
              removeItem={removeAllergy}
              editKey="allergies"
              placeholder="Add allergy and reaction..."
              color="orange"
            />

            <MedicalSection
              title="Medical Conditions"
              icon={Heart}
              items={conditions}
              newItem={newCondition}
              setNewItem={setNewCondition}
              addItem={addCondition}
              removeItem={removeCondition}
              editKey="conditions"
              placeholder="Add medical condition..."
              color="red"
            />

            <MedicalSection
              title="Past Treatments"
              icon={Stethoscope}
              items={pastTreatments}
              newItem={newTreatment}
              setNewItem={setNewTreatment}
              addItem={addTreatment}
              removeItem={removeTreatment}
              editKey="treatments"
              placeholder="Add past treatment..."
              color="green"
            />
          </div>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicalSection
              title="Lifestyle Factors"
              icon={Activity}
              items={lifestyle}
              newItem={newLifestyle}
              setNewItem={setNewLifestyle}
              addItem={addLifestyle}
              removeItem={removeLifestyle}
              editKey="lifestyle"
              placeholder="Add lifestyle information..."
              color="teal"
            />

            <MedicalSection
              title="Surgical History"
              icon={Scissors}
              items={surgeries}
              newItem={newSurgery}
              setNewItem={setNewSurgery}
              addItem={addSurgery}
              removeItem={removeSurgery}
              editKey="surgeries"
              placeholder="Add surgical procedure..."
              color="purple"
            />
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicalSection
              title="Family & Genetic History"
              icon={Dna}
              items={genetic}
              newItem={newGenetic}
              setNewItem={setNewGenetic}
              addItem={addGenetic}
              removeItem={removeGenetic}
              editKey="genetic"
              placeholder="Add family/genetic history..."
              color="indigo"
            />

            <MedicalSection
              title="Emergency Information"
              icon={Users}
              items={emergency}
              newItem={newEmergency}
              setNewItem={setNewEmergency}
              addItem={addEmergency}
              removeItem={removeEmergency}
              editKey="emergency"
              placeholder="Add emergency contact/info..."
              color="pink"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Documents Section - keeping the existing implementation */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="p-2 rounded-lg bg-purple-100">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              Medical Documents
              <Badge variant="outline" className="text-xs">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
              </Badge>
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Medical Document</DialogTitle>
                  <DialogDescription>
                    Upload reports, scans, or other medical documents to keep track of your health records.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentName" className="text-right">Name</Label>
                    <Input
                      id="documentName"
                      placeholder="Document name"
                      className="col-span-3"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentType" className="text-right">Type</Label>
                    <select
                      id="documentType"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <option value="Medical Report">Medical Report</option>
                      <option value="Lab Test">Lab Test</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Scan/Imaging">Scan/Imaging</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentFile" className="text-right">File</Label>
                    <div className="col-span-3">
                      <Input
                        id="documentFile"
                        type="file"
                        className="cursor-pointer"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={uploadDocument} 
                    disabled={isUploading || !selectedFile || !documentName.trim()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : "Upload"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600 mb-4">Upload your first medical document to keep track of your health records</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <File className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.document_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Badge variant="secondary" className="text-xs">{doc.document_type}</Badge>
                        <span>•</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadDocument(doc.document_path, doc.document_name)}
                    >
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteDocument(doc.id, doc.document_path)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalHistory;
