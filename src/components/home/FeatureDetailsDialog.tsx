
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
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: string;
  color: string;
  details?: string;
  benefits?: string[];
  features?: string[];
}

interface FeatureDetailsDialogProps {
  feature: Feature | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeatureDetailsDialog = ({
  feature,
  open,
  onOpenChange,
}: FeatureDetailsDialogProps) => {
  if (!feature) return null;

  const Icon = feature.icon;
  
  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Feature selected",
      description: `You've selected ${feature.title}. We'll contact you with more information.`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full bg-${feature.color}/10 w-12 h-12 flex items-center justify-center`}>
              <Icon className={`h-6 w-6 text-${feature.color}`} />
            </div>
            <DialogTitle className="text-2xl">{feature.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">{feature.description}</p>
          
          {feature.details && (
            <div className="mt-4">
              <p>{feature.details}</p>
            </div>
          )}
          
          {feature.features && feature.features.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-medium">Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {feature.benefits && feature.benefits.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-medium">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {feature.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDetailsDialog;
