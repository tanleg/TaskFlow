import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from 'frontend/public/logo_2.png';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CircularProgress } from "@mui/material";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
  // Déclarations d'état pour les valeurs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Chargement en cours
  
  const navigate = useNavigate(); // Hook pour la navigation

  // Fonction de gestion de la soumission du formulaire
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {

        try {
            setLoading(true); // Afficher le spinner de chargement

            // Envoi de la requête POST pour se connecter
            const response = await axios.post(`${apiUrl}/auth/connexion`, {
                email: email,
                mot_de_passe: password,
            });

            console.log("Réponse du serveur :", response.data);
            
            // Traitement de la réponse du serveur
            if (response.data){
                alert("Inscription réussie !");
                if (response.data.accessToken)
                    localStorage.setItem('authToken', response.data.accessToken);

                navigate("/dashboard");  // Redirection vers le tableau de bord
            }else{
                alert("Mauvais mot de passe");
            }

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Erreur lors de la connexion. Veuillez réessayer.");
        } finally {
            setLoading(false); // Stopper le chargement
        }

    } else {
      alert("Veuillez saisir un email et un mot de passe.");
    }
  };

  // Fonction de redirection vers la page d'inscription
  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #005B96, #00A676)",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 15px 25px rgba(0, 0, 0, 0.1)",
          padding: "40px",
          width: "380px",
          textAlign: "center",
        }}
      >
        {/* Logo et titre */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "40px",
              height: "40px",
              marginLeft: "65px",
              marginRight: "15px",
              marginTop: "5px",
            }}
          />
          <h2
            style={{
              color: "#333333",
              fontSize: "30px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Connexion
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          {/* Champ email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              fontSize: "16px",
              outline: "none",
              backgroundColor: "#f9f9f9",
            }}
          />

          {/* Champ mot de passe */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
                outline: "none",
                backgroundColor: "#f9f9f9",
              }}
            />
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility du mot de passe
                onMouseDown={(e) => e.preventDefault()}
                style={{ position: "absolute", right: "10px", top: "15%" }}
              >
                {showPassword ? (
                  <Visibility sx={{fontSize:"1.25rem"}} />
                ) : (
                  <VisibilityOff sx={{fontSize:"1.25rem"}} />
                )}
              </IconButton>
            </InputAdornment>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#005B96",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#00A676"}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#005B96"}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "#fff" }} /> // Afficher le spinner pendant le chargement
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Lien vers la page d'inscription */}
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#333333" }}>
          <span
            onClick={handleRegisterRedirect}
            style={{
              color: "#005B96",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Créer un compte
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
