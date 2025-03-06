import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Flag, Assignment, CalendarToday, Work } from "@mui/icons-material"; // Icônes Material-UI
import DialogAddProjects from "frontend/src/views/dashboard/dialogAddProjects.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// import InfoVisite from "frontend/src/views/dashboard/infoEvents.tsx";


const DashboardContent: React.FC = () => {

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
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

  const [user_id, setId] = useState<string | null>(null);

  async function recup_id() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setId(null);
      return;
    }
    
    try {
        const response = await axios.get(`${apiUrl}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
  
        setId(response.data.id || null);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        setId(null);
    }
  };

  async function getEvenements(){
    let evenement;
    let liste_evenement = [];
    let color;
    let icon;
    if (user_id){
        recup_id();
    }else{
        return
    }

    try {
        const response = await axios.get(`${apiUrl}/evenements/${user_id}`);
        for (let element of response.data){
            console.log(element.type)
            switch (element.type) {
                case "Tâche":
                  color = "linear-gradient(135deg, #FFCDD2, #E57373)";
                  icon = <Assignment />;
                  break;
                case "Livrable":
                  color = "linear-gradient(135deg, #FFECB3, #FFD54F)";
                  icon = <Flag />
                  break;
                case "Jalon":
                  color = "linear-gradient(135deg, #C8E6C9, #81C784)";
                  icon = <CalendarToday />
                  break;
              }
            
            evenement = { date: element.date_fin, type: element.type, project: element.nom, color: color, icon: icon }
            liste_evenement.push(evenement)
        }
        setUpcomingEvents(liste_evenement);
        
    } catch (err:any) {
        console.log(`evenements -> ${err.message} --> erreur car 0 evenement`);
    }
  }

  async function getProjets(){
    let projet;
    let liste_projets = [];

    if (user_id){
        recup_id();
    }else{
        return
    }

    try {
        const response = await axios.get(`${apiUrl}/projets/display/chercheur/${user_id}`);
        for (let element of response.data){
            projet = { id: element.id, name: element.nom, description: element.description }
            liste_projets.push(projet)
        }
        setUpcomingProjects(liste_projets);
        
    } catch (err:any) {
        console.log(`projets -> ${err.message} --> erreur car 0 projet`);
    }
  }


  // récupération de l'ID utilisateur
  useEffect(() => {
    recup_id();
  }, []);

  // Chargement des événements
  useEffect(() => {
    if (user_id) {
      getEvenements();
      getProjets();
    }
  }, [user_id]);

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
        {upcomingProjects.map((project) => (
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
