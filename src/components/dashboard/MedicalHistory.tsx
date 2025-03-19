
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Loader2, Upload, FileText, File } from "lucide-react";
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

const MedicalHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [pastTreatments, setPastTreatments] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Medical Report");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Medical Documents</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
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

        {documents.length === 0 ? (
          <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No documents yet</h3>
            <p className="text-muted-foreground mb-4">Upload your first medical document to keep track of your health records</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.document_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{doc.document_type}</Badge>
                      <span>
                        {new Date(doc.uploaded_at).toLocaleDateString()} 
                      </span>
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
      </div>

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
