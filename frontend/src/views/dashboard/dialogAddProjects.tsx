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
  FadeProps,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Icône de fermeture
import axios from "axios";
import { Utilisateur } from "../../types/apps/utilisateur";
const apiUrl = import.meta.env.VITE_API_URL;

// Transition component for the Dialog
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

// Styled button for closing the Dialog
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

// Props for the Dialog component
interface DialogAddProjectsProps {
  open: boolean;
  onClose: () => void;
}

const DialogAddProjects: React.FC<DialogAddProjectsProps> = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [projectVisibility, setProjectVisibility] = useState("Privé");
  const [users, setUsers] = useState<Utilisateur[]>([]);

  const handleUserChange = (event: SelectChangeEvent<typeof selectedUsers>) => {
    const value = event.target.value;
    setSelectedUsers(typeof value === "string" ? value.split(",") : value);
  };

  const handleProjectVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectVisibility(event.target.value);
  };

  // Handle closing the dialog and reset form
  const handleClose = () => {
    // Reset form fields
    setProjectName("");
    setProjectDescription("");
    setSelectedUsers([]);
    onClose(); // Close the dialog
  };
  
  const [user_id, setId] = useState<string | null>(null);

  async function recup_id() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setId(null);
      return;
    }
    
    try {
        const response = await axios.get(`${apiUrl}/auth/profile`, {
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

  async function fetchUsers() {
    try {
      const response = await axios.get(`${apiUrl}/auth/otherusers/${user_id}`);

      const formattedUsers = response.data.map((user: Utilisateur) => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        admin: user.admin,
      }));

      setUsers(formattedUsers);
    
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      setUsers([]);
    }
  }

  const creer_projet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectName && projectDescription && projectVisibility) {  
      let statut = projectVisibility === "Public" ? true : false;
  
      if (!user_id) {
        alert("Utilisateur non identifié.");
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/projets/create`, {
          nom: projectName,
          description: projectDescription,
          public: statut,
          utilisateurId: user_id
        });
  
        const projetId = response.data.id;
        
        for (const userId of selectedUsers) {
            try {
              await axios.post(`${apiUrl}/projets/ajouter/utilisateur`, {
                id: projetId,
                id_utilisateur: userId,
              });
              console.log(`Utilisateur ${userId} associé avec succès au projet ${projetId}`);
            } catch (error) {
              console.error(`Erreur lors de l'association de l'utilisateur ${userId} au projet ${projetId}`, error);
            }
          }

        // handleClose();
        ////// pas ouf :
        window.location.reload()    // reload pour afficher le projet dans la liste
        // faire une fonction pour afficher --> mieux et + fluide
        //////
      
    } catch (error) {
        console.error("Erreur lors de la création du projet :", error);
        alert("Erreur lors de la création. Veuillez réessayer.");
    }

    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };
  
  useEffect(() => {
    recup_id();
  }, []);
  
  useEffect(() => {
    if (user_id) {
      fetchUsers();
    }
  }, [user_id]);
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="body"
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
      <CustomCloseButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </CustomCloseButton>

      {/* Dialog Title with Icon */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        
        <Typography
          variant="h4"
          sx={{
            mt:3,
            mb: 1,
            ml:4,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#333333",
          }}
        >
          Nouveau projet
        </Typography>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ paddingTop: "1px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du projet"
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{
            fontFamily: "Open Sans, sans-serif",
            marginBottom: "16px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            color: "#333333",
          }}
        />
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Utilisateurs</InputLabel>
            <Select
              multiple
              value={selectedUsers}
              onChange={handleUserChange}
              label="Utilisateurs"
              renderValue={(selected) => (
                <div>
                  {selected.map((userId) => {
                    const user = users.find((u) => String(u.id) === userId);
                    return (
                      user && (
                        <Chip
                          key={user.id}
                          label={`${user.prenom} ${user.nom}`}
                          sx={{
                            margin: 0.5,
                            backgroundColor: "#F0F0F0",
                            borderRadius: "16px",
                          }}
                        />
                      )
                    );
                  })}
                </div>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 5 + 8, // Limite la hauteur à 5 éléments visibles (48px par élément + espacement)
                    overflowY: "auto", // Active la barre de défilement verticale
                  },
                },
              }}
              sx={{
                fontFamily: "Open Sans, sans-serif",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                color: "#333333",
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  <Checkbox checked={selectedUsers.indexOf(String(user.id)) > -1} />
                  <ListItemText
                    primary={`${user.prenom} ${user.nom} — ✉️${user.email} • 📞${user.telephone} | ${
                      user.admin ? "Administrateur" : "Chercheur"
                    }`}
                  />
                </MenuItem>
              ))}
            </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Description"
          type="text"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          sx={{
            fontFamily: "Open Sans, sans-serif",
            marginTop: "16px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            color: "#333333",
          }}
        />

        {/* Radio Buttons for Project Type */}
        <FormControl component="fieldset" sx={{ marginTop: "16px" }}>
          <RadioGroup
            value={projectVisibility}
            onChange={handleProjectVisibilityChange}
            row
            sx={{ display: "flex", justifyContent: "space-around" }}
          >
            <FormControlLabel
              value="Privé"
              control={<Radio />}
              label="Privé"
              sx={{ color: "#333333" }}
            />
            <FormControlLabel
              value="Public"
              control={<Radio />}
              label="Public"
              sx={{ color: "#333333" }}
            />
          </RadioGroup>
        </FormControl>
        
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ pb: 2 }}> {/* pb: 2 ajoute de l'espace en bas */}
        <Button
          onClick={creer_projet}
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
        >
          Ajouter
        </Button>
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
            "&:hover": {
              borderColor: "#D32F2F",
              color: "#D32F2F",
            },
          }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAddProjects;
