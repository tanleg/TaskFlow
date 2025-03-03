// import React, { useState } from "react";
// import { Box, Typography, IconButton, Button } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import DeleteIcon from "@mui/icons-material/Delete";

// const File: React.FC = () => {
//   const [files, setFiles] = useState([
//     { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
//     { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
//     { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
//   ]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const newFile = {
//         name: event.target.files[0].name,
//         sharedBy: "Moi", // Remplace par le nom de l'utilisateur connecté
//         date: new Date().toLocaleDateString(),
//       };
//       setFiles([...files, newFile]);
//     }
//   };

//   return (
//     <Box sx={{ fontFamily: "Roboto, sans-serif", padding: "20px" }}>
//       <Button variant="contained" component="label" sx={{ marginBottom: "10px" }}>
//         Upload un fichier
//         <input type="file" hidden onChange={handleFileUpload} />
//       </Button>
//       {files.map((file, index) => (
//         <Box
//           key={index}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: "#d3d3d3",
//             padding: "10px",
//             borderRadius: "5px",
//             marginBottom: "5px",
//           }}
//         >
//           <Box>
//             <Typography sx={{ fontWeight: "bold" }}>{file.name}</Typography>
//             <Typography variant="body2">Partagé par : {file.sharedBy}</Typography>
//             <Typography variant="body2">Le : {file.date}</Typography>
//           </Box>
//           <Box>
//             <IconButton>
//               <DownloadIcon />
//             </IconButton>
//             <IconButton>
//               <DeleteIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default File;



import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button, Paper, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Définir le type des props
interface FileProps {
    projet_id: string;  // Le type du projet_id
}
  
  
const File: React.FC<FileProps> = ({ projet_id }) => {

    const [user_id, setId] = useState<string | null>(null);
    const [nom_utilisateur, setNom] = useState<string | null>(null);

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

    //   recupere le nom de l'utilisateur
    async function recup_nom() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error('Aucun token trouvé');
            setNom(null);
            return;
        }
    
        try {
            const response = await axios.get(`${apiUrl}/auth/profile`, {
                headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        setNom(`${response.data.prenom} ${response.data.nom}` || null);
        } catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur', error);
            setNom(null); // En cas d'erreur, réinitialisez l'utilisateur
        }
    };

    useEffect(() => {
      recup_id();
    }, []);

    useEffect(() => {
        recup_nom();
      }, [recup_id]);


  const [files, setFiles] = useState([
    { name: "fichier1.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
    { name: "fichier2.py", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
    { name: "fichier3.docx", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
  ]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];

        // Créer un objet FormData pour envoyer le fichier au serveur
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_projet", String(projet_id));  // Remplacer par l'ID du projet réel
        formData.append("id_utilisateur", String(user_id));  // Remplacer par l'ID de l'utilisateur réel
        formData.append("nom", file.name);

        try {
            // Envoi du fichier à l'API (assurez-vous d'avoir l'URL correcte)
            const response = await axios.post(`${apiUrl}/fichiers/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Si l'upload est réussi, ajouter le fichier à la liste des fichiers
            const newFile = {
            name: file.name,
            sharedBy: nom_utilisateur ?? "Utilisateur inconnu",  // Remplacer par le nom de l'utilisateur connecté
            date: new Date().toLocaleDateString()
            };
            
            setFiles([...files, newFile]); // Ajout du fichier à la liste des fichiers

            console.log("Fichier uploadé avec succès :", response.data);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        }
        event.target.value = "";
        }
    };

  const handleDeleteFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ fontFamily: "Montserrat, sans-serif", padding: "20px" }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{
            mr: 1,
            mb: "20px",
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #005B96, #00A676)",
            "&:hover": {
            background: "linear-gradient(135deg, #005B96, #00A676)",
            },
            padding: "10px 20px",
            borderRadius: "8px",
          }
        } 
        >
          Upload un fichier
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      

      {files.map((file, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px",
            backgroundColor: "#white",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography sx={{fontFamily: "Montserrat, sans-serif", fontWeight: "bold", color: "#333333" }}>{file.name}</Typography>
              <Typography variant="body2" sx={{ fontFamily: "Open Sans, sans-serif",color: "#333333" }}>Partagé par : {file.sharedBy}</Typography>
              <Typography variant="body2" sx={{fontFamily: "Open Sans, sans-serif", color: "#333333" }}>Le : {file.date}</Typography>
            </Grid>
            <Grid item>
              <IconButton sx={{ color: "#1976d2" }}>
                <DownloadIcon />
              </IconButton>
              <IconButton sx={{ color: "#d32f2f" }} onClick={() => handleDeleteFile(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      
    </Box>
  );
};

export default File;
