import React from "react";
import { Box } from "@mui/material";
import ListeProjets from "../../views/projets/listeProjets";

const Projects: React.FC = () => {
  return (
    <Box sx={{ marginLeft: "290px", padding: "20px" }}>
      <ListeProjets/>
    </Box>
)
};

export default Projects;


