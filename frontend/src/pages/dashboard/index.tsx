import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    
    const fetchUser = async () => {
        const token = localStorage.getItem('authToken'); // Récupérer le token
        if (!token) {
        console.error('Aucun token trouvé');
        return;
        }
    
        try {
        const response = await axios.get('http://localhost:3000/auth/profile', {
            headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
            },
        });
    
        console.log('Réponse de l\'API :', response.data);
        setUserId(response.data.id); // Stocker l'ID utilisateur dans le state
        } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        }
    };

    
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Bienvenue sur le tableau de bord</h1>
      {userId ? <p>ID utilisateur : {userId}</p> : <p>Chargement...</p>}
    </div>
  );
};

export default Dashboard;
