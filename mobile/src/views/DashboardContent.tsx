import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const apiUrl = process.env.API_URL;
type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
interface ProfileResponse {
    id:number,
    prenom: string,
    nom: string,
    admin: boolean
}

const DashboardContent: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();  // Appliquer le type ici
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  async function recupId() {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setUserId(null);
      return;
    }
    
    try {
        const response = await axios.get<any>(`${apiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.id || null);
    }catch (error) {
        console.error("Erreur :", error);
    }
  }

  async function getEvenements() {
    if (!userId) return;
    try {
      const response = await axios.get<any>(`${apiUrl}/evenements/${userId}`);
      setUpcomingEvents(response.data);
    } catch (err) {
      console.log(`Erreur lors de la récupération des événements`);
    }
  }

  async function getProjets() {
    if (!userId) return;
    try {
      const response = await axios.get<any>(`${apiUrl}/projets/display/chercheur/${userId}`);
      setUpcomingProjects(response.data);
    } catch (err) {
      console.log(`Erreur lors de la récupération des projets`);
    }
  }

  useEffect(() => {
    recupId();
  }, []);

  useEffect(() => {
    if (userId) {
      getEvenements();
      getProjets();
    }
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.sectionTitle}>Événements à venir</Text>
      {upcomingEvents.map((event, index) => {
        const date = new Date(event.date_fin);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        return (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventText}>
              {event.type} - {formattedDate} 
            </Text>
            <Text style={styles.eventProject}>{event.nom}</Text>
          </View>
        );
      })}
      
      <Text style={styles.sectionTitle}>Projets en cours</Text>
      {upcomingProjects.map((project) => (
        <TouchableOpacity key={project.id} style={styles.projectCard} onPress={() => navigation.navigate('DetailsProjet', { id: project.id })}>
          <Text style={styles.projectTitle}>{project.nom}</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
        </TouchableOpacity>
      ))}
    
    </ScrollView>
  );
};

export default DashboardContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  button: {
    backgroundColor: '#005B96',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: '#FFECB3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventProject: {
    fontSize: 14,
    color: '#666',
  },
  projectCard: {
    backgroundColor: '#C8E6C9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
});
