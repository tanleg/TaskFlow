import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiUrl = process.env.API_URL;

interface ProfileResponse {
    id:number,
    prenom: string,
    nom: string,
    admin: boolean
}

const DashboardHeader: React.FC = () => {
  const [userPrenom, setPrenom] = useState<string | null>(null);

  async function recupPrenom() {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setPrenom(null);
      return;
    }
  
    try {
      const response = await axios.get<ProfileResponse>(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrenom(response.data.prenom || null);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
      setPrenom(null);
    }
  }

  useEffect(() => {
    recupPrenom();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{userPrenom ? `Bonjour, ${userPrenom}` : 'Bonjour Utilisateur'}</Text>
      <Text style={styles.date}>Aujourd'hui, {new Date().toLocaleDateString()}</Text>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
});
