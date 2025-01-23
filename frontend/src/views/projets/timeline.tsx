import React, { useState } from "react";
import { Box, Slider, Typography } from "@mui/material";

interface Task {
  name: string;
  status: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
}

interface TimelineProps {
  tasks: Task[];
}

const Timeline: React.FC<TimelineProps> = ({ tasks }) => {
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom initial à 100%

  // Calcul des durées et plages
  const startDates = tasks.map((task) => new Date(task.startDate).getTime());
  const endDates = tasks.map((task) => new Date(task.endDate).getTime());
  const minDate = Math.min(...startDates);
  const maxDate = Math.max(...endDates);

  const totalDuration = maxDate - minDate;

  // Calcul de la position et de la largeur des barres (en fonction du zoom)
  const calculatePosition = (startDate: string) =>
    (((new Date(startDate).getTime() - minDate) / totalDuration) * 100 * zoomLevel) / 100;

  const calculateWidth = (startDate: string, endDate: string) =>
    (((new Date(endDate).getTime() - new Date(startDate).getTime()) / totalDuration) * 100 * zoomLevel) / 100;

  // Gestion du zoom
  const handleZoomChange = (_: Event, newValue: number | number[]) => {
    setZoomLevel(newValue as number);
  };

  return (
    <Box sx={{ fontFamily: "Roboto, sans-serif", padding: "20px" }}>
      {/* Slider de zoom */}
      <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
        <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
          Zoom : {zoomLevel}%
        </Typography>
        <Slider
          value={zoomLevel}
          onChange={handleZoomChange}
          min={50}
          max={200}
          step={10}
          valueLabelDisplay="auto"
          sx={{
            width: "300px",
            color: "#4caf50",
          }}
        />
      </Box>

      {/* Conteneur avec barres de défilement horizontales et verticales */}
      <Box
        sx={{
          position: "relative",
          height: "400px", // Hauteur fixe avec barre de défilement verticale
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          overflowX: "auto", // Barre de défilement horizontale
          overflowY: "auto", // Barre de défilement verticale
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Diagramme de Gantt */}
        <Box
          sx={{
            position: "relative",
            width: `${zoomLevel}%`, // Ajuster la largeur en fonction du zoom
            minHeight: "100%", // Remplir la hauteur visible
          }}
        >
          {tasks.map((task, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: `${index * 50}px`,
                left: `${calculatePosition(task.startDate)}%`,
                width: `${calculateWidth(task.startDate, task.endDate)}%`,
                height: "40px",
                backgroundColor:
                  task.status === "Terminée"
                    ? "#4CAF50"
                    : task.status === "En cours"
                    ? "#FFC107"
                    : "#FF5722",
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {task.name}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Timeline;
