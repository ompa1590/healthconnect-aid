
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, PauseCircle, PlayCircle, Stethoscope, XCircle, MessageCircle, HelpCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for treatment plans - in a real app, this would come from the database
const mockTreatmentPlans = [
  {
    id: 1,
    name: "Dermatology Consultation",
    status: "active",
    startDate: "2023-05-15",
    nextAppointment: "2023-06-15",
    provider: "Dr. Sara Johnson",
    description: "Treatment for chronic eczema with regular follow-ups and medication management.",
    medications: [
      { name: "Tacrolimus Ointment", dosage: "0.1%, apply twice daily" },
      { name: "Hydrocortisone Cream", dosage: "1%, apply as needed for flare-ups" }
    ]
  },
  {
    id: 2,
    name: "Monthly Wellness Check",
    status: "active",
    startDate: "2023-04-10",
    nextAppointment: "2023-06-10",
    provider: "Dr. Michael Chen",
    description: "Regular wellness checks to monitor overall health and preventative care.",
    medications: []
  }
];

const CurrentPlans = () => {
  const [openPlanDetails, setOpenPlanDetails] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', planId: null });
  const { toast } = useToast();

  const handleViewPlan = (plan) => {
    setCurrentPlan(plan);
    setOpenPlanDetails(true);
  };

  const handlePlanAction = (action, planId) => {
    // Close the plan details dialog
    setOpenPlanDetails(false);
    
    // For demo purposes, we're just showing toast notifications
    // In a real app, this would update the database
    let actionMessage = '';
    switch(action) {
      case 'pause':
        actionMessage = 'Your treatment plan has been paused. You can resume it anytime.';
        break;
      case 'resume':
        actionMessage = 'Your treatment plan has been resumed.';
        break;
      case 'cancel':
        actionMessage = 'Your treatment plan has been canceled.';
        break;
      default:
        actionMessage = 'Treatment plan updated.';
    }
    
    toast({
      title: "Plan Updated",
      description: actionMessage
    });
    
    // Close the confirmation dialog if it was open
    setConfirmDialog({ open: false, action: '', planId: null });
  };

  const openConfirmDialog = (action, planId) => {
    setConfirmDialog({ open: true, action, planId });
    setOpenPlanDetails(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current Treatment Plans</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockTreatmentPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                  {plan.status === 'active' ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <CardDescription>
                <div className="flex items-center mt-2 text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Next appointment: {plan.nextAppointment}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleViewPlan(plan)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={openPlanDetails} onOpenChange={setOpenPlanDetails}>
        <DialogContent className="sm:max-w-md">
          {currentPlan && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  {currentPlan.name}
                </DialogTitle>
                <Badge variant={currentPlan.status === 'active' ? 'default' : 'secondary'} className="mt-2 self-start">
                  {currentPlan.status === 'active' ? 'Active' : 'Paused'}
                </Badge>
                <DialogDescription className="pt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Provider:</span>
                    {currentPlan.provider}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Start Date:</span>
                    {currentPlan.startDate}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Next Appointment:</span>
                    {currentPlan.nextAppointment}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                </TabsContent>
                <TabsContent value="medications" className="pt-4">
                  {currentPlan.medications.length > 0 ? (
                    <div className="space-y-3">
                      {currentPlan.medications.map((med, index) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-md">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No medications associated with this plan.</p>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {currentPlan.status === 'active' ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={() => openConfirmDialog('pause', currentPlan.id)}
                    >
                      <PauseCircle className="h-4 w-4" />
                      Pause Plan
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1 gap-1"
                      onClick={() => openConfirmDialog('cancel', currentPlan.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Plan
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-1"
                    onClick={() => openConfirmDialog('resume', currentPlan.id)}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Resume Plan
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({...confirmDialog, open})}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm {confirmDialog.action} plan</DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'pause' && "Your plan will be paused until you decide to resume it. You won't be billed during this time."}
              {confirmDialog.action === 'resume' && "Your plan will be reactivated and billing will resume according to your plan terms."}
              {confirmDialog.action === 'cancel' && "This will permanently cancel your plan. You'll need to create a new plan if you wish to continue treatment."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({...confirmDialog, open: false})}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant={confirmDialog.action === 'cancel' ? 'destructive' : 'default'} 
              className="flex-1"
              onClick={() => handlePlanAction(confirmDialog.action, confirmDialog.planId)}
            >
              Confirm {confirmDialog.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurrentPlans;
