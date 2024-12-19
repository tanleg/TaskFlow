import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import { projects } from "frontend/src/views/projets/projects.ts";

const ListeProjets: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (id: number) => {
    navigate(`/projet/${id}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minHeight: "100vh" }}>
      <Paper elevation={4} sx={{ padding: "20px", marginBottom: "20px", width: "100%", maxWidth: "800px", borderRadius: "15px", backgroundColor: "#ffffff" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#005B96", fontWeight: "bold", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
          Liste de vos projets
        </Typography>
        <List>
          {projects.map((projet) => (
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
