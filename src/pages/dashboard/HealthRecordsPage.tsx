
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DocumentList from "@/components/dashboard/health-records/DocumentList";
import DocumentUploadDialog from "@/components/dashboard/health-records/DocumentUploadDialog";
import SummaryDialog from "@/components/dashboard/health-records/SummaryDialog";
import { parsePdfContent } from "@/utils/documentParser";

const HealthRecordsPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState<{[key: string]: boolean}>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Medical Report");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeDocumentSummary, setActiveDocumentSummary] = useState<string>("");
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryVerified, setSummaryVerified] = useState<{[key: string]: boolean}>({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setDocuments([]);
        return;
      }
      
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

      let documentSummary = "";
      if (fileExt?.toLowerCase() === 'pdf') {
        documentSummary = await parsePdfContent(selectedFile);
      }

      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: session.user.id,
          document_name: documentName.trim(),
          document_type: documentType,
          document_path: filePath,
          document_summary: documentSummary
        });

      if (error) {
        throw error;
      }

      await fetchDocuments();
      
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
      const { error: storageError } = await supabase
        .storage
        .from('medical_documents')
        .remove([path]);

      if (storageError) {
        throw storageError;
      }

      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

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

  const extractDocumentSummary = async (id: string, path: string, name: string) => {
    try {
      setIsExtracting({...isExtracting, [id]: true});
      
      const { data, error } = await supabase
        .storage
        .from('medical_documents')
        .download(path);

      if (error) {
        throw error;
      }

      // Fix the File constructor issue - use the Blob directly
      const fileBlob = new Blob([data]);
      const summary = await parsePdfContent(new File([fileBlob], name));
      
      // Update the document with the summary
      await supabase
        .from('user_documents')
        .update({
          document_summary: summary
        })
        .eq('id', id);

      setActiveDocumentSummary(summary);
      setShowSummaryDialog(true);
      
      toast({
        title: "Success",
        description: "Document summary extracted successfully",
      });
    } catch (error) {
      console.error("Error extracting document summary:", error);
      toast({
        title: "Error",
        description: "Failed to extract document summary",
        variant: "destructive",
      });
    } finally {
      setIsExtracting({...isExtracting, [id]: false});
    }
  };

  const verifyDocumentSummary = async () => {
    try {
      const docId = documents.find(doc => doc.document_summary === activeDocumentSummary)?.id;
      
      if (!docId) {
        throw new Error("Document not found");
      }
      
      // Update the document to mark summary as verified
      await supabase
        .from('user_documents')
        .update({
          summary_verified: true
        })
        .eq('id', docId);
      
      setSummaryVerified({...summaryVerified, [docId]: true});
      
      // Refresh documents to show the verified badge
      fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document summary verified",
      });
      
      setShowSummaryDialog(false);
    } catch (error) {
      console.error("Error verifying document summary:", error);
      toast({
        title: "Error",
        description: "Failed to verify document summary",
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
              <DocumentUploadDialog
                isUploading={isUploading}
                onUpload={uploadDocument}
                selectedFile={selectedFile}
                onFileChange={handleFileChange}
                documentName={documentName}
                onDocumentNameChange={(e) => setDocumentName(e.target.value)}
                documentType={documentType}
                onDocumentTypeChange={(e) => setDocumentType(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <DocumentList
                documents={documents}
                isLoading={isLoading}
                isExtracting={isExtracting}
                onExtractSummary={extractDocumentSummary}
                onDownload={downloadDocument}
                onDelete={deleteDocument}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                documentTypeFilter={documentTypeFilter}
                onDocumentTypeFilterChange={setDocumentTypeFilter}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
              />
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

      <SummaryDialog
        open={showSummaryDialog}
        onOpenChange={setShowSummaryDialog}
        summary={activeDocumentSummary}
        onVerify={verifyDocumentSummary}
      />
    </main>
  );
};

export default HealthRecordsPage;
