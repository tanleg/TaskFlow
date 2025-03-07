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

    const [nom_utilisateur, setNom] = useState<string | null>(null);
    
    type FileData = {
        name: string;
        sharedBy: string;
        date: string;
        version: number;
    };
    
    const [files, setFiles] = useState<FileData[]>([]);

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

    //   recupere le nom de l'utilisateur
    async function liste_fichiers() {
        try {
            const response = await axios.get(`${apiUrl}/fichiers/${projet_id}`);
            
            const liste = response.data.map((item: any) => ({
                name: item.nom,
                sharedBy: item.upload_par,
                date: new Date(item.date_upload).toLocaleDateString("fr-FR"),
                version: item.version
            }));

            setFiles(liste);
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers', error);
            setFiles([]);
        }
    };

    async function downloadFile(filename:string, version:number) {
        try {
            const lastDotIndex = filename.lastIndexOf('.');
            if (lastDotIndex === -1) {
                return `${filename}_v${version}`;
            }
            
            const name = filename.substring(0, lastDotIndex);
            const extension = filename.substring(lastDotIndex);
            const versionedFilename = `${name}_v${version}${extension}`;

            const response = await axios.get(`${apiUrl}/fichiers/download/${projet_id}/${versionedFilename}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', versionedFilename); // Nom du fichier à télécharger
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];

        // Créer un objet FormData pour envoyer le fichier au serveur
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_projet", projet_id);  // Remplacer par l'ID du projet réel
        formData.append("nom", file.name);
        formData.append("upload_par", nom_utilisateur ?? "");

        try {
            // Envoi du fichier à l'API (assurez-vous d'avoir l'URL correcte)
            const response = await axios.post(`${apiUrl}/fichiers/${projet_id}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            liste_fichiers();

            console.log("Fichier uploadé avec succès :", response.data);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        }
        event.target.value = "";
        }
    };

    async function handleDeleteFile(filename:string, version:number) {
        try {
            
            await axios.delete(`${apiUrl}/fichiers/delete/${projet_id}/${filename}/${version}`);
            liste_fichiers();

        } catch (error) {
            console.error('Erreur lors de la suppression du fichier', error);
        }
    };

  useEffect(() => {
    recup_nom();
    liste_fichiers();
  }, []);

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
              <Typography sx={{fontFamily: "Montserrat, sans-serif", fontWeight: "bold", color: "#333333" }}>{file.name} — Version {file.version}</Typography>
              <Typography variant="body2" sx={{ fontFamily: "Open Sans, sans-serif",color: "#333333" }}>Partagé par : {file.sharedBy}</Typography>
              <Typography variant="body2" sx={{fontFamily: "Open Sans, sans-serif", color: "#333333" }}>Le : {file.date}</Typography>
            </Grid>
            <Grid item>
              <IconButton sx={{ color: "#1976d2" }} onClick={() => downloadFile(file.name, file.version)}>
                <DownloadIcon />
              </IconButton>
              <IconButton sx={{ color: "#d32f2f" }} onClick={() => handleDeleteFile(file.name, file.version)}>
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
