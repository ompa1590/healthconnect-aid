
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
import { Calendar, Clock, AlertCircle, FileText, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
        <div className="animate-pulse">Loading prescriptions...</div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Prescriptions</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              You don't have any active prescriptions. Your healthcare provider will add prescriptions here after your consultations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Prescriptions</CardTitle>
          <CardDescription>
            View your current and past prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">
                    {prescription.medication_name}
                  </TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm truncate" title={prescription.instructions}>
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
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Start: {formatDate(prescription.start_date)}</span>
                      </div>
                      {prescription.end_date && (
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>End: {formatDate(prescription.end_date)}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRequestCopy(prescription)}
                    >
                      Request Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Prescription Copy</DialogTitle>
            <DialogDescription>
              Please provide a reason why you need a copy of this prescription. Your provider will review your request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="bg-muted/20 p-3 rounded-md mb-4">
              <h4 className="font-medium mb-2">{selectedPrescription.medication_name}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Dosage: {selectedPrescription.dosage}</p>
                <p>Frequency: {selectedPrescription.frequency}</p>
              </div>
            </div>
          )}
          
          <Textarea
            placeholder="Please explain why you need a copy of this prescription..."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={submitRequest} 
              disabled={!requestReason.trim() || submitting}
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
