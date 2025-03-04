import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import Timeline from "./timeline";
import File from "./file";
import ProgressBar from "./progressBar";
const apiUrl = import.meta.env.VITE_API_URL;

const DetailsProjetPartenaire: React.FC = () => {

  const { id_projet, token_partenaire } = useParams();

  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [partenaire_id, setId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [jalons, setJalons] = useState<any[]>([]);
  const [livrables, setLivrables] = useState<any[]>([]);

  // Fonction pour changer le statut d'une tâche à "Terminé" lorsqu'une checkbox est cochée
  const handleTaskStatusChange = async (task: any, index: number) => {

    try {
        await axios.put(`${apiUrl}/evenements/tache/${task.id}/statut`);
        
        const updatedTasks = [...tasks];
        updatedTasks[index].status = updatedTasks[index].status === "Terminé" ? "En cours" : "Terminé"; // Alterne le statut
        setTasks(updatedTasks);
        
    } catch (err: any) {
        console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
    }
  };

    // Fonction pour changer le statut d'un livrable à "Terminé" lorsqu'une checkbox est cochée
  const handleLivrableStatusChange = async (livrable: any, index: number) => {

    try {
        await axios.put(`${apiUrl}/evenements/livrable/${livrable.id}/statut`);
        
        const updatedLivrable = [...livrables];
        updatedLivrable[index].status = updatedLivrable[index].status === "Livré" ? "En cours" : "Livré"; // Alterne le statut
        setLivrables(updatedLivrable);
        
    } catch (err: any) {
        console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
    }
    };

  async function getTaches() {
    let tache;
    let liste_taches = [];

    try {
      const response = await axios.get(`${apiUrl}/evenements/projet/taches/${id_projet}`);
      
      for (let element of response.data) {

        tache = { 
            id: element.id,
            name: element.nom,
            status: element.termine ? "Terminé" : "En cours",
            assignedTo: element.utilisateur ? `${element.utilisateur.prenom} ${element.utilisateur.nom}` : "Non assigné",
            startDate: element.date_debut,
            endDate: element.date_fin,
        }
            
        liste_taches.push(tache);
      }
      setTasks(liste_taches);
    } catch (err: any) {
      console.log(`liste taches -> ${err.message}`);
    }
  }

  async function getJalons() {
    try {
      const response = await axios.get(`${apiUrl}/evenements/projet/jalons/${id_projet}`);
      
      const liste_jalons = [...jalons]; // On copie les jalons déjà présents
  
      for (let element of response.data) {
        const jalonExiste = liste_jalons.some(j => j.id === element.id); // Vérifie si le jalon existe déjà
        
        if (!jalonExiste) {
          const jalon = { 
            id: element.id,
            name: element.nom,
            endDate: element.date_fin,
          };
          liste_jalons.push(jalon);
        }
      }
      
      setJalons(liste_jalons); // Mise à jour de l'état avec la liste mise à jour
      
    } catch (err: any) {
      console.log(`liste jalons -> ${err.message}`);
    }
  }
  
  async function getLivrables() {
    try {
      const response = await axios.get(`${apiUrl}/evenements/projet/livrables/${id_projet}`);
      
      const liste_livrables = [...livrables]; // On copie les livrables déjà présents
  
      for (let element of response.data) {
        const livrableExiste = liste_livrables.some(j => j.id === element.id); // Vérifie si le livrable existe déjà
        
        if (!livrableExiste) {
          const livrable = { 
            id: element.id,
            name: element.nom,
            status: element.termine ? "Livré" : "En cours",
            endDate: element.date_fin,
          };
          liste_livrables.push(livrable);
        }
      }
      
      setLivrables(liste_livrables); // Mise à jour de l'état avec la liste mise à jour
      
    } catch (err: any) {
      console.log(`liste livrables -> ${err.message}`);
    }
  }

  async function getMembres() {
    let membre;
    let liste_membres = [];

    try {
      const response = await axios.get(`${apiUrl}/projets/${id_projet}/users`);
      
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

  async function getProjets() {
    let projet;
    let liste_projets = [];

    if (partenaire_id) {
      recup_infos_partenaire();
    } else {
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/projets/display/partenaire/${partenaire_id}`);
      for (let element of response.data) {
        projet = { id: element.id, name: element.nom, description: element.description };
        liste_projets.push(projet);
      }
      setUpcomingProjects(liste_projets);
    } catch (err: any) {
      console.log(`projets -> ${err.message} --> erreur car 0 projet`);
    }
  }

  async function createToken(token:string){
    try {
        const response = await axios.post(`${apiUrl}/partenaire/connexion/${token}`);

        console.log("token partenaire : ", response.data);
        
        if (response.data.accessToken)
            localStorage.setItem('authToken', response.data.accessToken);

    } catch (error) {
        console.error("Erreur token jwt partenaire:", error);
        alert("Erreur. Veuillez réessayer.");
    }
  }

  async function recup_infos_partenaire() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.error('Aucun token trouvé');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}/partenaire/profile-jwt`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(`${response.data.id} ${response.data.nom} ${response.data.prenom} ${response.data.admin}` || null);
        setId(response.data.id);

    } catch (error) {
        console.error('Erreur lors de la récupération du profil partenaire', error);
        setId(null);
    }
};

  
  useEffect(() => {
    createToken(token_partenaire??"")
    recup_infos_partenaire();
  }, []);

  useEffect(() => {
    if (partenaire_id) {
      getTaches();
      getJalons();
      getLivrables();
      getProjets();
      getMembres();
    }
  }, [partenaire_id]);

  const projet = upcomingProjects.find((p) => p.id === Number(id_projet));

  
  if (!projet) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Projet non trouvé
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "16px",
        marginLeft: "285px",
        backgroundColor: "#f4f6f8",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "30px",
          width: "100%",
          maxWidth: "1140px",
          borderRadius: "15px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            color: "#1976d2",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
          }}
        >
          {projet.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "15px", color: "#333333", fontFamily: "Open Sans, sans-serif" }}
        >
          {projet.description}
        </Typography>

        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "10px", color: "#1976d2", fontFamily:"Montserrat, sans-serif" }}>
            Membres
          </Typography>
          <Table>
            <TableHead>
              <TableRow >
                <TableCell sx={{ fontFamily:"Montserrat, sans-serif", fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ fontFamily:"Montserrat, sans-serif", fontWeight: "bold" }}>Rôle</TableCell>
                <TableCell sx={{ fontFamily:"Montserrat, sans-serif", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontFamily:"Montserrat, sans-serif", fontWeight: "bold" }}>Téléphone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.name}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.role}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.email}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.telephone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Section Tâches + livrables */}
        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", color: "#1976d2", fontFamily: "Montserrat, sans-serif" }}
          >
            Tâches
          </Typography>
          <Table>
            <TableHead>
              {/* <TableRow>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}></TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Nom tâche</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Personne assignée</TableCell>
              </TableRow> */}
            </TableHead>
            <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={task.status === "Terminé"}
                    onChange={() => handleTaskStatusChange(task, index)}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>{task.name}</TableCell>
                <TableCell
                  sx={{
                    color:
                      task.status === "Terminé"
                        ? "#4CAF50"
                        : task.status === "En cours"
                        ? "#FFC107"
                        : "#FF5722",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  {task.status}
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>
                  {task.assignedTo ? (
                    <>
                      {task.assignedTo}
                    </>
                  ) : (
                    <span>Non assigné</span> // Optionnel : message si la tâche n'est pas assignée
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          </Table>

          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", marginTop: "50px", color: "#1976d2", fontFamily: "Montserrat, sans-serif" }}
          >
            Livrables
          </Typography>
          <Table>
            <TableHead>
              {/* <TableRow>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}></TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Nom tâche</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Personne assignée</TableCell>
              </TableRow> */}
            </TableHead>
            <TableBody>
            {livrables.map((livrable, indexLivrable) => (
              <TableRow key={indexLivrable}>
                <TableCell>
                  <Checkbox
                    checked={livrable.status === "Livré"}
                    onChange={() => handleLivrableStatusChange(livrable, indexLivrable)}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>{livrable.name}</TableCell>
                <TableCell
                  sx={{
                    color:
                      livrable.status === "Livré"
                        ? "#4CAF50"
                        : livrable.status === "En cours"
                        ? "#FFC107"
                        : "#FF5722",
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  {livrable.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          </Table>
        </Box>

        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "10px", color: "#1976d2", fontFamily:"Montserrat, sans-serif" }}>
            Timeline
          </Typography>
          <Timeline tasks={tasks} jalons={jalons} livrables={livrables} />
          <ProgressBar tasks={tasks} livrables={livrables} />
        </Box>

        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "10px", color: "#1976d2", fontFamily:"Montserrat, sans-serif" }}>
            Fichiers
          </Typography>
          <File projet_id={id_projet ?? ""}/>
        </Box>

      </Paper>
      </Box>
    );
    };

export default DetailsProjetPartenaire;

