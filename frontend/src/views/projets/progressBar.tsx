import React from "react";
import { Box, LinearProgress, styled, Typography } from "@mui/material";

interface Task {
  status: string;
}

interface Livrable {
  status: string;
}

interface ProgressBarProps {
  tasks: Task[];
  livrables: Livrable[];
}

// Barre de progression stylisée
const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: "20px",
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: "#e0e0e0",
  position: "relative",
  "& .MuiLinearProgress-bar": {
    background: "linear-gradient(90deg, #4caf50, #81c784, #a5d6a7)",
    transition: "width 0.4s ease-in-out",
  },
}));

const ProgressBar: React.FC<ProgressBarProps> = ({ tasks, livrables }) => {
  const calculateCompletionPercentage = () => {
    const completedTasks = tasks.filter((task) => task.status === "Terminé").length;
    const completedLivrables = livrables.filter((livrable) => livrable.status === "Livré").length;
    return ((completedTasks + completedLivrables) / (tasks.length + livrables.length)) * 100;
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <Box sx={{ marginBottom: "20px", position: "relative" }}>
      <Box sx={{ position: "relative" }}>
        <StyledLinearProgress variant="determinate" value={completionPercentage} />
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#333333",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {completionPercentage ? Math.round(completionPercentage) : "0"}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
