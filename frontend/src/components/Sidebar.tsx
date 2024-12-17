// import React from "react";
// import { Link } from "react-router-dom";
// // Importation des icônes
// import { FaTachometerAlt, FaProjectDiagram, FaComments, FaUsers } from "react-icons/fa";

// const Sidebar: React.FC = () => {
//   return (
//     <div style={{
//       width: "200px",
//       background: "var(--primary-color)",
//       color: "var(--text-color)",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "flex-start", // Alignement à gauche
//       padding: "20px",
//       fontFamily: "var(--font-text)",
//     }}>
//       {/* Remplacement du logo par le texte "Navigation" */}
//       <nav>
//         <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
//           {/* Ajout de "Navigation" avec un style similaire aux autres éléments */}
//           <li style={{
//             marginBottom: "30px", // Plus d'espace sous "Navigation"
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "15px", // Alignement avec les autres éléments
//             fontSize: "24px", // Taille du texte agrandie
//             color: "var(--background-color)", // Couleur du texte
//           }}>
//             <h2 style={{
//               margin: 0, // Retirer la marge autour du titre
//               fontSize: "24px", // Taille du texte agrandie
//             }}>
//               Navigation
//             </h2>
//           </li>
//           <li style={{
//             marginBottom: "20px",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "15px",
//             fontSize: "18px",
//           }}>
//             <FaTachometerAlt style={{ marginRight: "15px", color: "var(--background-color)", fontSize: "20px" }} />
//             <Link to="/" style={{ color: "var(--background-color)", textDecoration: "none" }}>Dashboard</Link>
//           </li>
//           <li style={{
//             marginBottom: "20px",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "15px",
//             fontSize: "18px",
//           }}>
//             <FaProjectDiagram style={{ marginRight: "15px", color: "var(--background-color)", fontSize: "20px" }} />
//             <Link to="/projects" style={{ color: "var(--background-color)", textDecoration: "none" }}>Projets</Link>
//           </li>
//           <li style={{
//             marginBottom: "20px",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "15px",
//             fontSize: "18px",
//           }}>
//             <FaComments style={{ marginRight: "15px", color: "var(--background-color)", fontSize: "20px" }} />
//             <Link to="/chats" style={{ color: "var(--background-color)", textDecoration: "none" }}>Chats</Link>
//           </li>
//           <li style={{
//             marginBottom: "20px",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "15px",
//             fontSize: "18px",
//           }}>
//             <FaUsers style={{ marginRight: "15px", color: "var(--background-color)", fontSize: "20px" }} />
//             <Link to="/users" style={{ color: "var(--background-color)", textDecoration: "none" }}>Utilisateurs</Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import { Link } from "react-router-dom";
// Importation des icônes
import { FaTachometerAlt, FaProjectDiagram, FaComments, FaUsers } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <div style={{
      width: "250px", // Légèrement plus large pour plus d'espace
      background: "linear-gradient(135deg, #005B96, #00A676)", // Fond dégradé
      color: "var(--text-color)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start", // Alignement à gauche
      padding: "20px",
      fontFamily: "var(--font-text)",
      borderRadius: "2px", // Bordures arrondies
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ombre portée pour un effet de flottement
    }}>
      {/* Remplacement du logo par le texte "Navigation" */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {/* Ajout de "Navigation" avec un style moderne */}
          <li style={{
            marginBottom: "30px", // Plus d'espace sous "Navigation"
            display: "flex",
            alignItems: "center",
            paddingLeft: "15px", // Alignement avec les autres éléments
            fontSize: "24px", // Taille du texte agrandie
            color: "white", // Couleur du texte
            fontWeight: "bold", // Police en gras
          }}>
            <h2 style={{
              margin: 0,
              fontSize: "24px", // Taille du texte agrandie
            }}>
              Navigation
            </h2>
          </li>
          {/* Liens de la navigation */}
          <li style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "15px",
            fontSize: "18px",
            transition: "all 0.3s ease", // Transition fluide pour les effets de survol
          }}>
            <FaTachometerAlt style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/dashboard" style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}>Dashboard</Link>
          </li>
          <li style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "15px",
            fontSize: "18px",
            transition: "all 0.3s ease",
          }}>
            <FaProjectDiagram style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/projects" style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}>Projets</Link>
          </li>
          <li style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "15px",
            fontSize: "18px",
            transition: "all 0.3s ease",
          }}>
            <FaComments style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/chats" style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}>Chats</Link>
          </li>
          <li style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "15px",
            fontSize: "18px",
            transition: "all 0.3s ease",
          }}>
            <FaUsers style={{ marginRight: "15px", color: "white", fontSize: "20px" }} />
            <Link to="/users" style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}>Utilisateurs</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
