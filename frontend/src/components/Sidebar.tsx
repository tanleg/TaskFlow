import axios from "axios";
import { useEffect, useState } from "react";
import { FaTachometerAlt, FaProjectDiagram, FaComments, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Importation de Link et useNavigate pour la navigation
import logo from 'frontend/public/logo.png';

const apiUrl = import.meta.env.VITE_API_URL; // URL de l'API définie dans les variables d'environnement

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Fonction de déconnexion qui supprime le token et redirige vers la page de connexion
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Retirer le token d'authentification
    navigate("/"); // Redirection vers la page de connexion
  };

  const [isAdmin, setAdmin] = useState<string | null>(null); // État pour vérifier si l'utilisateur est admin

  // Fonction pour récupérer l'état admin de l'utilisateur
  async function set_admin_state() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Aucun token trouvé');
      setAdmin(null);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(response.data.admin || null); // Mise à jour de l'état admin
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
      setAdmin(null);
    }
  }

  // Exécution de la fonction lors du chargement du composant
  useEffect(() => {
    set_admin_state();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "250px",
        height: "100vh",
        background: "linear-gradient(135deg, #005B96, #00A676)",
        color: "var(--text-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        fontFamily: "var(--font-text)",
        borderRadius: "2px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <nav style={{ width: "100%" }}>
        <ul style={{ listStyle: "none", padding: 0, width: "100%", height: "100%" }}>
          <li style={{ marginBottom: "30px", display: "flex", alignItems: "center", paddingLeft: "15px", fontSize: "24px", color: "white", fontWeight: "bold" }}>
            <Link
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#333333",
                fontSize: "26px",
                fontWeight: "bold",
                fontFamily: "monserrat",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >

            <img
              src={logo}
              style={{ height: "60px", marginRight: "10px" }}
            />

            </Link>
          </li>

          <li style={{ marginBottom: "20px", display: "flex", alignItems: "center", paddingLeft: "15px", fontSize: "18px" }}>
            <FaTachometerAlt style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
          </li>
          <li style={{ marginBottom: "20px", display: "flex", alignItems: "center", paddingLeft: "15px", fontSize: "18px" }}>
            <FaProjectDiagram style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/projects" style={{ color: "white", textDecoration: "none" }}>Projets</Link>
          </li>
          <li style={{ marginBottom: "20px", display: "flex", alignItems: "center", paddingLeft: "15px", fontSize: "18px" }}>
            <FaComments style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/chats" style={{ color: "white", textDecoration: "none" }}>Chats</Link>
          </li>

          {/* Affichage de la section Utilisateurs uniquement pour les admins */}
          {isAdmin && (
            <li style={{ marginBottom: "20px", display: "flex", alignItems: "center", paddingLeft: "15px", fontSize: "18px" }}>
              <FaUsers style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
              <Link to="/users" style={{ color: "white", textDecoration: "none" }}>Utilisateurs</Link>
            </li>
          )}

          {/* Liens pour la déconnexion */}
          <li
            style={{
              marginTop: "375px", // Espace pour aligner la déconnexion en bas
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <span style={{ color: "white", textDecoration: "none" }}>Log out</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
