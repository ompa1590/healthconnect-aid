
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "@/components/provider/WelcomeModal";
import ProviderAppointments from "@/components/provider/ProviderAppointments";
import ProviderPatients from "@/components/provider/ProviderPatients";
import ProviderSchedule from "@/components/provider/ProviderSchedule";
import ProviderSettings from "@/components/provider/ProviderSettings";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/provider-login");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has provider role
        const userRole = user.user_metadata?.role;
        if (userRole !== "provider") {
          navigate("/provider-login"); // Redirect if not a provider
          return;
        }

        const firstName = user.user_metadata?.firstName || "";
        const lastName = user.user_metadata?.lastName || "";
        setUserName(`${firstName} ${lastName}`);

        // Check if this is a new user who should see the welcome modal
        const isNewUser = user.user_metadata?.isNewUser === true;
        if (isNewUser) {
          setShowWelcomeModal(true);
          // Update user metadata to remove the new user flag
          await supabase.auth.updateUser({
            data: { isNewUser: false }
          });
        }

        // Fetch some mock data for the dashboard
        setUpcomingAppointments(Math.floor(Math.random() * 10) + 1);
        setTotalPatients(Math.floor(Math.random() * 100) + 10);
        setCompletedAppointments(Math.floor(Math.random() * 50) + 5);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. {userName}</h1>
          <p className="text-muted-foreground">
            Manage your appointments, patients, and schedule
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    +5 new this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Schedule Today</CardTitle>
                <CardDescription>
                  Overview of your appointments for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderSchedule />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>
                  Manage your upcoming and past appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderAppointments />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Your Patients</CardTitle>
                <CardDescription>
                  View and manage your patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderPatients />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <ProviderSettings />
          </TabsContent>
        </Tabs>
      </div>

      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleWelcomeModalClose} 
      />
    </div>
  );
};

export default ProviderDashboard;
