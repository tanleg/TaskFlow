import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const DashboardHeader: React.FC = () => {
  // Exemple d'utilisateur (cela peut être remplacé par des données réelles d'un système d'authentification)
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Simuler la récupération des données utilisateur (remplacer par des données réelles)
    const currentUser = "Alice"; // Vous pouvez récupérer cela à partir de l'authentification ou de l'état global
    setUser(currentUser);
  }, []);

  return (
    <Box sx={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="#333333">
        {user ? `Bonjour, ${user}` : "Bonjour Utilisateur"}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Aujourd'hui, {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default DashboardHeader;
