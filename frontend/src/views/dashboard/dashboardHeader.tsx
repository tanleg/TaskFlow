import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

const DashboardHeader: React.FC = () => {
  // Exemple d'utilisateur (cela peut être remplacé par des données réelles d'un système d'authentification)
  const [user_id, setId] = useState<number | null>(null);
  const [user_prenom, setPrenom] = useState<string | null>(null);


//   recupere l'id et le prenom de l'utilisateur
  async function recup_donnees() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setId(null);
      setPrenom(null);
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setId(response.data.id || null);
      setPrenom(response.data.prenom || null);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
      setId(null); // En cas d'erreur, réinitialisez l'utilisateur
      setPrenom(null); // En cas d'erreur, réinitialisez l'utilisateur
    }
  };


  useEffect(() => {
    // Simuler la récupération des données utilisateur (remplacer par des données réelles)
    recup_donnees();
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
