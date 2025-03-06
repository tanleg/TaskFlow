import React from "react";
import { Box } from "@mui/material";
import ListeUtilisateurs from "../../views/utilisateurs/listeUtiseurs";
const Users: React.FC = () => {
  return  (
    <Box sx={{ marginLeft: "290px", padding: "20px" }}>
      <ListeUtilisateurs />
    </Box>
)
};

export default Users;
