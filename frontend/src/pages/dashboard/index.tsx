import React from "react";
import { Box } from "@mui/material";
import DashboardHeader from "frontend/src/views/dashboard/dashboardHeader.tsx";
import DashboardContent from "frontend/src/views/dashboard/dashboardContent.tsx";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ marginLeft: "290px", padding: "20px" }}>
      {/* En-tête du Dashboard */}
      <DashboardHeader />

      {/* Contenu principal du Dashboard */}
      <DashboardContent />
    </Box>

  );
};

export default Dashboard;
