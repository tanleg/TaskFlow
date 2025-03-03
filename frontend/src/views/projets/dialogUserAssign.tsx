import React, { useState, forwardRef, Ref, ReactElement } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  IconButton,
  styled,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Fade, { FadeProps } from "@mui/material/Fade";

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
  color: theme.palette.grey[500],
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

interface DialogUserAssignProps {
  open: boolean;
  onClose: () => void;
  users: { id: number; name: string }[]; // Liste des utilisateurs
  onAssign: (userId: number, userName: string) => void; // Fonction pour assigner un utilisateur
}

const DialogUserAssign: React.FC<DialogUserAssignProps> = ({
  open,
  onClose,
  users,
  onAssign,
}) => {
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fonction pour sélectionner ou désélectionner un utilisateur
  const handleSelectUser = (userId: number, userName: string) => {
    if (selectedUserName === userName) {
      // Si l'utilisateur cliqué est déjà sélectionné, on le désélectionne
      setSelectedUserName(null);
      setSelectedUserId(null);
    } else {
      // Sinon, on sélectionne l'utilisateur
      setSelectedUserName(userName);
      setSelectedUserId(userId);
    }
  };

  const handleClose = () => {
    setSelectedUserName(null); // Réinitialiser la sélection de l'utilisateur
    setSelectedUserId(null); // Réinitialiser la sélection de l'utilisateur
    onClose(); // Appeler la fonction de fermeture de la boîte de dialogue
  };
  

  // Fonction pour assigner l'utilisateur sélectionné à la tâche
  const handleAssign = () => {
    if (selectedUserId && selectedUserName) {
      onAssign(selectedUserId, selectedUserName); // Appeler la fonction d'assignation avec le nom de l'utilisateur sélectionné
      handleClose(); // Fermer la boîte de dialogue
    }
  };



  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <CustomCloseButton onClick={handleClose} aria-label="close">
        <CloseIcon />
      </CustomCloseButton>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <Typography
          variant="h4"
          sx={{
            mt: 3,
            ml: 4,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#333333",
          }}
        >
          Assigner une tâche
        </Typography>
      </Box>

      <DialogContent sx={{ paddingTop: 2 }}>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} sm={4} key={user.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderRadius: "20px",
                  backgroundColor:
                    selectedUserName === user.name ? "#bbdefb" : "#e3f2fd",
                  cursor: "pointer",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#bbdefb",
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={() => handleSelectUser(user.id, user.name)}
              >
                <Typography
                  sx={{
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "1rem",
                    color: "#1976d2",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
          color="error"
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            borderColor: "#D32F2F",
            color: "#D32F2F",
            padding: "10px 20px",
            borderRadius: "8px",
            marginRight: "10px",
            marginBottom: "10px",
            "&:hover": {
              borderColor: "#D32F2F",
              color: "#D32F2F",
              backgroundColor: "#ffebee",
            },
          }}
        >
          Annuler
        </Button>

        <Button
          variant="contained"
          onClick={handleAssign}
          
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: selectedUserName
                ? "linear-gradient(135deg, #005B96, #00A676)"  // Dégradé si un utilisateur est sélectionné
                : "#B0BEC5", // Gris si aucun utilisateur n'est sélectionné
            "&:hover": {
                background: selectedUserName
                    ? "linear-gradient(135deg, #004a6e, #008d5c)"  // Dégradé au survol
                    : "#B0BEC5", // Gris au survol si aucun utilisateur n'est sélectionné
            },
          }}
          disabled={!selectedUserName}
        >
          Assigner
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUserAssign;