
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HealthRecordsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar userName="Patient" />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-normal mb-6">Health Records</h1>
        
        <Card className="border rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4">Your Health Records</h2>

            <Tabs defaultValue="lab-results" className="w-full">
              <TabsList className="bg-muted/20 p-1 mb-6 rounded-lg">
                <TabsTrigger 
                  value="lab-results" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  Lab Results
                </TabsTrigger>
                <TabsTrigger 
                  value="prescriptions" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lab-results">
                <div className="bg-muted/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Lab Results</h3>
                  <p className="text-muted-foreground mb-3">View your recent laboratory test results</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Complete Blood Count (CBC)</p>
                          <p className="text-sm text-muted-foreground">Completed on May 12, 2023</p>
                        </div>
                        <div className="text-sm text-primary">View Results</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Lipid Panel</p>
                          <p className="text-sm text-muted-foreground">Completed on February 3, 2023</p>
                        </div>
                        <div className="text-sm text-primary">View Results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="prescriptions">
                <div className="bg-muted/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Prescriptions</h3>
                  <p className="text-muted-foreground mb-3">Access and manage your medication prescriptions</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Atorvastatin 10mg</p>
                          <p className="text-sm text-muted-foreground">Prescribed on April 15, 2023</p>
                        </div>
                        <div className="text-sm text-primary">View Details</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Lisinopril 5mg</p>
                          <p className="text-sm text-muted-foreground">Prescribed on March 22, 2023</p>
                        </div>
                        <div className="text-sm text-primary">View Details</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <div className="bg-muted/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Documents</h3>
                  <p className="text-muted-foreground mb-3">View and download your medical documents</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Referral Letter - Cardiologist</p>
                          <p className="text-sm text-muted-foreground">Uploaded on June 2, 2023</p>
                        </div>
                        <div className="text-sm text-primary">Download</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Vaccine Record</p>
                          <p className="text-sm text-muted-foreground">Uploaded on January 10, 2023</p>
                        </div>
                        <div className="text-sm text-primary">Download</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HealthRecordsPage;
