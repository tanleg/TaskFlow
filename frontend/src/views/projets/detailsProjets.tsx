import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const DetailsProjet: React.FC = () => {
  const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

  // Simuler des données de projets
  const projets = [
    { id: 1, name: "Projet 1", description: "Détails du projet 1" },
    { id: 2, name: "Projet 2", description: "Détails du projet 2" },
    { id: 3, name: "Projet 3", description: "Détails du projet 3" },
  ];

  // Trouver le projet correspondant
  const projet = projets.find((p) => p.id === Number(id));

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
