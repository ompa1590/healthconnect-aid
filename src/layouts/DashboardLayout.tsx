import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      <DashboardNavbar userName={"Patient"} /> {/* Replace with actual user name */}
      <div> 
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
