import React, { forwardRef, Ref, ReactElement, useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Fade,
  styled,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FadeProps } from "@mui/material/Fade";
import axios from "axios";
import { useParams } from "react-router-dom";
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
interface DialogDeleteEventsProps {
  open: boolean;
  onClose: () => void;
}

const DialogDeleteEvents: React.FC<DialogDeleteEventsProps> = ({ open, onClose }) => {
  const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

  const [user_id, setId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set()); // Suivi des tâches sélectionnées

  async function recup_id() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Aucun token trouvé");
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
      console.error("Erreur lors de la récupération du profil utilisateur", error);
      setId(null);
    }
  }

  async function getTaches() {
    try {
      const response = await axios.get(`${apiUrl}/evenements/projet/taches/${id}`);

      const liste_taches = response.data.map((element: any) => ({
        id: element.id,
        name: element.nom,
        status: element.termine ? "Terminé" : "En cours",
        assignedTo: element.utilisateur ? `${element.utilisateur.prenom} ${element.utilisateur.nom}` : "Non assigné",
        startDate: element.date_debut,
        endDate: element.date_fin,
      }));
      
      setTasks(liste_taches);
    } catch (err: any) {
      console.error(`Erreur lors de la récupération des tâches: ${err.message}`);
    }
  }

  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(taskId)) {
        updatedSelected.delete(taskId);
      } else {
        updatedSelected.add(taskId);
      }
      return updatedSelected;
    });
  };


  useEffect(() => {
    recup_id();
  }, []);

  useEffect(() => {
    if (user_id) {
      getTaches();
    }
  }, [user_id]);

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
      fontFamily: "Montserrat, sans-serif",
      borderRadius: "20px",
      boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#f9f9f9",
      padding: "32px",
    },
  }}
>
  {/* Bouton de fermeture */}
  <CustomCloseButton onClick={onClose} aria-label="close">
    <CloseIcon />
  </CustomCloseButton>

  {/* Titre du dialog */}
  <Box sx={{ textAlign: "center", mb: 4 }}>
    <Typography
      variant="h4"
      sx={{
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "1.8rem",
        color: "#333",
      }}
    >
      Supprimer un évènement
    </Typography>
  </Box>

  {/* Conteneur avec barre de défilement */}
  <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
          <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sélection</TableCell>
          <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Nom de la tâche</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Checkbox
                checked={selectedTasks.has(task.id)}
                onChange={() => handleCheckboxChange(task.id)}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    borderRadius: "6px",
                    border: "2px solid #d1d1d1",
                    transition: "all 0.3s ease-in-out",
                  },
                  "&:hover .MuiSvgIcon-root": {
                    borderColor: "#1976d2",
                    boxShadow: "0 0 8px rgba(25, 118, 210, 0.5)",
                  },
                  "&.Mui-checked .MuiSvgIcon-root": {
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                    color: "#ffffff",
                  },
                  "&.Mui-checked:hover .MuiSvgIcon-root": {
                    backgroundColor: "#43a047",
                  },
                }}
              />
            </TableCell>
            <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>{task.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>

  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
    <Button
      variant="outlined"
      color="error"
      disabled={selectedTasks.size === 0}
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
      Supprimer
    </Button>
  </Box>
</Dialog>
  );
};

export default DialogDeleteEvents;
