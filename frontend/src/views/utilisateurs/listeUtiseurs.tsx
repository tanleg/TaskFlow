import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper, TextField, IconButton } from "@mui/material";
import { Person, Delete } from "@mui/icons-material"; // Import des icônes
import axios from "axios";
import { Utilisateur } from "../../types/apps/utilisateur";
import DialogUserInfo from "./dialogUserInfo"; // Import du composant du dialogue

const apiUrl = import.meta.env.VITE_API_URL;

const ListeUtilisateurs: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Pour gérer l'ouverture du dialogue
  const [selectedUser, setSelectedUser] = useState<Utilisateur | null>(null); // Utilisateur sélectionné

  async function fetchUsers() {
    try {
      const response = await axios.get(`${apiUrl}/auth/user`);
      const formattedUsers = response.data.map((user: Utilisateur) => ({
        id: user.id,
        nom: `${user.prenom} ${user.nom}`,
        email: user.email,
        telephone: user.telephone,
        role: user.admin ? "Administrateur" : "Chercheur",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage des utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter((user) =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour gérer la suppression d'un utilisateur
  const handleDelete = (id: number) => {
      console.log(`Suppression de l'utilisateur avec l'ID: ${id}`);
      // Ici, tu peux ajouter une requête DELETE vers ton API
  };

  // Fonction pour afficher le profil d'un utilisateur
  const handleViewProfile = (user: Utilisateur) => {
    setSelectedUser(user); // Met à jour l'utilisateur sélectionné
    setOpenDialog(true); // Ouvre le dialogue
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Ferme le dialogue
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minHeight: "100vh" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "20px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "800px",
          borderRadius: "15px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#005B96",
            fontWeight: "bold",
            textAlign: "left",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Liste des utilisateurs
        </Typography>

        {/* Barre de recherche */}
        <TextField
          label="Rechercher un utilisateur"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "15px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                backgroundColor: "#e3f2fd",
                marginBottom: "10px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <ListItemText
                primary={user.nom} // Affichage prénom + nom
                primaryTypographyProps={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  color: "#005B96",
                }}
              />
              <ListItemText
                primary={user.role} // Affichage du rôle
                primaryTypographyProps={{
                  fontFamily: "Open Sans, sans-serif",
                  fontWeight: 600,
                  color: "#333333",
                  textAlign: "center",
                }}
              />

              {/* Icônes Actions */}
              <Box>
                <IconButton onClick={() => handleViewProfile(user)} sx={{ color: "#005B96" }}>
                  <Person />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)} sx={{ color: "#D32F2F" }}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Dialog de profil utilisateur */}
      <DialogUserInfo open={openDialog} onClose={handleCloseDialog} user={selectedUser} />
    </Box>
  );
};

export default ListeUtilisateurs;
