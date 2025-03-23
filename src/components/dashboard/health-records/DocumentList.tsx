
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileSearch, Download, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentListProps {
  documents: any[];
  isLoading: boolean;
  isExtracting: {[key: string]: boolean};
  onExtractSummary: (id: string, path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
  onDelete: (id: string, path: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isExtracting,
  onExtractSummary,
  onDownload,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading your documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
        <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-1">No documents yet</h3>
        <p className="text-muted-foreground mb-4">Upload your first medical document to keep track of your health records</p>
      </div>
    );
  }

  return (
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
                {doc.summary_verified && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Summary Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => onExtractSummary(doc.id, doc.document_path, doc.document_name)}
              disabled={isExtracting[doc.id]}
            >
              {isExtracting[doc.id] ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <FileSearch className="h-3 w-3" />
              )}
              Summary
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDownload(doc.document_path, doc.document_name)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onDelete(doc.id, doc.document_path)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
