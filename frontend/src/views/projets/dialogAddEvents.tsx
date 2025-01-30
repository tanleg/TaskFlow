import React, { forwardRef, Ref, ReactElement, useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Fade,
  styled,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FadeProps } from "@mui/material/Fade";
import axios from "axios";
import { useParams } from "react-router-dom";

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
interface DialogAddEventsProps {
  open: boolean;
  onClose: () => void;
}

const DialogAddEvents: React.FC<DialogAddEventsProps> = ({ open, onClose }) => {
    const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

    const [type, setType] = useState("");
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        assignedTo: "",
        nomtache: "",
        milestoneName: "",
    });

    const [members, setMembers] = useState<any[]>([]);
    async function getMembres() {
        let membre;
        let liste_membres = [];
    
        try {
          const response = await axios.get(`http://localhost:3000/projets/${id}/users`);
          
          for (let element of response.data) {
    
            membre = { 
                name: `${element.utilisateur.prenom} ${element.utilisateur.nom}`,
                role: element.visiteur ? "Visiteur" : element.chef ? "Chef de projet" : "Chercheur",
                email: element.utilisateur.email,
                telephone: element.utilisateur.telephone,
            }
                
            liste_membres.push(membre);
          }
          setMembers(liste_membres);
        } catch (err: any) {
          console.log(`liste membres -> ${err.message}`);
        }
      }

    useEffect(() => {
        getMembres();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            fontFamily: "Poppins, sans-serif",
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
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "1.8rem",
                color: "#333",
            }}
            >
            Ajouter un évènement
            </Typography>
        </Box>

        {/* Formulaire */}
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
            select
            label="Type d'évènement"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            >
            <MenuItem value="tache">Tâche</MenuItem>
            <MenuItem value="jalon">Jalon</MenuItem>
            <MenuItem value="livrable">Livrable</MenuItem>
            </TextField>

            {/* Champs pour les tâches */}
            {type === "tache" && (
            <>
            <TextField
                label="Nom de la tâche"
                name="nomtache"
                value={formData.nomtache}
                onChange={handleChange}
                fullWidth
                multiline
                />
                <TextField
                select
                label="Personne assignée"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                fullWidth
                >
                {members.map((member, index) => (
                    <MenuItem key={index} value={member.email}> {/* Ici, on utilise l'email comme valeur, tu peux changer ça selon ton besoin */}
                    {member.name} - {member.role}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                label="Date de début"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                />
                <TextField
                label="Date de fin"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                />
                
                
            </>
            )}

            {/* Champs pour les jalons */}
            {type === "jalon" && (
            <>
                <TextField
                label="Nom du jalon"
                name="milestoneName"
                value={formData.milestoneName}
                onChange={handleChange}
                fullWidth
                />
                <TextField
                select
                label="Personne assignée"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                fullWidth
                >
                {members.map((member, index) => (
                    <MenuItem key={index} value={member.email}> {/* Ici, on utilise l'email comme valeur, tu peux changer ça selon ton besoin */}
                    {member.name} - {member.role}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                label="Date de fin"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                />
                
            </>
            )}

            <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, alignSelf: "center", fontWeight: "bold" }}
            >
            Ajouter
            </Button>
        </Box>
        </Dialog>
    );
    };

export default DialogAddEvents;
