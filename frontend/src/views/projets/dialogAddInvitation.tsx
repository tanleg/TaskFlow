import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface DialogAddInvitationProps {
  open: boolean;
  onClose: () => void;
}

const DialogAddInvitation: React.FC<DialogAddInvitationProps> = ({ open, onClose }) => {
  const { id } = useParams();
  const projetId = parseInt(id!, 10); // Conversion en nombre

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    entreprise: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Gestion des changements dans les champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/partenaire/add`, {
        ...formData,
        projetId,
      });

      alert(`Partenaire ajouté avec succès. Lien: ${response.data.lien}`);
      onClose();
      setFormData({ nom: "", prenom: "", entreprise: "", email: "" }); // Réinitialisation
    } catch (error) {
      setError("Erreur lors de l'ajout du partenaire. Vérifiez les informations.");
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <IconButton onClick={onClose} aria-label="close" sx={{ position: "absolute", top: 10, right: 10 }}>
        <CloseIcon />
      </IconButton>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Ajouter un partenaire
        </Typography>

        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Nom" name="nom" value={formData.nom} onChange={handleChange} fullWidth required />
            <TextField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} fullWidth required />
            <TextField label="Entreprise" name="entreprise" value={formData.entreprise} onChange={handleChange} fullWidth required />
            <TextField label="Adresse mail" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" sx={{ background: "#005B96" }} disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
          <Button onClick={onClose} variant="outlined" color="error">
            Annuler
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DialogAddInvitation;
