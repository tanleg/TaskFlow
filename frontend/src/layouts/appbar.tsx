import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Drawer, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";

// Composant AppBar avec notifications
const AppBarComponent: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // État pour gérer l'ouverture/fermeture du tiroir

  // Fonction pour ouvrir/fermer le tiroir
  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  // Exemple de notifications avec des statuts
  const notifications = [
    { id: 1, text: "Nouvelle tâche assignée", status: "important" },
    { id: 2, text: "Message de l'équipe", status: "info" },
    { id: 3, text: "Mise à jour de votre projet", status: "warning" },
    { id: 4, text: "Rappel : Réunion à 14h", status: "default" },
  ];

  // Fonction pour déterminer la couleur de l'icône en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "important":
        return "#FF4D4F"; // Rouge
      case "info":
        return "#1890FF"; // Bleu
      case "warning":
        return "#FAAD14"; // Jaune
      default:
        return "#8C8C8C"; // Gris
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "#F3F3F5",
        marginLeft: "290px", // Décalage du contenu
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Icône de notification */}
          <IconButton
            aria-label="notifications"
            sx={{ color: "#000", marginLeft: "auto" }}
            onClick={toggleDrawer(true)}
          >
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tiroir des notifications */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 350,
            padding: 2,
            backgroundColor: "#F9F9F9",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333", fontWeight: "bold" }}>
            Notifications
          </Typography>
          <Divider />

          <List sx={{ marginTop: 1 }}>
            {/* Boucle pour afficher les notifications */}
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "8px",
                  "&:hover": { backgroundColor: "#F5F5F5" },
                  transition: "all 0.3s ease",
                }}
              >
                {/* Avatar avec icône circulaire de couleur selon le statut */}
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: getStatusColor(notification.status),
                      width: 32,
                      height: 32,
                    }}
                  >
                    <CircleIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.text}
                  primaryTypographyProps={{ sx: { color: "#333", fontWeight: "500" } }}
                />
              </ListItem>
            ))}
          </List>

          {/* Bouton pour fermer le tiroir */}
          <Box sx={{ marginTop: "auto", textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                "&:hover": { color: "#555" },
                transition: "color 0.3s ease",
              }}
              onClick={toggleDrawer(false)}
            >
              Fermer
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AppBarComponent;
