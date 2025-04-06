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
import { FileText, History, Sparkles, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useNavigate } from "react-router-dom";

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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      setIsExtracting({ ...isExtracting, [id]: true });
  
      // Download the file from storage (needed if summary isn’t cached)
      const { data, error } = await supabase
        .storage
        .from('medical_documents')
        .download(path);
  
      if (error) {
        throw error;
      }
  
      const fileBlob = new Blob([data]);
      const file = new File([fileBlob], name);
  
      // Pass the id as fileId to parsePdfContent
      console.log(`Calling parsePdfContent with file: ${name}, fileId: ${id}`);
      const summary = await parsePdfContent(file, id);
  
      // Update the document with the summary (parsePdfContent already handles this, but we’ll keep it for UI consistency)
      await supabase
        .from('user_documents')
        .update({
          document_summary: summary,
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
      setIsExtracting({ ...isExtracting, [id]: false });
    }
  };
  const verifyDocumentSummary = async () => {
    try {
      const docId = documents.find(doc => doc.document_summary === activeDocumentSummary)?.id;
      
      if (!docId) {
        throw new Error("Document not found");
      }
      
      await supabase
        .from('user_documents')
        .update({
          summary_verified: true
        })
        .eq('id', docId);
      
      setSummaryVerified({...summaryVerified, [docId]: true});
      
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

  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="back" 
          size="sm" 
          onClick={handleBackToHome}
          className="mr-4 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-normal flex items-center">
          Health Records
          <FileText className="ml-2 h-6 w-6 text-primary/70" />
        </h1>
      </div>
      
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100/30 to-health-50/20"></div>
        <div className="relative p-6 border border-health-200/30">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 text-primary/70 mr-2" />
            <h2 className="text-xl font-medium">Your Health Documents</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Securely store and access all your medical records, test results, and healthcare documents in one place.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-6 bg-white/70 backdrop-blur-sm p-1 rounded-lg border border-border/30">
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <FileText className="h-4 w-4 mr-2" />
            Medical Documents
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <History className="h-4 w-4 mr-2" />
            Health History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="animate-fade-in">
          <GlassCard className="rounded-xl shadow-sm" variant="elevated">
            <div className="flex flex-row items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium mb-1 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary/70" />
                  Your Medical Documents
                </h2>
                <p className="text-muted-foreground">
                  Access and upload your medical reports, test results, and other health documents
                </p>
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
            </div>
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
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="history" className="animate-fade-in">
          <GlassCard className="rounded-xl shadow-sm" variant="colored" borderEffect>
            <h2 className="text-xl font-medium mb-4 flex items-center">
              <History className="mr-2 h-5 w-5 text-primary/70" />
              Medical History
            </h2>
            <p className="text-muted-foreground mb-4">
              View and update your detailed medical history. This information helps doctors provide better care.
            </p>
            
            <div className="border rounded-md p-4 text-center bg-white/50">
              <p className="text-gray-500">Your health history records will appear here after completing your profile.</p>
              <Button className="mt-4 group" asChild>
                <a href="/dashboard/medical-history">
                  Go to Medical History
                  <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </Button>
            </div>
          </GlassCard>
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
