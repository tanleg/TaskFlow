import React, { forwardRef, ReactElement, Ref } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Fade,
  FadeProps,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import { Utilisateur } from "../../types/apps/utilisateur";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children: ReactElement },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface DialogUserInfoProps {
  open: boolean;
  onClose: () => void;
  user: Utilisateur | null;
}

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  return nameParts.map(part => part[0]).join("").toUpperCase();
};

const DialogUserInfo: React.FC<DialogUserInfoProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      TransitionComponent={Transition}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          textAlign: "center",
          padding: "24px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "16px", fontFamily: "Montserrat, sans-serif", color: "#000", fontWeight: "bold", textAlign: "left" }}>
        Information de l'utilisateur
      </DialogTitle>
      <DialogContent>
        <Avatar sx={{ width: 80, height: 80, margin: "auto", fontFamily: "Montserrat, sans-serif", mb: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
          {getInitials(user.name)}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "Montserrat, sans-serif", color: "#000" }}>
          {user.name}
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: "#ddd" }} />
        <Box sx={{ textAlign: "left", mt: 2, fontFamily: "Open Sans, sans-serif", fontSize: "15px", color: "#333333" }}>
          <Typography sx={{ fontFamily: "Open Sans, sans-serif", color: "#333333" }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography sx={{ fontFamily: "Open Sans, sans-serif", color: "#333333" }}>
            <strong>Phone:</strong> {user.telephone}
          </Typography>
          <Typography sx={{ fontFamily: "Open Sans, sans-serif", color: "#333333" }}>
            <strong>Role:</strong> {user.admin ? "Admin" : "Chercheur"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            margin: "auto",
            fontFamily: "Open Sans, sans-serif",
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #005B96, #00A676)",
                "&:hover": {
                background: "linear-gradient(135deg, #005B96, #00A676)",
                },
            
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUserInfo;
