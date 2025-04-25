
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { format as dateFormat } from "date-fns";
import { Download, FileText, Printer, Share2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define the Prescription type
interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  dateIssued: Date;
  expiryDate: Date;
  refills: number;
  instructions: string;
  status: 'active' | 'completed' | 'expired';
}

const MyPrescriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch prescriptions
  useEffect(() => {
    // Simulating API call
    const fetchPrescriptions = async () => {
      try {
        // Replace with actual API call
        const mockPrescriptions = [
          {
            id: '1',
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Every 8 hours',
            prescribedBy: 'Dr. Sarah Johnson',
            dateIssued: new Date('2023-10-01'),
            expiryDate: new Date('2023-10-14'),
            refills: 0,
            instructions: 'Take with food. Complete the full course.',
            status: 'completed' as const,
          },
          {
            id: '2',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            prescribedBy: 'Dr. Michael Chen',
            dateIssued: new Date('2023-10-15'),
            expiryDate: new Date('2024-04-15'),
            refills: 3,
            instructions: 'Take in the morning.',
            status: 'active' as const,
          },
          {
            id: '3',
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            prescribedBy: 'Dr. Sarah Johnson',
            dateIssued: new Date('2023-09-01'),
            expiryDate: new Date('2024-03-01'),
            refills: 2,
            instructions: 'Take at bedtime.',
            status: 'active' as const,
          },
        ];
        
        setTimeout(() => {
          setPrescriptions(mockPrescriptions);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user]);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleRequestRefill = (id: string) => {
    toast({
      title: "Refill Requested",
      description: "Your prescription refill has been requested. Your doctor will be notified.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading...",
      description: "Your prescription is being downloaded",
    });
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = () => {
    toast({
      title: "Share Link Created",
      description: "A secure link to share with your pharmacy has been created and copied to your clipboard.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Prescriptions</CardTitle>
          <CardDescription>
            View and manage your prescription medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.name}</TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>{prescription.prescribedBy}</TableCell>
                      <TableCell>{dateFormat(prescription.dateIssued, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(prescription.status)}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {prescription.status === 'active' && prescription.refills > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRequestRefill(prescription.id)}
                            >
                              Request Refill
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No Prescriptions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You don't have any active prescriptions at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Details Dialog */}
      {selectedPrescription && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
              <DialogDescription>
                Details for your {selectedPrescription.name} prescription
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Medication</p>
                    <p className="font-medium">{selectedPrescription.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dosage</p>
                    <p className="font-medium">{selectedPrescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-medium">{selectedPrescription.frequency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Refills</p>
                    <p className="font-medium">{selectedPrescription.refills}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date Issued</p>
                    <p className="font-medium">{dateFormat(selectedPrescription.dateIssued, 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-medium">{dateFormat(selectedPrescription.expiryDate, 'MMM d, yyyy')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Instructions</p>
                    <p className="font-medium">{selectedPrescription.instructions}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Prescribed By</p>
                    <p className="font-medium">{selectedPrescription.prescribedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyPrescriptions;
