import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  File, 
  FileSearch, 
  Download, 
  Trash, 
  Loader2, 
  Search, 
  Filter, 
  Calendar, 
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

interface DocumentListProps {
  documents: any[];
  isLoading: boolean;
  isExtracting: { [key: string]: boolean };
  onExtractSummary: (id: string, path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
  onDelete: (id: string, path: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  documentTypeFilter?: string;
  onDocumentTypeFilterChange?: (type: string) => void;
  dateFilter?: string;
  onDateFilterChange?: (date: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isExtracting,
  onExtractSummary,
  onDownload,
  onDelete,
  searchTerm = "",
  onSearchChange = () => {},
  documentTypeFilter = "all",
  onDocumentTypeFilterChange = () => {},
  dateFilter = "all",
  onDateFilterChange = () => {},
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique document types from documents
  const documentTypes = ["all", ...Array.from(new Set(documents.map(doc => doc.document_type)))];

  // Filter documents based on search term, document type, and date
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === "" || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = documentTypeFilter === "all" || 
      doc.document_type === documentTypeFilter;
    
    const matchesDate = dateFilter === "all" || (() => {
      const docDate = new Date(doc.uploaded_at);
      const currentMonth = docDate.getMonth();
      const currentYear = docDate.getFullYear();
      
      if (dateFilter === "last30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return docDate >= thirtyDaysAgo;
      } else if (dateFilter === "last90days") {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return docDate >= ninetyDaysAgo;
      } else if (dateFilter === "thisMonth") {
        const now = new Date();
        return currentMonth === now.getMonth() && currentYear === now.getFullYear();
      } else if (dateFilter === "lastMonth") {
        const now = new Date();
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return currentMonth === lastMonth && currentYear === lastMonthYear;
      } else if (dateFilter === "thisYear") {
        const now = new Date();
        return currentYear === now.getFullYear();
      }
      return true;
    })();
    
    return matchesSearch && matchesType && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading your documents...</span>
      </div>
    );
  }

  const clearFilters = () => {
    onSearchChange("");
    onDocumentTypeFilterChange("all");
    onDateFilterChange("all");
  };

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
      {/* Search and filter section */}
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1.5 h-7 w-7 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="p-3 border rounded-md bg-card">
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="flex-1">
                <label className="text-xs font-medium block mb-1">Document Type</label>
                <Select 
                  value={documentTypeFilter} 
                  onValueChange={onDocumentTypeFilterChange}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-medium block mb-1">Date</label>
                <Select 
                  value={dateFilter} 
                  onValueChange={onDateFilterChange}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 md:mt-0 flex">
                <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center text-xs">
                  <X className="h-3 w-3 mr-1" /> Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No matching documents</h3>
            <p className="text-muted-foreground mb-4">Try different search terms or clear filters</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <p>Showing {filteredDocuments.length} of {documents.length} documents</p>
        )}
      </div>

      {/* Document list */}
      {filteredDocuments.length > 0 && (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{doc.document_name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{doc.document_type}</Badge>
                    <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
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
      )}
    </div>
  );
};

export default DocumentList;