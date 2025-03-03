import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import DialogDeleteEvents from "./dialogDeleteEvents";
import DialogAddEvents from "./dialogAddEvents";

const EventButtons: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddEvents, setOpenDialogAddEvents] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleOpenDialogAddEvents = () => setOpenDialogAddEvents(true);
  const handleCloseDialogAddEvents = () => setOpenDialogAddEvents(false);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", marginTop: "20px" }}>
      <Button
        variant="contained"
        sx={{
          mr: 1,
          fontFamily: "Open Sans, sans-serif",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #005B96, #00A676)",
          "&:hover": { background: "linear-gradient(135deg, #005B96, #00A676)" },
          padding: "10px 20px",
          borderRadius: "8px",
        }}
        onClick={handleOpenDialogAddEvents}
      >
        Ajouter un événement
      </Button>
      <Button
        variant="outlined"
        color="error"
        sx={{
          fontFamily: "Open Sans, sans-serif",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          marginLeft: "10px",
        }}
        onClick={handleOpenDialog}
      >
        Supprimer un événement
      </Button>

      {/* Dialogues */}
      <DialogDeleteEvents open={openDialog} onClose={handleCloseDialog} />
      <DialogAddEvents open={openDialogAddEvents} onClose={handleCloseDialogAddEvents} />
    </Box>
  );
};

export default EventButtons;
