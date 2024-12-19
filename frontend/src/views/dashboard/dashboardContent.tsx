import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Event, Flag, Assignment, CalendarToday, Work } from "@mui/icons-material"; // Icônes Material-UI
import DialogAddProjects from "frontend/src/views/dashboard/dialogAddProjects.tsx";
import { useNavigate } from "react-router-dom";
import { projects } from "frontend/src/views/projets/projects.ts"; // Importation des projets
// import InfoVisite from "frontend/src/views/dashboard/infoEvents.tsx";


// Liste d'événements (simulée)
const upcomingEvents = [
  { date: "19/01/2025", type: "livrable", project: "Projet 3", color: "linear-gradient(135deg, #FFECB3, #FFD54F)", icon: <Event /> },
  { date: "20/01/2025", type: "échéance", project: "Projet 1", color: "linear-gradient(135deg, #FFCDD2, #E57373)", icon: <Flag /> },
  { date: "25/01/2025", type: "livrable", project: "Projet 1", color: "linear-gradient(135deg, #FFECB3, #FFD54F)", icon: <Event /> },
  { date: "30/01/2029", type: "Jalon", project: "Projet 2", color: "linear-gradient(135deg, #C8E6C9, #81C784)", icon: <CalendarToday /> },
  { date: "30/01/2029", type: "Tâche", project: "Projet 5", color: "linear-gradient(135deg, #BBDEFB, #64B5F6)", icon: <Assignment /> },
];


const DashboardContent: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();  // Initialisation du hook useNavigate

  // Ouvrir/fermer la popup
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Fonction pour naviguer vers la page des projets
  const handleNavigateToProjects = () => {
    navigate("/projects");  // Redirection vers la page des projets
  };

  // Fonction pour naviguer vers la page de détail d'un projet
  const handleNavigateToProjectDetails = (id: number) => {
    navigate(`/projet/${id}`);  // Redirection vers la page des détails du projet
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* En-tête avec le bouton +Projet */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="contained"
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #005B96, #00A676)",
            "&:hover": {
              background: "linear-gradient(135deg, #004080, #007F56)",
            },
            padding: "10px 20px",
            borderRadius: "12px",
          }}
          onClick={handleOpenDialog}
        >
          Créer Projet
        </Button>
      </Box>

      {/* Section des événements stylisés */}
      <Box
        sx={{
          backgroundColor: "#F9FAFB",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" sx={{color: "#333333", fontFamily: "Open Sans, sans-serif", fontWeight: "bold", marginBottom: "12px" }}>
          Événements à venir
          
        </Typography>
        {upcomingEvents.map((event, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: event.color,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              padding: "10px 16px",
              borderRadius: "12px",
              marginBottom: "10px",
              color: "#333",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Box sx={{ color: "#333" }}>{event.icon}</Box>
              <Typography sx={{ fontFamily: "Open Sans, sans-serif", fontSize: "14px", fontWeight: "bold" }}>
                {event.date}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>{event.type}</Typography>
            </Box>
            <Typography sx={{ fontFamily: "Open Sans, sans-serif", fontSize: "14px", fontWeight: "bold" }}>
              {event.project}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Section Projets en cours */}
    
      <Box sx={{ background: "#FFFFFF", borderRadius: "12px", padding: "20px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", mb:'50px' }}>
        <Typography variant="h5" sx={{ fontFamily: "Open Sans, sans-serif", fontWeight: "bold", mb: "12px", color: "#333333" }}>
          Projets en cours
        </Typography>
        {projects.map((project) => (
          <Box
            key={project.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              background: "#F9FAFB",
              padding: "16px 20px",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s ease",
              mb: 2,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={() => handleNavigateToProjectDetails(project.id)} // Ajout du clic pour rediriger vers les détails du projet
          
          >
            
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Work sx={{ fontSize: "28px", color: "#007AFF" }} />
              <Typography sx={{ fontWeight: "600", fontSize: "16px", color: "#333" }}>
                {project.name}
              </Typography>
            </Box>
            <Typography sx={{ fontStyle: "italic", color: "#666", fontSize: "14px" }}>
              {project.description}
            </Typography>
          </Box>
        ))}
        

        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              fontFamily: "Open Sans, sans-serif",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #005B96, #00A676)",
              "&:hover": {
                background: "linear-gradient(135deg, #004080, #007F56)",
              },
              padding: "10px 20px",
              borderRadius: "12px",
            }}
            onClick={handleNavigateToProjects}
          >
            Parcourir les projets
          </Button>
        </Box>
      </Box>
      


      {/* Popup d'ajout de projet */}
      <DialogAddProjects open={openDialog} onClose={handleCloseDialog} />
      
    </Box>
  );
};

export default DashboardContent;
