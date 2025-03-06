import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "40px",
          width: "400px",
          boxShadow: "0 15px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            color: "#333333",
            marginBottom: "20px",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#555555",
            fontFamily: "'Open Sans', sans-serif",
            marginBottom: "20px",
          }}
        >
          Oups! 😖 La page que vous recherchez n'existe pas .
        </p>
        <button
          onClick={handleRedirect}
          style={{
            padding: "12px 24px",
            backgroundColor: "#005B96",
            color: "#ffffff",
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
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
