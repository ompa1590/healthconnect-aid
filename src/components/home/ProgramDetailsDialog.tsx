
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

interface Program {
  id: number;
  tag: string;
  title: string;
  description: string;
  details: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  features?: string[];
  benefits?: string[];
}

interface ProgramDetailsDialogProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProgramDetailsDialog = ({
  program,
  open,
  onOpenChange,
}: ProgramDetailsDialogProps) => {
  if (!program) return null;

  const Icon = program.icon;
  
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full p-3 bg-muted w-12 h-12 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Badge className="mb-1">{program.tag}</Badge>
              <DialogTitle className="text-2xl">{program.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative h-[200px] rounded-md overflow-hidden mt-2">
            <img 
              src={program.image} 
              alt={program.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <p className="text-muted-foreground">{program.details}</p>
          
          {program.features && program.features.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-medium">Program Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {program.benefits && program.benefits.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-medium">Program Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {program.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleEnroll}>
              Enroll in Program
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailsDialog;
