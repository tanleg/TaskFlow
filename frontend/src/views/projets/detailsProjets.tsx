import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const DetailsProjet: React.FC = () => {
  const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
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
        }
    }, [user_id]);

  // Trouver le projet correspondant
  const projet = upcomingProjects.find((p) => p.id === Number(id));

  if (!projet) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Projet non trouvé
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "30px",
          maxWidth: "600px",
          borderRadius: "15px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", color: "#1976d2" }}>
          {projet.name}
        </Typography>
        <Typography variant="body1" sx={{ color: "#6b6b6b" }}>
          {projet.description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DetailsProjet;
