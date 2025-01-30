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
import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Paper, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const File: React.FC = () => {
  const [files, setFiles] = useState([
    { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
    { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
    { name: "Christophe.pdf", sharedBy: "Tanguy LE GOFF", date: "18/10/2024" },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFile = {
        name: event.target.files[0].name,
        sharedBy: "Moi", // Remplace par le nom de l'utilisateur connecté
        date: new Date().toLocaleDateString(),
      };
      setFiles([...files, newFile]);
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
        }} 
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
