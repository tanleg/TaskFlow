import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from 'frontend/src/assets/logo_2.png';
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);  // Ajout de l'état de chargement
  
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && dob && address && email && password) {
        setLoading(true);  // Démarre le chargement
        setTimeout(() => {  // Simule un délai avant la redirection
          console.log("Inscription réussie :", firstName, lastName, email);
          navigate("/dashboard");
        }, 2000); // Temps de chargement de 2 secondes
      } else {
        alert("Veuillez remplir tous les champs.");
      }
    };

  const handleLoginRedirect = () => {
    navigate("/");
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
              fontFamily: "'Montserrat', sans-serif", // Titre avec Montserrat
            
            }}
          >
            Inscription
          </h2>
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          />
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
          />
          <input
            type="date"
            placeholder="Date de naissance"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
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
          />
          <input
            type="text"
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          />
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
            {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "S'inscrire"}
          
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#333333",
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Vous avez déjà un compte ?{" "}
            <span
              onClick={handleLoginRedirect}
              style={{
                color: "#005B96",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              Connectez-vous ici.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;