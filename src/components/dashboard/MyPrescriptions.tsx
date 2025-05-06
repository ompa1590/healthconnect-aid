
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertCircle, FileText, Check, Pill, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/badge";

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("prescriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setPrescriptions(data || []);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        toast({
          title: "Error",
          description: "Failed to load your prescriptions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [toast]);

  const handleRequestCopy = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setRequestDialogOpen(true);
  };

  const submitRequest = async () => {
    if (!selectedPrescription || !requestReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your request.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("You must be logged in to request a prescription copy");
      }
      
      const { error } = await supabase
        .from("prescription_requests")
        .insert({
          prescription_id: selectedPrescription.id,
          patient_id: sessionData.session.user.id,
          reason: requestReason,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Request submitted",
        description: "Your prescription copy request has been submitted successfully.",
      });
      
      setRequestDialogOpen(false);
      setRequestReason("");
      setSelectedPrescription(null);
    } catch (error) {
      console.error("Error submitting prescription request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse flex flex-col items-center py-12">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <GlassCard className="rounded-xl" variant="elevated">
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">No Prescriptions</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            You don't have any active prescriptions. Your healthcare provider will add prescriptions here after your consultations.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard className="rounded-xl" variant="elevated">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-800">My Prescriptions</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your current and past prescriptions
            </p>
          </div>
        </div>
        
        <div className="mt-6 overflow-hidden border border-border/30 rounded-lg bg-white/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium">
                    {prescription.medication_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-normal">
                      {prescription.dosage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm" title={prescription.instructions}>
                        {prescription.frequency}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={prescription.instructions}>
                        {prescription.instructions}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-primary/70" />
                        <span>Start: {formatDate(prescription.start_date)}</span>
                      </div>
                      {prescription.end_date && (
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-primary/70" />
                          <span>End: {formatDate(prescription.end_date)}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="shadow-sm hover:shadow-md border-primary/20 hover:border-primary/40 bg-white hover:bg-primary/5"
                      onClick={() => handleRequestCopy(prescription)}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                      Request Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex items-center justify-start text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
          <Info className="h-4 w-4 mr-2 text-primary/70" />
          <p>You can request a copy of your prescription for pharmacy or insurance purposes.</p>
        </div>
      </GlassCard>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-md border border-border/30 shadow-lg backdrop-blur-sm bg-white/90">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Request Prescription Copy
            </DialogTitle>
            <DialogDescription>
              Please provide a reason why you need a copy of this prescription. Your provider will review your request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="bg-muted/20 p-4 rounded-md mb-4 border border-border/30">
              <h4 className="font-medium mb-2 text-gray-800">{selectedPrescription.medication_name}</h4>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Dosage:</span>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-normal">
                    {selectedPrescription.dosage}
                  </Badge>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Frequency:</span> {selectedPrescription.frequency}
                </p>
              </div>
            </div>
          )}
          
          <Textarea
            placeholder="Please explain why you need a copy of this prescription..."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            className="min-h-[100px] bg-white/70 border-border/40 focus:ring-primary/30"
          />
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-border/40 bg-white/70 hover:bg-muted/20">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={submitRequest} 
              disabled={!requestReason.trim() || submitting}
              className="bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyPrescriptions;
