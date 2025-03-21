
import React from "react";
import MyPrescriptions from "@/components/dashboard/MyPrescriptions";

const PrescriptionsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-medium mb-6">My Prescriptions</h1>
      <div className="mb-6">
        <p className="text-muted-foreground">
          View and manage your prescriptions. You can request copies of your prescriptions if needed.
        </p>
      </div>
      <MyPrescriptions />
    </div>
  );
};

export default PrescriptionsPage;
