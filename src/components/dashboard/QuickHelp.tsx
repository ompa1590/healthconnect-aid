
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I request a prescription refill?",
    answer: "You can request a prescription refill by navigating to the 'My Prescriptions' section of your dashboard and clicking the 'Request Copy' button next to the prescription you need refilled."
  },
  {
    question: "What if I miss a dose of my medication?",
    answer: "If you miss a dose, take it as soon as you remember unless it's almost time for your next dose. Never take two doses at once to make up for a missed dose. Consult your healthcare provider if you're unsure about what to do."
  },
  {
    question: "How do I schedule a follow-up appointment?",
    answer: "To schedule a follow-up appointment, go to the 'Book Appointment' section of your dashboard. Select your provider, choose an available time slot, and confirm your appointment details."
  },
  {
    question: "Can I change my treatment plan?",
    answer: "Yes, you can request changes to your treatment plan. Navigate to the 'Current Plans' section, select the plan you want to modify, and use the 'Request Modification' option. A healthcare provider will review your request."
  },
  {
    question: "How do I update my insurance information?",
    answer: "You can update your insurance information in the 'Profile Settings' section of your dashboard. Select 'Insurance Information' and follow the prompts to update your details."
  }
];

const QuickHelp = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Help</h2>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about your care</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              View Help Center
            </Button>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickHelp;
