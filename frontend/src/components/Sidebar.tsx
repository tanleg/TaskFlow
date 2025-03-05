import axios from "axios";
import { useEffect, useState } from "react";
import { FaTachometerAlt, FaProjectDiagram, FaComments, FaUsers, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Pour rediriger après la déconnexion

const apiUrl = import.meta.env.VITE_API_URL;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    // Suppression du token ou autre méthode de déconnexion
    localStorage.removeItem("authToken"); // Exemple pour un token stocké
    navigate("/"); // Redirection vers la page de connexion
  };

  const [isAdmin, setAdmin] = useState<string | null>(null);
  
  async function set_admin_state() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Aucun token trouvé');
      setAdmin(null);
      return;
    }
    
    try {
        const response = await axios.get(`${apiUrl}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
  
        setAdmin(response.data.admin || null);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        setAdmin(null);
    }
  };

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
          <li
            style={{
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "24px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <Link
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#333333", // Remplace par la couleur dominante du logo
                fontSize: "26px",
                fontWeight: "bold",
                fontFamily: "monserrat", // Assure la cohérence avec le reste du site
                textDecoration: "none",
                textTransform: "uppercase", // Si besoin pour correspondre au design du logo
                letterSpacing: "1px", // Ajuste l'espacement selon le design du logo
              }}
            >
              <img
                src="../../public/logofez.png" // Assure-toi que l'image est bien accessible
                style={{ height: "60px", marginRight: "10px" }} // Ajuste la taille selon ton design
                />
            </Link>
          </li>
          <li
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              transition: "all 0.3s ease",
            }}
          >
            <FaTachometerAlt
              style={{ marginRight: "15px", color: "white", fontSize: "20px" }}
            />
            <Link
              to="/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Dashboard
            </Link>
          </li>
          <li
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              transition: "all 0.3s ease",
            }}
          >
            <FaProjectDiagram
              style={{ marginRight: "15px", color: "white", fontSize: "20px" }}
            />
            <Link
              to="/projects"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Projets
            </Link>
          </li>
          <li
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              transition: "all 0.3s ease",
            }}
          >
            <FaComments
              style={{ marginRight: "15px", color: "white", fontSize: "20px" }}
            />
            <Link
              to="/chats"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Chats
            </Link>
          </li>
          {isAdmin && (
          <li
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              transition: "all 0.3s ease",
            }}
          >
            <FaUsers
              style={{ marginRight: "15px", color: "white", fontSize: "20px" }}
            />
            <Link
              to="/users"
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Utilisateurs
            </Link>
          </li>
          )}
          {/* Log Out */}
          <li
            style={{
              marginTop: "375px", // Espace automatique en haut pour forcer l'alignement en bas
              display: "flex",
              alignItems: "center",
              paddingLeft: "15px",
              fontSize: "18px",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt
              style={{ marginRight: "15px", color: "white", fontSize: "20px" }}
            />
            <span
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Log out
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
