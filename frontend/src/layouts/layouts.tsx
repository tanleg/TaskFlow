import React from "react";
import Sidebar from "frontend/src/components/Sidebar.tsx";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div style={{
        flex: 1,
        background: "#F5F5F5",
        padding: "20px",
        overflowY: "auto"
      }}>
        <Outlet /> {/* Rend le contenu des pages enfants */}
      </div>
    </div>
  );
};

export default Layout;
