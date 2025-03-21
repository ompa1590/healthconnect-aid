
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, HelpCircle, MessageSquare, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupportOptions = () => {
  const [supportType, setSupportType] = useState("billing");
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Support request submitted",
        description: "We've received your request and will get back to you shortly."
      });
      
      // Reset form
      setMessage("");
      setPreferredContact("email");
      // Close dialog
      document.querySelector('[data-state="open"]')?.querySelector('button[data-state="closed"]')?.click();
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Support & Assistance</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Billing & Insurance
                </CardTitle>
                <CardDescription className="text-xs">
                  Questions about your bill or insurance coverage
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Billing & Insurance Support</DialogTitle>
              <DialogDescription>
                Submit your billing or insurance-related questions and we'll get back to you.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="support-type">What can we help you with?</Label>
                  <Select defaultValue="billing" onValueChange={setSupportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="insurance">Insurance Coverage</SelectItem>
                      <SelectItem value="payment">Payment Options</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <RadioGroup defaultValue="email" onValueChange={setPreferredContact}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Treatment Support
                </CardTitle>
                <CardDescription className="text-xs">
                  Questions about your treatment or medication
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Treatment Support</DialogTitle>
              <DialogDescription>
                Submit your questions about treatment or medication and a healthcare provider will respond.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="support-type">Category</Label>
                  <Select defaultValue="medication">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication Question</SelectItem>
                      <SelectItem value="side-effects">Side Effects</SelectItem>
                      <SelectItem value="treatment">Treatment Plan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or concern..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <RadioGroup defaultValue="normal">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal (1-2 business days)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent">Urgent (24 hours)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Technical Help
                </CardTitle>
                <CardDescription className="text-xs">
                  Help with the app or website
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Technical Support</DialogTitle>
              <DialogDescription>
                Submit your technical issues or questions about using the platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="support-type">Issue Type</Label>
                  <Select defaultValue="app">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app">App Issues</SelectItem>
                      <SelectItem value="account">Account Problems</SelectItem>
                      <SelectItem value="scheduling">Scheduling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Describe the issue</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe the technical issue you're experiencing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" className="gap-2">
          <Phone className="h-4 w-4" />
          <span>Call Support: (800) 555-0123</span>
        </Button>
      </div>
    </div>
  );
};

export default SupportOptions;
