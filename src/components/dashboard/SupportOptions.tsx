
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Mail, HelpCircle } from "lucide-react";

const supportCategories = [
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
    title: "General Help",
    description: "Other questions or assistance with your healthcare journey",
    icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
    href: "#general-help"
  }
];

const SupportOptions = () => {
  const handleSupportClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    // Instead of using 'click' which doesn't exist on Element, we'll use a different approach
    console.log(`Support category clicked: ${category}`);
    // Future implementation: Open a modal or navigate to the specific support page
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Support & Assistance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportCategories.map((category, index) => (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href={category.href} 
                onClick={(e) => handleSupportClick(e, category.title)}
                className="inline-block"
              >
                <Button variant="outline" className="w-full">Get Support</Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
          <CardDescription>Our support team is available 24/7 to assist you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <HelpCircle className="h-4 w-4" />
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportOptions;
