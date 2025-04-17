
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ScrollText, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
  onVerify: () => void;
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({
  open,
  onOpenChange,
  summary,
  onVerify
}) => {
  // Function to parse and format sections from the summary
  const formatSections = (text: string) => {
    const sections: { [key: string]: string[] } = {};
    let currentSection = "";
    
    text.split('\n').forEach(line => {
      if (line.includes('###') || line.startsWith('•')) {
        currentSection = line.replace('###', '').trim();
        sections[currentSection] = [];
      } else if (line.trim() && currentSection) {
        sections[currentSection].push(line.trim());
      }
    });
    
    return sections;
  };

  const sections = formatSections(summary);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Medical Document Analysis
          </DialogTitle>
          <DialogDescription className="text-base">
            AI-generated analysis and key findings from your document
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {summary ? (
            <div className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(sections).map(([title, content], index) => (
                  <AccordionItem value={`section-${index}`} key={index} className="border-b border-border/40">
                    <AccordionTrigger className="text-left hover:no-underline py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {title.replace(':', '')}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {content.map((line, i) => (
                          <p key={i} className="leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-amber-800 dark:text-amber-400">
                      Important Notice
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      This is an AI-generated summary. Please verify its accuracy against the original document before making medical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No summary available for this document.</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="border-t bg-muted/10 pt-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onVerify} className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            Verify Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
