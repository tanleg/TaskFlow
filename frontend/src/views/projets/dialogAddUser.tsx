import React, { forwardRef, Ref, ReactElement, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Fade,
  styled,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FadeProps } from "@mui/material/Fade";
import DialogAddInvitation from "./dialogAddInvitation";
import axios from "axios";
import { Utilisateur } from "../../types/apps/utilisateur";
const apiUrl = import.meta.env.VITE_API_URL;

// Transition pour le dialog
const Transition = forwardRef(function Transition(
  props: FadeProps & { children: ReactElement },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

// Bouton de fermeture personnalisé
const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[3],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
    boxShadow: theme.shadows[6],
  },
}));

// Props pour le composant
interface DialogAddProjectsProps {
  open: boolean;
  onClose: () => void;
  id_projet: string;
}

const DialogAddUser: React.FC<DialogAddProjectsProps> = ({ open, onClose, id_projet }) => {
  const [search, setSearch] = useState(""); // Recherche dans la liste des membres
  const [members, setMembers] = useState<any[]>([]);

  const [selectedMembers, setSelectedMembers] = useState<number[]>([]); // IDs des membres sélectionnés
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Filtrer les membres selon la recherche
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  // Gérer la sélection d'un membre
  const handleSelectMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };
  
  async function fetchUsers() {
    try {
      const response = await axios.get(`${apiUrl}/auth/usersnotinprojet/${id_projet}`);

      const formattedUsers = response.data.map((user: Utilisateur) => ({
        id: user.id,
        name: `${user.prenom} ${user.nom}`,
        email: user.email,
        telephone: user.telephone,
        role: user.admin ? "Administrateur" : "Chercheur",
      }));

      setMembers(formattedUsers);
    
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      setMembers([]);
    }
  }

  async function ajouter_utilisateurs() {
    if (selectedMembers.length !== 0){
        for (const userId of selectedMembers) {
            try {
              await axios.post(`${apiUrl}/projets/ajouter/utilisateur`, {
                id: id_projet,
                id_utilisateur: userId,
              });
              console.log(`Utilisateur ${userId} associé avec succès au projet ${id_projet}`);
            } catch (error) {
              console.error(`Erreur lors de l'association de l'utilisateur ${userId} au projet ${id_projet}`, error);
            }
        }
        window.location.reload()    // reload pour afficher les users dans la liste
    }
  }

  useEffect(() => {
    if (id_projet) { // Vérifier si id_projet est bien défini
      fetchUsers();
    }
  }, [id_projet]); // Déclencher l'effet dès que id_projet change
  

  // Supprimer les membres sélectionnés
  // const handleDeleteSelected = () => {
  //   setMembers((prev) => prev.filter((member) => !selectedMembers.includes(member.id)));
  //   setSelectedMembers([]); // Réinitialiser la sélection
  // };

  // Rendre les membres sélectionnés administrateurs
  // const handleMakeAdmin = () => {
  //   setMembers((prev) =>
  //     prev.map((member) =>
  //       selectedMembers.includes(member.id) ? { ...member, role: "ADMIN" } : member
  //     )
  //   );
  //   setSelectedMembers([]); // Réinitialiser la sélection
  // };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      
      TransitionComponent={Transition}
      sx={{
        "& .MuiDialog-paper": {
          overflow: "visible",
          fontFamily: "Open Sans, sans-serif",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Bouton de fermeture */}
      <CustomCloseButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </CustomCloseButton>

      {/* Titre du dialog */}
      <Box  sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <Typography  variant="h4"
          sx={{
            mt:3,
            mb: 1,
            ml:4,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#333333",
          }}>
          Ajouter des membres
        </Typography>
      </Box>

      {/* Contenu du dialog */}
      <DialogContent>
        {/* Champ de recherche */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un membre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        {/* Liste des membres */}
        <List 
            sx={{
                maxHeight: "300px", // Limiter la hauteur de la liste
                overflowY: "auto",  // Activer le défilement vertical
                
                "&::-webkit-scrollbar": {
                width: "8px", // Largeur de la scrollbar
                },
                "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent", // Enlever les bordures en rendant le fond transparent
                },
                "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888", // Couleur de la barre de défilement
                borderRadius: "4px", // Rendre les coins arrondis
                },
                "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555", // Couleur au survol
                },
            }}
        >
          {filteredMembers.map((member) => (
            <ListItem
                key={member.id}
                sx={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: 1,
                padding: 1,
                cursor: "pointer", // Indiquer que l'élément est cliquable
                "&:hover": {
                    backgroundColor: "#f5f5f5", // Ajouter un effet visuel au survol
                },
                }}
                onClick={() => handleSelectMember(member.id)} // Gérer la sélection
            >
              <Checkbox
                checked={selectedMembers.includes(member.id)}
                onClick={(e) => e.stopPropagation()} // Empêcher la propagation de l'événement
              />
        
              <ListItemText
                primary={member.name}
                secondary={member.role}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      {/* Boutons d'actions */}
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "flex-end", // Alignement à droite (modifiable selon vos besoins)
          gap: 2, // Espacement entre les boutons
          px: 2,
          py: 2,
        }}
      >
        {/* <Button
          variant="outlined"
          color="error"
          disabled={selectedMembers.length === 0}
          onClick={handleDeleteSelected}
          
            sx={{
                fontFamily: "Open Sans, sans-serif",
                fontWeight: "bold",
                borderColor: "#D32F2F",
                color: "#D32F2F",
                padding: "10px 20px",
                borderRadius: "8px",
                "&:hover": {
                borderColor: "#D32F2F",
                color: "#D32F2F",
                },
            }}
        >
          Supprimer
        </Button> */}
        <Button 
            variant="outlined" 
            color="primary"
            onClick={handleOpenDialog}
            sx={{
                fontFamily: "Open Sans, sans-serif",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "8px",
            }}>
           Invitation
         </Button>
        {/* <Button
          variant="outlined"
          color="success"
          disabled={selectedMembers.length === 0}
          onClick={handleMakeAdmin}
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
        }}
        >
          Déclarer ADMIN
        </Button> */}
        <Button 
            variant="contained" 
            sx={{
                mr: 1,
                fontFamily: "Open Sans, sans-serif",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #005B96, #00A676)",
                "&:hover": {
                background: "linear-gradient(135deg, #005B96, #00A676)",
                },
                padding: "10px 20px",
                borderRadius: "8px",
            }}
            onClick={ajouter_utilisateurs}
            >
          Ajouter
        </Button>
      </DialogActions>
      <DialogAddInvitation open={openDialog} onClose={handleCloseDialog} />
    </Dialog>
    
  );
};

export default DialogAddUser;
