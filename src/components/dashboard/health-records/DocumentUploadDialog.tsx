
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";

interface DocumentUploadDialogProps {
  isUploading: boolean;
  onUpload: () => void;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  documentName: string;
  onDocumentNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  documentType: string;
  onDocumentTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isUploading,
  onUpload,
  selectedFile,
  onFileChange,
  documentName,
  onDocumentNameChange,
  documentType,
  onDocumentTypeChange
}) => {
  return (
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
              onChange={onDocumentNameChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentType" className="text-right">Type</Label>
            <select
              id="documentType"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={documentType}
              onChange={onDocumentTypeChange}
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
                onChange={onFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={onUpload} 
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
  );
};

export default DocumentUploadDialog;
