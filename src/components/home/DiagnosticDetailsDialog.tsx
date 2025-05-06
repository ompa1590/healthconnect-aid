
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Diagnostic {
  id: number;
  title: string;
  description: string;
  tags: string[];
  isAvailable: boolean;
  comingSoon?: boolean;
  benefits?: string[];
  features?: string[];
  link: string;
}

interface DiagnosticDetailsDialogProps {
  diagnostic: Diagnostic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiagnosticDetailsDialog = ({
  diagnostic,
  open,
  onOpenChange,
}: DiagnosticDetailsDialogProps) => {
  if (!diagnostic) return null;

  const handleSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };
  
  const isAvailable = diagnostic.isAvailable;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <div className="flex items-center gap-3">
            {diagnostic.comingSoon && (
              <Badge className="bg-blue-500 text-white">Coming Soon</Badge>
            )}
            <DialogTitle className="text-2xl">{diagnostic.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">{diagnostic.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {diagnostic.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>
          
          {diagnostic.features && diagnostic.features.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-medium">What's Included</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diagnostic.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {diagnostic.benefits && diagnostic.benefits.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-medium">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {diagnostic.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSchedule}
              disabled={!isAvailable}
            >
              {isAvailable ? "Schedule Test" : "Notify Me When Available"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticDetailsDialog;
