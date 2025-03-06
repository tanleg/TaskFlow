import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from 'frontend/src/assets/logo_2.png';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("1234");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Etat pour le chargement
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {

        try {
            setLoading(true); // Afficher le chargement

            const response = await axios.post(`${apiUrl}/auth/connexion`, {
                email: email,
                mot_de_passe: password,
            });

            console.log("Réponse du serveur :", response.data);
            
            if (response.data){
                alert("Inscription réussie !");

                if (response.data.accessToken)
                    localStorage.setItem('authToken', response.data.accessToken);

                navigate("/dashboard");    
            }else{
                alert("Mauvais mot de passe");
            }

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Erreur lors de la connexion. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }

    } else {
      alert("Veuillez saisir un email et un mot de passe.");
    }
  };

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
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Container pour le logo et le titre */}
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
              marginBottom: "20px",
              fontSize: "30px",
              fontWeight: "bold",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Connexion
          </h2>
        </div>

        <form onSubmit={handleLogin}>
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
              fontFamily: "'Open Sans', sans-serif",
              outline: "none",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = "#00A676"}
            onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = "#e0e0e0"}
          />

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
                fontFamily: "'Open Sans', sans-serif",
                outline: "none",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
              }}
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = "#00A676"}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = "#e0e0e0"}
            />
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? (
                  <Visibility sx={{fontSize:"1.25rem"}} />
                ) : (
                  <VisibilityOff sx={{fontSize:"1.25rem"}} />
                )}
              </IconButton>
            </InputAdornment>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: "20px",
            }}
          >
           <FormControlLabel
                control={
                <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                    padding: 0, // Supprime l'espacement autour du checkbox
                    }}
                />
                }
                label="Se souvenir de moi"
                style={{
                color: "#333333",
                fontFamily: "'Open Sans', sans-serif",
                marginLeft: "10px", // Ajuste l'espacement entre le checkbox et le texte
                }}
            />

           
          </div>

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
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#00A676"}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#005B96"}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "#fff" }} />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#333333", fontFamily: "'Open Sans', sans-serif", }}>
          New on our platform?{" "}
          <span
            onClick={handleRegisterRedirect}
            style={{
              color: "#005B96",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold",
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
