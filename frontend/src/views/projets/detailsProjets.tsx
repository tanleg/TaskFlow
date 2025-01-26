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


const DetailsProjet: React.FC = () => {
  const { id } = useParams(); // Récupère l'identifiant du projet depuis l'URL

  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [user_id, setId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

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

  // Fonction pour changer le statut d'une tâche à "Terminée" lorsqu'une checkbox est cochée
  const handleStatusChange = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = updatedTasks[index].status === "Terminée" ? "En cours" : "Terminée"; // Alterne le statut
    setTasks(updatedTasks);
  };

  // Fonction pour assigner une personne à une tâche
  const handleAssignTask = (index: number) => {
    setTaskToAssign(index); // Définit la tâche à assigner
    handleOpenDialogAssign(); // Ouvre la boîte de dialogue
  };

  const assignUserToTask = (userName: string) => {
    if (taskToAssign !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[taskToAssign].assignedTo = userName; // Attribue l'utilisateur à la tâche
      setTasks(updatedTasks);
      handleCloseDialogAssign(); // Ferme la boîte de dialogue
    }
  };

  async function getTaches() {
    let tache;
    let liste_taches = [];

    try {
      const response = await axios.get(`http://localhost:3000/evenements/projet/taches/${id}`);
      
      for (let element of response.data) {

        tache = { 
            name: element.nom,
            status: element.termine ? "Terminé" : "En cours",
            assignedTo: `${element.utilisateur.prenom} ${element.utilisateur.nom}`,
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


  async function getProjets() {
    let projet;
    let liste_projets = [];

    if (user_id) {
      recup_id();
    } else {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/projets/display/${user_id}`);
      for (let element of response.data) {
        projet = { id: element.id, name: element.nom, description: element.description };
        liste_projets.push(projet);
      }
      setUpcomingProjects(liste_projets);
    } catch (err: any) {
      console.log(`projets -> ${err.message} --> erreur car 0 projet`);
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
      const response = await axios.get("http://localhost:3000/auth/profile", {
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


  //Cette partie sera utilisé lorsque l'api pour changer de le rôle d'un utilisateur en ADMIN sera disponible

  // const handleMakeAdmin = async (memberId: number) => {
  //   try {
  //     // Appel API pour changer le rôle de l'utilisateur
  //     await axios.put(`http://localhost:3000/projets/${id}/users/${memberId}/make-admin`);

  //     // Mettre à jour localement l'état des membres
  //     setMembers((prev) =>
  //       prev.map((member) =>
  //         member.id === memberId ? { ...member, role: "ADMIN" } : member
  //       )
  //     );
  //   } catch (err: any) {
  //     console.error(`Erreur lors de la mise à jour du rôle: ${err.message}`);
  //   }
  // };

//Cette partie sera utilisé lorsque l'api pour virer un utilisateur du projet sera disponible

  // const handleRemoveMember = async (index: number) => {
  //   try {
  //     const memberToRemove = members[index];
  //     await axios.delete(`http://localhost:3000/projets/${id}/users/${memberToRemove.id}`);
  //     setMembers((prev) => prev.filter((_, i) => i !== index)); // Supprime localement
  //     console.log(`Membre ${memberToRemove.name} retiré avec succès.`);
  //   } catch (err: any) {
  //     console.error(`Erreur lors de la suppression du membre : ${err.message}`);
  //   }
  // };


  useEffect(() => {
    recup_id();
  }, []);

  useEffect(() => {
    if (user_id) {
      getTaches();
      getProjets();
      getMembres();
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
                    {member.role !== "ADMIN" && (
                      <Button
                       variant="outlined"
                      color="success"
                        // onClick={() => handleMakeAdmin(member.id)}
                      sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "8px",
                      }}
                      >
                        Déclarer admin
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      // onClick={() => handleRemoveMember(index)} // Fonction pour gérer la suppression
                      sx={{
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        marginLeft: "10px",
                      }}
                    >
                      Virer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Section Tâches */}
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
              <TableRow>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Action</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Nom tâche</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Statut</TableCell>
                <TableCell sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>Personne assignée</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={task.status === "Terminée"}
                    onChange={() => handleStatusChange(index)}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans, sans-serif" }}>{task.name}</TableCell>
                <TableCell
                  sx={{
                    color:
                      task.status === "Terminée"
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
                        onClick={() => handleAssignTask(index)}
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
          <Timeline tasks={tasks} />
        </Box>

      </Paper>
      <DialogUserAssign
        open={openDialogAssign}
        onClose={handleCloseDialogAssign}
        users={members} // Passez la liste des utilisateurs
        onAssign={assignUserToTask} // Fonction pour attribuer une tâche
      />
      <DialogAddUser open={openDialog} onClose={handleCloseDialog} />
      </Box>
    );
    };

export default DetailsProjet;

