
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  color: string;
}

const onboardingSteps: Step[] = [
  {
    id: 1,
    title: "Welcome to Vyra Health",
    description: "We're excited to have you join our network of healthcare providers. Let's get you familiar with the platform.",
    color: "text-pink-500",
  },
  {
    id: 2,
    title: "Manage Your Schedule",
    description: "Set your availability and view upcoming appointments. You can block time slots and manage patient bookings seamlessly.",
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "Virtual Consultations",
    description: "Conduct secure video calls with your patients. Our platform provides end-to-end encryption and built-in notes.",
    color: "text-green-500",
  },
  {
    id: 4,
    title: "Access Patient Records",
    description: "Review patient histories, prescriptions, and track treatment progress. All data is stored securely.",
    color: "text-amber-500",
  },
  {
    id: 5,
    title: "Get Paid Easily",
    description: "Integrated billing makes it easy to charge for consultations. Track earnings and manage your practice finances.",
    color: "text-purple-500",
  },
];

interface WelcomeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onOpenChange,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const goToNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {!completed ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {currentStep === 0 ? (
                  <div className="text-3xl font-bold mb-2">
                    Welcome to <span className="text-primary">Vyra</span> 
                    <span className="text-secondary">Health</span>
                  </div>
                ) : (
                  step.title
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              {currentStep === 0 ? (
                <div className="flex flex-col items-center text-center space-y-6 py-4">
                  <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    Welcome to Telehealth Virtual, See patients with one click
                  </h2>
                  <p className="text-muted-foreground max-w-lg">
                    We're excited to have you on board. Let's take a quick tour of the platform
                    to help you get started with providing care to patients.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl font-bold ${step.color}`}>{step.id}</div>
                    <div className="text-lg text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              )}

              <div className="w-full bg-muted/30 h-2 rounded-full mt-6">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-between w-full">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Skip Tour
              </Button>
              <Button onClick={goToNextStep}>
                {currentStep < onboardingSteps.length - 1 ? (
                  <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  "Get Started"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">You're All Set!</DialogTitle>
            </DialogHeader>

            <div className="mt-4 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Ready to start seeing patients</h3>
              <p className="text-muted-foreground">
                Your provider account is now set up and ready to go. You can start accepting appointments and providing care to patients immediately.
              </p>

              <Button onClick={handleComplete} className="mt-6 w-full bg-green-600 hover:bg-green-700">
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
