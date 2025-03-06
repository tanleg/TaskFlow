import React from "react";
import { Outlet } from "react-router-dom";
import AppBarComponent from "frontend/src/layouts/appbar.tsx";
import Sidebar from "frontend/src/components/Sidebar"; 

const Layout: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBarComponent />

        {/* Contenu des pages */}
        <div style={{ padding: "12px", backgroundColor: "#F5F5F5", flexGrow: 1 }}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
};

export default Layout;
