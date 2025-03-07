import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importation de l'icône

const apiUrl = process.env.API_URL;
type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface ProfileResponse {
    id: number;
    prenom: string;
    nom: string;
    admin: boolean;
}

interface Projet {
    id: number;
    name: string;
    description: string;
}

const DetailsProjet: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [project, setProject] = useState<Projet | null>(null);

  const navigation = useNavigation<DashboardNavigationProp>();
  const route = useRoute();
  const { id } = route.params as { id: number };

  async function recupId() {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.error('Aucun token trouvé');
      setUserId(null);
      return;
    }
    try {
        const response = await axios.get<ProfileResponse>(`${apiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.id || null);
    } catch (error) {
        console.error("Erreur :", error);
    }
  }

  async function getTaches() {
    try {
      const response = await axios.get<any>(`${apiUrl}/evenements/projet/taches/${id}`);
      const liste_taches = response.data.map((element: any) => ({
        id: element.id,
        name: element.nom,
        status: element.termine ? "Terminé" : "En cours",
        assignedTo: element.utilisateur ? `${element.utilisateur.prenom} ${element.utilisateur.nom}` : "Non assigné",
        startDate: element.date_debut,
        endDate: element.date_fin,
      }));
      setTasks(liste_taches);
    } catch (err: any) {
      console.log(`Erreur lors de la récupération des tâches: ${err.message}`);
    }
  }

  const handleTaskStatusChange = async (task: any, index: number) => {
        try {
            await axios.put(`${apiUrl}/evenements/tache/${task.id}/statut`);
            
            const updatedTasks = [...tasks];
            updatedTasks[index].status = updatedTasks[index].status === "Terminé" ? "En cours" : "Terminé";
            setTasks(updatedTasks);
            
        } catch (err: any) {
            console.error(`Erreur lors de la mise à jour du statut: ${err.message}`);
        }
      };

  async function getMembres() {
    try {
      const response = await axios.get<any>(`${apiUrl}/projets/${id}/users`);
      const liste_membres = response.data.map((element: any) => ({
        id: element.utilisateur.id,
        name: `${element.utilisateur.prenom} ${element.utilisateur.nom}`,
        role: element.visiteur ? "Visiteur" : element.chef ? "Chef de projet" : "Chercheur",
        email: element.utilisateur.email,
        telephone: element.utilisateur.telephone,
      }));
      setMembers(liste_membres);
    } catch (err: any) {
      console.log(`Erreur lors de la récupération des membres: ${err.message}`);
    }
  }

  async function getProjets() {
    try {
      const response = await axios.get<any>(`${apiUrl}/projets/display/chercheur/${userId}`);
      const projet = response.data.find((element: any) => element.id === id);
      if (projet) {
        setProject({
          id: projet.id,
          name: projet.nom,
          description: projet.description,
        });
      }
    } catch (err: any) {
      console.log(`Erreur lors de la récupération du projet: ${err.message}`);
    }
  }

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('fr-FR'); // Format: dd/mm/yyyy
  };

  useEffect(() => {
    recupId();
  }, []);

  useEffect(() => {
    if (userId && id) {
      getTaches();
      getMembres();
      getProjets();
    }
  }, [userId, id]);

  return (
    <ScrollView style={styles.container}>
      {project && (
        <View style={styles.projectHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#0288D1" />
          </TouchableOpacity>
          <Text style={styles.projectName}>{project.name}</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>👥 Membres du Projet</Text>
      {members.map((member) => (
        <View key={member.id} style={styles.memberCard}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.label}>
                <Text style={styles.boldText}>Rôle:</Text> {member.role}
            </Text>
            <Text style={styles.label}>
                <Text style={styles.boldText}>Email:</Text> {member.email}
            </Text>

            <Text style={styles.label}>
                <Text style={styles.boldText}>Téléphone:</Text> {member.telephone}
            </Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>📝 Tâches du Projet</Text>
      {tasks.map((task, index) => (
        <View
          key={task.id}
          style={[styles.taskCard, { backgroundColor: task.status === "Terminé" ? '#66BB6A' : '#FFEE58' }]}
        >
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.label}>
                <Text style={styles.boldText}>Statut:</Text> {task.status}
            </Text>

            <Text style={styles.label}>
                <Text style={styles.boldText}>Assigné à:</Text> {task.assignedTo}
            </Text>

            <Text style={styles.label}>
                <Text style={styles.boldText}>Début:</Text> {formatDate(task.startDate)}
            </Text>

            <Text style={styles.label}>
                <Text style={styles.boldText}>Fin:</Text> {formatDate(task.endDate)}
            </Text>

          <Switch
            value={task.status === "Terminé"}
            onValueChange={() => handleTaskStatusChange(task, index)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default DetailsProjet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  projectName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 15,
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  taskName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  memberCard: {
    backgroundColor: '#E1F5FE',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333333',
  },
  label: {
    color: '#333333',
  },
});

