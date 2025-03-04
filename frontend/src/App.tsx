import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "frontend/src/components/Sidebar.tsx";
import Dashboard from "frontend/src/pages/dashboard/index.tsx";
import Projects from "frontend/src/pages/projets/index.tsx";
import Chats from "frontend/src/pages/chat/index.tsx";
import Users from "frontend/src/pages/utilisateurs/index.tsx";
import LoginPage from "frontend/src/pages/login/index.tsx"; // Importation de la page de connexion
import Register from "frontend/src/pages/register/index.tsx";
import Layout from "frontend/src/layouts/layouts.tsx";
import NotFoundPage from "frontend/src/pages/404.tsx";
import DetailsProjet from "./views/projets/detailsProjets";
import AccessPage from "./pages/partenaire";    
import DetailsProjetPartenaire from "./views/projets/detailsProjetsPartenaire";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route pour la page de connexion */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées dans le Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projet/:id" element={<DetailsProjet />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/users" element={<Users />} />
          <Route path="/access/:token" element={<AccessPage />} />
          {/* Ajoutez d'autres routes ici */}
        </Route>

        <Route path="/projet/:id_projet/:token_partenaire" element={<DetailsProjetPartenaire />} />

        {/* Route 404 en dehors du Layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
