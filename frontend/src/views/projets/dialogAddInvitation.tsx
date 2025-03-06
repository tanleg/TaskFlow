// import React, { forwardRef, Ref, ReactElement } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   IconButton,
//   Fade,
//   styled,
//   Box,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { FadeProps } from "@mui/material/Fade";

// // Transition pour le dialog
// const Transition = forwardRef(function Transition(
//   props: FadeProps & { children: ReactElement },
//   ref: Ref<unknown>
// ) {
//   return <Fade ref={ref} {...props} />;
// });

// // Bouton de fermeture personnalisé
// const CustomCloseButton = styled(IconButton)(({ theme }) => ({
//   top: 0,
//   right: 0,
//   color: "grey.500",
//   position: "absolute",
//   boxShadow: theme.shadows[3],
//   transform: "translate(10px, -10px)",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: `${theme.palette.background.paper} !important`,
//   transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
//   "&:hover": {
//     transform: "translate(7px, -5px)",
//     boxShadow: theme.shadows[6],
//   },
// }));

// // Props pour le composant
// interface DialogAddProjectsProps {
//   open: boolean;
//   onClose: () => void;
// }

// const DialogAddInvitation: React.FC<DialogAddProjectsProps> = ({ open, onClose }) => {
//     const handleClose = () => {
//         // Reset form fields
//         onClose(); // Close the dialog
//       };
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
      
//       TransitionComponent={Transition}
//       sx={{
//         "& .MuiDialog-paper": {
//           overflow: "visible",
//           fontFamily: "Open Sans, sans-serif",
//           borderRadius: "16px",
//           boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//         },
//       }}
//     >
//       {/* Bouton de fermeture */}
//       <CustomCloseButton onClick={onClose} aria-label="close">
//         <CloseIcon />
//       </CustomCloseButton>

//       {/* Titre du dialog */}
//       <Box  sx={{ mb: 3, display: "flex", alignItems: "center" }}>
//         <Typography  variant="h4"
//           sx={{
//             mt:3,
            
//             ml:4,
//             fontFamily: "Montserrat, sans-serif",
//             fontWeight: "bold",
//             fontSize: "1.5rem",
//             color: "#333333",
//           }}>
//           Ajouter un partenaire
//         </Typography>
//       </Box>

//       {/* Contenu du dialog */}
//       <DialogContent>
//   {/* Formulaire d'invitation */}
//   <Box
//     component="form"
//     sx={{
//       display: "flex",
//       flexDirection: "column",
//       gap: 2, // Espacement entre les champs
//       mt: 1,
//     }}
//   >
//     <TextField
//       label="Nom"
//       variant="outlined"
//       fullWidth
//       sx={{
//         "& .MuiOutlinedInput-root": { borderRadius: "8px" },
//       }}
//     />
//     <TextField
//       label="Prénom"
//       variant="outlined"
//       fullWidth
//       sx={{
//         "& .MuiOutlinedInput-root": { borderRadius: "8px" },
//       }}
//     />
//     <TextField
//       label="Entreprise"
//       variant="outlined"
//       fullWidth
//       sx={{
//         "& .MuiOutlinedInput-root": { borderRadius: "8px" },
//       }}
//     />
//     <TextField
//       label="Adresse mail"
//       type="email"
//       variant="outlined"
//       fullWidth
//       sx={{
//         "& .MuiOutlinedInput-root": { borderRadius: "8px" },
//       }}
//     />
//     </Box>
// </DialogContent>


//       {/* Boutons d'actions */}
//         <DialogActions sx={{ pb: 2,marginRight: 2 }}>
//         <Button
            
//             variant="contained"
//             sx={{
//                 mr: 1,
//                 fontFamily: "Open Sans, sans-serif",
//                 fontWeight: "bold",
//                 background: "linear-gradient(135deg, #005B96, #00A676)",
//                 "&:hover": {
//                 background: "linear-gradient(135deg, #005B96, #00A676)",
//                 },
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//             }}
//             >
//             Ajouter
//             </Button>
//             <Button
//             variant="outlined"
//             onClick={handleClose}
//             color="error"
//             sx={{
//                 fontFamily: "Open Sans, sans-serif",
//                 fontWeight: "bold",
//                 borderColor: "#D32F2F",
//                 color: "#D32F2F",
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//                 "&:hover": {
//                 borderColor: "#D32F2F",
//                 color: "#D32F2F",
//                 },
//             }}
//             >
//             Annuler
//             </Button>
//          </DialogActions>
//     </Dialog>
//   );
// };

// export default DialogAddInvitation;

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
