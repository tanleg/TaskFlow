import React from "react";
import { Box } from "@mui/material";
import ProjectList from "../../views/chat/projectList";

const Chats: React.FC = () => {
  return  (
    <Box sx={{ marginLeft: "290px", padding: "20px" }}>
      <ProjectList />
    </Box>
)
};

export default Chats;
