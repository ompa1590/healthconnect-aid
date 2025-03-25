import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  ArrowRight,
  ExternalLink 
} from "lucide-react";
import { supportCategories, supportOptions } from "@/components/dashboard/SupportOptions";

const SupportPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Support & Help Center
        </h1>
        <p className="text-muted-foreground mt-2">Get the assistance you need with your healthcare journey</p>
      </div>

      {/* Quick Support Options */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {supportOptions.map((option) => (
          <Card key={option.title} className="overflow-hidden transition-all hover:shadow-md">
            <div className="flex items-start p-6 space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <option.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{option.title}</h3>
                <p className="text-muted-foreground mt-1">{option.description}</p>
                <Button 
                  variant={option.variant} 
                  size="sm" 
                  className="mt-4 gap-2"
                >
                  {option.action}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Support Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Help Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/5">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>Browse through common questions and helpful resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add your FAQ items here */}
            {/* Example FAQ structure */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">How do I book an appointment?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can book appointments through your dashboard...
                </p>
              </div>
              {/* Add more FAQ items */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
