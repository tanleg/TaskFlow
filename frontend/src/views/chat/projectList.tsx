import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const apiUrl = import.meta.env.VITE_API_URL;

const ProjectList = () => {
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [user_id, setId] = useState<string | null>(null);

  const getProjets = async () => {
    if (!user_id) return;
    try {
      const response = await axios.get(`${apiUrl}/projets/display/chercheur/${user_id}`);
      const liste_projets = response.data.map((element: any) => ({
        id: element.id,
        name: element.nom,
        description: element.description,
      }));
      setUpcomingProjects(liste_projets);
    } catch (err: any) {
      console.log(`Erreur lors de la récupération des projets: ${err.message}`);
    }
  };

  async function recup_id() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Aucun token trouvé");
      setId(null);
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setId(response.data.id || null);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur", error);
      setId(null);
    }
  }

  useEffect(() => {
    recup_id();
  }, []);

  useEffect(() => {
    getProjets();
  }, [user_id]);

  return (
    <Container maxWidth="md" sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', padding: '2rem' }}>
      {upcomingProjects.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
          Pour accéder à cette page, vous devez être membre d'un projet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {upcomingProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card 
                  sx={{ 
                    borderRadius: '16px', 
                    boxShadow: 3, 
                    background: 'linear-gradient(135deg, #00A676, #005B96)', 
                    color: '#fff',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{project.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={Link} 
                      to={`/chat/${project.id}`}
                      state={{ projectName: project.name }} 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        backgroundColor: '#F5F5F5', 
                        color: '#333333', 
                        '&:hover': { backgroundColor: '#F5F5F5' },
                        fontWeight: 'bold'
                      }}
                    >
                      Ouvrir le chat
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectList;