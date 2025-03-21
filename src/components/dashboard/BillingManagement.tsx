
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, FileText, MessageSquare, Bell, DollarSign, BadgeDollarSign, MailQuestion } from "lucide-react";

// Mock data for billing history
const billingHistory = [
  {
    id: "INV-001",
    date: "2023-09-15",
    service: "Primary Care Visit",
    amount: "$150.00",
    status: "Paid",
    insurance: "Blue Cross",
    coverage: "$120.00",
    remainder: "$30.00"
  },
  {
    id: "INV-002",
    date: "2023-10-03",
    service: "Specialist Consultation",
    amount: "$250.00",
    status: "Pending",
    insurance: "Blue Cross",
    coverage: "$200.00",
    remainder: "$50.00"
  },
  {
    id: "INV-003",
    date: "2023-11-10",
    service: "Lab Tests",
    amount: "$85.00",
    status: "Processing",
    insurance: "Blue Cross",
    coverage: "$85.00",
    remainder: "$0.00"
  }
];

// Mock data for payment methods
const paymentMethods = [
  {
    id: 1,
    type: "Credit Card",
    last4: "4242",
    expiry: "05/25",
    isDefault: true
  },
  {
    id: 2,
    type: "Bank Account",
    last4: "9876",
    bank: "TD Bank",
    isDefault: false
  }
];

const BillingManagement = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Billing & Payments</h2>
      
      {/* Account summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Balance Due</p>
              <p className="text-2xl font-medium">$80.00</p>
              <Button className="w-full mt-2 gap-2">
                <DollarSign className="h-4 w-4" />
                Pay Now
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Insurance</p>
              <p className="text-base">Blue Cross Blue Shield</p>
              <p className="text-sm text-muted-foreground">Policy #: BCBS128745</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Next Payment</p>
              <p className="text-base">November 30, 2023</p>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Reminder Set</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <CreditCard className="h-4 w-4" />
              Add New
            </Button>
          </div>
          <CardDescription>Manage your payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {method.type === "Credit Card" ? (
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  ) : (
                    <BadgeDollarSign className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.type === "Credit Card" 
                        ? `**** ${method.last4} (Expires: ${method.expiry})`
                        : `**** ${method.last4} (${method.bank})`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                      Default
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Billing History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Billing History
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <CardDescription>View your past invoices and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.service}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{invoice.insurance}</div>
                      <div className="text-muted-foreground">
                        Covered: {invoice.coverage}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        invoice.status === "Paid" 
                          ? "bg-green-100 text-green-800 hover:bg-green-200" 
                          : invoice.status === "Pending" 
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>
      
      {/* Insurance Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insurance Claims */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MailQuestion className="h-5 w-5 text-primary" />
              Insurance Claims
            </CardTitle>
            <CardDescription>Submit and track your insurance claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Submit New Claim
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                View Pending Claims (2)
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Billing Support
            </CardTitle>
            <CardDescription>Get help with your billing questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat with Billing Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Bell className="h-4 w-4" />
                Set Payment Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingManagement;
