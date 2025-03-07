import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import DialogAddUser from "./dialogAddUser";
import DialogUserAssign from "./dialogUserAssign";
import EditIcon from "@mui/icons-material/Edit";
import Timeline from "./timeline";
import File from "./file";
import ProgressBar from "./progressBar";
import EventButtons from "./eventsButtons";
const apiUrl = import.meta.env.VITE_API_URL;

const DetailsProjet: React.FC = () => {
  const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [user_id, setId] = useState<string | null>(null);
  const [isChef, setChef] = useState<boolean | null>(null);
  const [afficherBtns, affichageBtns] = useState<boolean>(true);
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [jalons, setJalons] = useState<any[]>([]);
  const [livrables, setLivrables] = useState<any[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAssign, setOpenDialogAssign] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState<number | null>(null); // Index de la tâche à assigner

  const handleOpenDialog = () => setOpenDialog(true);
  const handleOpenDialogAssign = () => setOpenDialogAssign(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskToAssign(null);
  };
  const handleCloseDialogAssign = () => {
    setOpenDialogAssign(false);
    setTaskToAssign(null);
  }

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

  // Fonction pour assigner une personne à une tâche
  const handleAssignTask = (id_task: number) => {
    setTaskToAssign(id_task); // Définit la tâche à assigner
    handleOpenDialogAssign(); // Ouvre la boîte de dialogue
  };

  const assignUserToTask = async (userId: number, userName: string) => {

    if (taskToAssign !== null) {
        
        try {
            await axios.put(`${apiUrl}/evenements/assigner/chef`, {
                id_tache: taskToAssign,
                id_utilisateur_assigne: userId       
            });
            
            const taskIndex = tasks.findIndex(task => task.id === taskToAssign);
            
            if (taskIndex !== -1) {
                const updatedTasks = [...tasks];
                updatedTasks[taskIndex] = {
                    ...updatedTasks[taskIndex],
                    assignedTo: userName
                };

                setTasks(updatedTasks); // Met à jour l'état avec la nouvelle liste de tâches
            }

            handleCloseDialogAssign(); // Ferme la boîte de dialogue
            
        } catch (err: any) {
            console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
        }
    }
  };

  async function getTaches() {
    let tache;
    let liste_taches = [];

    try {
      const response = await axios.get(`${apiUrl}/evenements/projet/taches/${id}`);
      
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
      const response = await axios.get(`${apiUrl}/evenements/projet/jalons/${id}`);
      
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
      const response = await axios.get(`${apiUrl}/evenements/projet/livrables/${id}`);
      
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


  async function getProjets() {
    let projet;
    let liste_projets = [];

    if (user_id) {
      recup_id();
    } else {
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/projets/display/chercheur/${user_id}`);
      for (let element of response.data) {
        projet = { id: element.id, name: element.nom, description: element.description };
        liste_projets.push(projet);
      }
      setUpcomingProjects(liste_projets);
    } catch (err: any) {
      console.log(`projets -> ${err.message} --> erreur car 0 projet`);
    }
  }


  async function enlever_chef(memberId: number) {
    try {
        await axios.put(`${apiUrl}/projets/${id}/users/${memberId}/deprive-admin`);
  
        setMembers((prev) =>
          prev.map((member) =>
            member.id === memberId ? { ...member, role: "Chercheur" } : member
          )
        );
      } catch (err: any) {
        console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
    }
  }


  async function declarer_chef(memberId: number) {

    try {
        await axios.put(`${apiUrl}/projets/${id}/users/${memberId}/make-admin`);
  
        setMembers((prev) =>
          prev.map((member) =>
            member.id === memberId ? { ...member, role: "Chef de projet" } : member
          )
        );

        enlever_chef(Number(user_id))
        affichageBtns(false)
      } catch (err: any) {
        console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
    }
  }

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

  async function chef() {

    try {
      const response = await axios.get(`${apiUrl}/projets/${id}/${Number(user_id)}/chef`);
      setChef(response.data.chef);
    } catch (error) {
      console.error("Erreur lors de la récupération du chef", error);
    }
  }

  async function exclure(index: number) {

    console.log(id)
    console.log(members[index].id)
    try {
      const memberToRemove = members[index];
      await axios.delete(`${apiUrl}/projets/supprimer/utilisateur`, {
        data: {
          id: id, // L'ID du projet
          id_utilisateur: memberToRemove.id, // L'ID de l'utilisateur à supprimer
        }
      });

      setMembers((prev) => prev.filter((_, i) => i !== index)); // Supprime localement
      console.log(`Membre ${memberToRemove.name} retiré avec succès.`);
    } catch (err: any) {
      console.error(`Erreur lors de la suppression du membre : ${err.message}`);
    }
  };


  useEffect(() => {
    recup_id();
  }, []);

  useEffect(() => {
    if (user_id) {
        getTaches();
        getJalons();
        getLivrables();
        getProjets();
        getMembres();
        chef()
    }
  }, [user_id]);

  const projet = upcomingProjects.find((p) => p.id === Number(id));

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
          <Button
            variant="contained"
            sx={{
              fontFamily: "Open Sans, sans-serif",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #005B96, #00A676)",
              "&:hover": {
                background: "linear-gradient(135deg, #004080, #007F56)",
              },
              padding: "10px 20px",
              borderRadius: "12px",
              marginLeft: "20px",
            }}
            onClick={handleOpenDialog}
          >
            Ajouter un utilisateur
          </Button>
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
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.name}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.role}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.email}</TableCell>
                  <TableCell sx={{ fontFamily:"Open Sans, sans-serif" }}>{member.telephone}</TableCell>
                  <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>
                    
                    {member.role !== "Chef de projet" && member.role !== "Visiteur" && isChef == true && afficherBtns == true && (
                      <Button
                       variant="outlined"
                       color="success"
                       onClick={() => declarer_chef(member.id)}
                      sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "8px",
                      }}
                      >
                        Déclarer chef de projet
                      </Button>
                    )}
                    
                    {member.role !== "Chef de projet" && member.role !== "Visiteur" && isChef == true && afficherBtns == true && (
                        <Button
                      variant="outlined"
                      color="error"
                      onClick={() => exclure(index)} // Fonction pour gérer la suppression
                      sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        marginLeft: "10px",
                      }}
                    >
                      Exclure
                    </Button>
                    )}
                  </TableCell>
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
                      <Button
                        sx={{ marginLeft: "10px" }}
                        onClick={() => handleAssignTask(task.id)}
                      >
                        <EditIcon/>
                      </Button>
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
          <EventButtons />
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
          <File projet_id={id ?? ""}/>
        </Box>

      </Paper>
      <DialogUserAssign
        open={openDialogAssign}
        onClose={handleCloseDialogAssign}
        users={members} // Passez la liste des utilisateurs
        onAssign={assignUserToTask} // Fonction pour attribuer une tâche
      />
      <DialogAddUser open={openDialog} onClose={handleCloseDialog} id_projet={id ?? ""}/>
      
      </Box>
    );
    };

export default DetailsProjet;

