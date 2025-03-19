
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PastAppointmentsPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-normal mb-6">Past Appointments</h1>
      
      <Card className="border rounded-xl shadow-sm bg-gradient-to-br from-white to-health-50/30">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">Your Appointment History</h2>
          
          <div className="space-y-4">
            {/* We'll display actual past appointments from database in the future */}
            <div className="border rounded-md p-4 hover:bg-muted/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Dermatology Consultation</h3>
                  <p className="text-sm text-muted-foreground">May 10, 2023 - 2:00 PM</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Sarah Johnson</p>
              <button className="text-sm text-primary font-medium hover:underline">View Details</button>
            </div>
            
            <div className="border rounded-md p-4 hover:bg-muted/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Annual Check-up</h3>
                  <p className="text-sm text-muted-foreground">February 15, 2023 - 10:30 AM</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Michael Chen</p>
              <button className="text-sm text-primary font-medium hover:underline">View Details</button>
            </div>
            
            <div className="border rounded-md p-4 hover:bg-muted/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Nutritional Consultation</h3>
                  <p className="text-sm text-muted-foreground">January 5, 2023 - 1:15 PM</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dr. Emily Rodriguez</p>
              <button className="text-sm text-primary font-medium hover:underline">View Details</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PastAppointmentsPage;
