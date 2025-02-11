import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { Box, Button, LinearProgress, styled, Typography } from "@mui/material";
import DialogDeleteEvents from "./dialodDeleteEvents";
import DialogAddEvents from "./dialogAddEvents";

interface Task {
    name: string;
    status: string;
    assignedTo: string;
    startDate: string;
    endDate: string;
}

interface Jalon {
    name: string;
    endDate: string;
}

interface Livrable {
    name: string;
    endDate: string;
    status: string;
}

interface TimelineProps {
  tasks: Task[];
  jalons: Jalon[];
  livrables: Livrable[];
}
// Barre de progression personnalisée
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
const Timeline: React.FC<TimelineProps> = ({ tasks, jalons, livrables }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddEvents, setOpenDialogAddEvents] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleOpenDialogAddEvents = () => setOpenDialogAddEvents(true);
  const handleCloseDialogAddEvents = () => setOpenDialogAddEvents(false);
  const handleCloseDialog = () => setOpenDialog(false);
// Calcul du pourcentage des tâches terminées
  const calculateCompletionPercentage = () => {
    const completedTasks = tasks.filter((task) => task.status === "Terminé").length;
    const completedLivrables = livrables.filter((livrable) => livrable.status === "Livré").length;
    return ((completedTasks + completedLivrables)/ (tasks.length + livrables.length)) * 100;
  };
  const completionPercentage = calculateCompletionPercentage();

  const chartData = [
    ["Task", "Nom (Info)", "Début", "Fin"],

    ...tasks.map((task) => [
        task.assignedTo,
        `${task.status} — ${task.name}`, 
        new Date(task.startDate),
        new Date(task.endDate)
      ]),

    ...jalons.map((jalon) => {
        const endDate = new Date(jalon.endDate);
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
    
        return [
            "Jalons",
            `${jalon.name}`, 
            endDate,
            endDatePlusOne
        ];
    }),


    ...livrables.map((livrable) => {
        const endDate = new Date(livrable.endDate);
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
    
        return [
            "Livrables",
            `${livrable.status} — ${livrable.name}`, 
            endDate,
            endDatePlusOne
        ];
    })
  ];  

  return (
    <Box sx={{ fontFamily: "Open Sans, sans-serif", padding: "20px" }}>
      <Chart
        chartType="Timeline"
        data={chartData}
        width="100%"
        height="400px"
        options={{
          timeline: { showRowLabels: true },
          hAxis: { format: "dd/MM/yyyy",
            slantedText: true,
            slantedTextAngle: 45, },
            tooltip: {
              isHtml: true,
              trigger: "focus", // Forcer l'affichage détaillé
            },
        }}
        
      />
      {/* Boutons pour gérer les événements */}
       <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", marginTop: "20px" }}>
         <Button
          variant="contained"
          sx={{
            mr: 1,
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #005B96, #00A676)",
            "&:hover": {
              background: "linear-gradient(135deg, #005B96, #00A676)",
            },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleOpenDialogAddEvents}
        >
          Ajouter un événement
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            marginLeft: "10px",
          }}
          onClick={handleOpenDialog}
        >
          Supprimer un événement
        </Button>
      </Box>

      {/* Barre de progression stylisée */}
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
      <DialogDeleteEvents open={openDialog} onClose={handleCloseDialog} />
      <DialogAddEvents open={openDialogAddEvents} onClose={handleCloseDialogAddEvents} />
    </Box>
  );
};

export default Timeline;
