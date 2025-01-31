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
  Button,
  DialogActions
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
        livrableName: "",
    });

    const [members, setMembers] = useState<any[]>([]);
    
    async function getMembres() {
        let membre;
        let liste_membres = [];
    
        try {
          const response = await axios.get(`${apiUrl}/projets/${id}/users`);
          
          for (let element of response.data) {
    
            membre = { 
                id: element.utilisateur.id,
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

      async function ajouterEvenement() {

        try {
            if (!id) {
                console.error("ID du projet introuvable.");
                return;
            }
    
            let payload: any = {};
            let endpoint = ''

            if (type === "tache") {
                    
                endpoint = `${apiUrl}/evenements/tache/create`;
    
                payload = {
                    nom: formData.nomtache,
                    date_fin: new Date(formData.endDate).toISOString(),
                    date_debut: new Date(formData.startDate).toISOString(),
                    id_projet: id,
                    id_utilisateur: formData.assignedTo,
                };

            console.log(payload)


            } else if (type === "jalon") {
                
                endpoint = `${apiUrl}/evenements/jalon/create`;
                
                payload = {
                    nom: formData.milestoneName,
                    date_fin: new Date(formData.endDate).toISOString(),
                    id_projet: id,
                };

            } else if (type === "livrable") {
                
                endpoint = `${apiUrl}/evenements/livrable/create`;

                payload = {
                    nom: formData.livrableName,
                    date_fin: new Date(formData.endDate).toISOString(),
                    id_projet: id,
                };

            } else {
                console.error("Type d'événement non reconnu.");
                return;
            }
    
            const response = await axios.post(endpoint, payload);
    
            console.log(`${type} ajouté(e) avec succès :`, response.data);
    
            handleCancel();
        } catch (error: any) {
            console.error(`Erreur lors de l'ajout de ${type} : ${error.message}`);
        }
    }
    

    useEffect(() => {
        getMembres();
    }, []);


    const handleCancel = () => {
      onClose();
      setType("");
      setFormData({ // Réinitialise les champs du formulaire
        startDate: "",
        endDate: "",
        assignedTo: "",
        nomtache: "",
        milestoneName: "",
        livrableName: "",
      });
    };

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
                SelectProps={{
                  renderValue: (selected: unknown) => { // Utilisez `unknown` pour correspondre au type attendu
                    const selectedMember = members.find(member => member.id === selected);
                    return (
                      <Typography>
                        {selectedMember ? `${selectedMember.name} - ${selectedMember.role}` : selected as string}
                      </Typography>
                    );
                  },
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Hauteur maximale du menu
                        overflow: 'auto', // Active la barre de défilement
                        '&::-webkit-scrollbar': { // Style pour WebKit (Chrome, Safari, etc.)
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': { // Style du curseur de la barre de défilement
                          backgroundColor: '#888',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': { // Style de la piste de la barre de défilement
                          backgroundColor: '#f1f1f1',
                        },
                      },
                    },
                  },
                }}
                >
                {members.map((member, index) => (
                    <MenuItem key={index} value={member.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#333' }}>{member.name}</Typography>
                        <Typography sx={{ color: '#666', fontStyle: 'italic' }}>{member.role}</Typography>
                    </MenuItem>
                ))}
                </TextField>
                <Box sx={{ display: 'flex', gap: 2 }}> {/* Conteneur flex pour les dates */}
                  <TextField
                    label="Date de début"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Date de fin"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                </Box>
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

            {type === "livrable" && (
                <>
                    <TextField
                    label="Nom du livrable"
                    name="livrableName"
                    value={formData.livrableName}
                    onChange={handleChange}
                    fullWidth
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
          <DialogActions sx={{ pb: 2 }}> {/* pb: 2 ajoute de l'espace en bas */}
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
              onClick={ajouterEvenement}
            >
              Ajouter
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
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
        </Box>
      </Dialog>
    );
    };

export default DialogAddEvents;
