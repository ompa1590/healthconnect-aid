import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  ExternalLink,
  CreditCard,
  MessageCircle
} from "lucide-react";

export const supportCategories = [
  {
    title: "Insurance Support",
    description: "Get help with your insurance claims, coverage questions, and more",
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    href: "#insurance-support"
  },
  {
    title: "Billing Assistance",
    description: "Questions about your bill, payment options, or financial assistance",
    icon: <FileText className="h-5 w-5 text-green-500" />,
    href: "#billing-assistance"
  },
  {
    title: "Service Inquiries",
    description: "Questions about our medical services, specialties, or providers",
    icon: <Mail className="h-5 w-5 text-amber-500" />,
    href: "#service-inquiries"
  },
  {
    title: "Chat with Doctor",
    description: "Message your healthcare provider directly with any follow-up questions",
    icon: <MessageCircle className="h-5 w-5 text-purple-500" />,
    href: "#chat-with-doctor"
  },
  {
    title: "General Help",
    description: "Other questions or assistance with your healthcare journey",
    icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
    href: "#general-help"
  }
];

export const supportOptions = [
  {
    title: "Live Chat",
    description: "Chat with our healthcare support team",
    icon: MessageSquare,
    action: "Start Chat",
    variant: "default" as const
  },
  {
    title: "Call Support",
    description: "Speak with a support representative",
    icon: Phone,
    action: "Call Now",
    variant: "outline" as const
  },
  {
    title: "Email Us",
    description: "Send us your questions",
    icon: Mail,
    action: "Send Email",
    variant: "outline" as const
  },
  {
    title: "Help Center",
    description: "Browse our help articles",
    icon: FileText,
    action: "View Articles",
    variant: "outline" as const
  }
];

export function SupportOptions() {
  const navigate = useNavigate();
  
  const handleSupportClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    
    if (category === "Chat with Doctor") {
      const prescriptionsElement = document.getElementById("chat-tab");
      if (prescriptionsElement) {
        prescriptionsElement.click();
      }
    }
  };

  return (
    <DialogContent className="lg:max-w-[900px] max-h-[900px] p-0">
      <DialogHeader className="p-6 pb-4">
        <DialogTitle className="text-2xl flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Support & Help
        </DialogTitle>
        <DialogDescription>
          Get assistance with your healthcare journey
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="p-6 pt-0">
        <div className="grid gap-4">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <option.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-1 flex-col items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Button variant={option.variant} size="sm" className="gap-2">
                  {option.action}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Additional Support Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportCategories.map((category, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <CardTitle className="text-base">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={(e) => handleSupportClick(e as any, category.title)}
                  >
                    Get Support
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Available 24/7 for your healthcare needs
        </div>
      </ScrollArea>
    </DialogContent>
  );
}

export default SupportOptions;
