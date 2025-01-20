import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import axios from "axios";

const ListeProjets: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (id: number) => {
    navigate(`/projet/${id}`);
  };

  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [projetsPublics, setprojetsPublics] = useState<any[]>([]);
  const [user_id, setId] = useState<string | null>(null);
  
  async function getProjets(){
    let projet;
    let liste_projets = [];

    if (user_id){
        recup_id();
    }else{
        return
    }

    try {
        const response = await axios.get(`http://localhost:3000/projets/display/${user_id}`);
        for (let element of response.data){
            projet = { id: element.id, name: element.nom, description: element.description }
            liste_projets.push(projet)
        }
        setUpcomingProjects(liste_projets);
        
    } catch (err:any) {
        console.log(`projets -> ${err.message} --> erreur car 0 projet`);
    }
  }


  async function getProjetsPublics(){
    let projet;
    let liste_projets = [];

    try {
        const response = await axios.get(`http://localhost:3000/projets/public`);
        for (let element of response.data){
            projet = { id: element.id, name: element.nom, description: element.description }
            liste_projets.push(projet)
        }
        setprojetsPublics(liste_projets);
        
    } catch (err:any) {
        console.log(`projets publics -> ${err.message} --> erreur car 0 projet public`);
    }
  }

  async function recup_id() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setId(null);
      return;
    }
    
    try {
        const response = await axios.get('http://localhost:3000/auth/profile', {
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

    // récupération de l'ID utilisateur
    useEffect(() => {
        recup_id();
    }, []);

    // Chargement des événements
    useEffect(() => {
        if (user_id) {
            getProjets();
            getProjetsPublics();
        }
    }, [user_id]);

  return (

    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minHeight: "100vh" }}>
      <Paper elevation={4} sx={{ padding: "20px", marginBottom: "20px", width: "100%", maxWidth: "800px", borderRadius: "15px", backgroundColor: "#ffffff" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#005B96", fontWeight: "bold", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
          Liste de vos projets
        </Typography>
        <List>
          {upcomingProjects.map((projet) => (
            <ListItem
              key={projet.id}
              onClick={() => handleProjectClick(projet.id)}
              sx={{
                backgroundColor: "#e3f2fd",
                marginBottom: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#00A676",
                  color: "#ffffff",
                },
              }}
            >
              <ListItemText
                primary={projet.name}
                secondary={projet.description}
                primaryTypographyProps={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  color: "#005B96",
                }}
                secondaryTypographyProps={{
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 400,
                  color: "#333333",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    
        
    <Paper elevation={4} sx={{ padding: "20px", marginBottom: "20px", width: "100%", maxWidth: "800px", borderRadius: "15px", backgroundColor: "#ffffff" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#005B96", fontWeight: "bold", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
            Liste des projets publics
        </Typography>
        <List>
            {projetsPublics.map((projet) => (
            <ListItem
                key={projet.id}
                onClick={() => handleProjectClick(projet.id)}
                sx={{
                backgroundColor: "#e3f2fd",
                marginBottom: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#00A676",
                    color: "#ffffff",
                },
                }}
            >
                <ListItemText
                primary={projet.name}
                secondary={projet.description}
                primaryTypographyProps={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "#005B96",
                }}
                secondaryTypographyProps={{
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: 400,
                    color: "#333333",
                }}
                />
            </ListItem>
            ))}
        </List>
        </Paper>
    </Box>
  );
};

export default ListeProjets;
