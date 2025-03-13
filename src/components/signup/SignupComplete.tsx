
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar } from "lucide-react";
import { SignupFormData } from "@/pages/login/PatientSignup";
import { Link } from "react-router-dom";

interface SignupCompleteProps {
  formData: SignupFormData;
  onComplete: () => void;
}

const SignupComplete: React.FC<SignupCompleteProps> = ({ formData, onComplete }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold">Account Created Successfully</h3>
      
      <p className="text-muted-foreground">
        Welcome to Altheo Health, {formData.name}! Your account has been created and your medical information has been saved.
      </p>
      
      <div className="bg-muted/20 p-4 rounded-lg border border-border/30 my-6 text-left">
        <h4 className="font-medium mb-2">Next Steps</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">1</span>
            <span>Log in to your new account</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">2</span>
            <span>Book your first virtual consultation</span>
          </li>
          <li className="flex">
            <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">3</span>
            <span>Complete a pre-consultation assessment with our AI assistant</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onComplete}>
          Log In Now
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard?tab=appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SignupComplete;
