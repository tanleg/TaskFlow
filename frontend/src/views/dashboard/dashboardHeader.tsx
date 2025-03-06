import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const DashboardHeader: React.FC = () => {
  
  const [user_prenom, setPrenom] = useState<string | null>(null);

//   recupere le prenom de l'utilisateur
  async function recup_prenom() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setPrenom(null);
      return;
    }
  
    try {
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setPrenom(response.data.prenom || null);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
      setPrenom(null); // En cas d'erreur, réinitialisez l'utilisateur
    }
  };


  useEffect(() => {
    // Simuler la récupération des données utilisateur (remplacer par des données réelles)
    recup_prenom();
  }, []);

  return (
    <Box sx={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="#333333">
        {user_prenom ? `Bonjour, ${user_prenom}` : "Bonjour Utilisateur"}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Aujourd'hui, {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default DashboardHeader;
