import React from "react";
import {  Paper, Typography } from "@mui/material";

interface DashboardCardProps {
  title: string;
  value: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, color }) => {
  return (
    <Paper
      sx={{
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: color,
        color: "#FFFFFF",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: "8px" }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default DashboardCard;
