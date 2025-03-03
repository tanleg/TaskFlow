import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const AccessPage = () => {
  const { token } = useParams<{ token: string }>(); // Récupérer le token depuis l'URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await axios.get(`${apiUrl}/partenaire/access/${token}`);
        const partenaire = response.data;

        // Rediriger vers la page du projet
        navigate(`/projet/${partenaire.projet.id}/${token}`);
      } catch (err) {
        navigate(`/404`);
        setError("Lien invalide ou expiré.");
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, [token, navigate]);

  if (loading) return <p>Vérification en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return null;
};

export default AccessPage;
