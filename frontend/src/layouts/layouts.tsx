// import React from "react";
// import Sidebar from "frontend/src/components/Sidebar.tsx";
// import { Outlet } from "react-router-dom";

// const Layout: React.FC = () => {
//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Contenu principal */}
//       <div style={{
//         flex: 1,
//         background: "#F5F5F5",
//         padding: "20px",
//         overflowY: "auto"
//       }}>
//         <Outlet /> {/* Rend le contenu des pages enfants */}
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React from "react";
import { Outlet } from "react-router-dom";
import AppBarComponent from "frontend/src/layouts/appbar.tsx";
import Sidebar from "frontend/src/components/Sidebar"; // Assurez-vous que la Sidebar existe

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
