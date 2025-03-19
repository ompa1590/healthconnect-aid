
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { File, FileText, Upload, Loader2, Download, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const HealthRecordsPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Medical Report");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setDocuments([]);
          return;
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
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to load your documents",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [toast]);

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

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-normal mb-6">Health Records</h1>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="documents">Medical Documents</TabsTrigger>
          <TabsTrigger value="history">Health History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <Card className="border rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Medical Documents</CardTitle>
                <CardDescription>
                  Access and upload your medical reports, test results, and other health documents
                </CardDescription>
              </div>
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
                    <Button variant="outline">Cancel</Button>
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
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading your documents...</span>
                </div>
              ) : documents.length === 0 ? (
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
                          <Download className="h-4 w-4 mr-1" />
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
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Medical History</h2>
              <p className="text-muted-foreground mb-4">
                View and update your detailed medical history. This information helps doctors provide better care.
              </p>
              
              <div className="border rounded-md p-4 text-center">
                <p className="text-gray-500">Your health history records will appear here after completing your profile.</p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard/medical-history">Go to Medical History</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default HealthRecordsPage;
