import React, { forwardRef, Ref, ReactElement, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Fade,
  styled,
  FadeProps,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Icône de fermeture

// Transition component for the Dialog
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

// Styled button for closing the Dialog
const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[3],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
    boxShadow: theme.shadows[6],
  },
}));

// Props for the Dialog component
interface DialogAddProjectsProps {
  open: boolean;
  onClose: () => void;
}

const DialogAddProjects: React.FC<DialogAddProjectsProps> = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Developer" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "Designer" },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "Project Manager" },
    { id: "4", name: "David", email: "david@example.com", role: "Tester" },
    { id: "5", name: "Eve", email: "eve@example.com", role: "Developer" },
  ];

  const handleUserChange = (event: SelectChangeEvent<typeof selectedUsers>) => {
    const value = event.target.value;
    setSelectedUsers(typeof value === "string" ? value.split(",") : value);
  };
  // Handle closing the dialog and reset form
  const handleClose = () => {
    // Reset form fields
    setProjectName("");
    setProjectDescription("");
    setSelectedUsers([]);
    onClose(); // Close the dialog
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="body"
      TransitionComponent={Transition}
      sx={{
        "& .MuiDialog-paper": {
          overflow: "visible",
          fontFamily: "Open Sans, sans-serif",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CustomCloseButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </CustomCloseButton>

      {/* Dialog Title with Icon */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        
        <Typography
          variant="h4"
          sx={{
            mt:3,
            mb: 1,
            ml:4,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#333333",
          }}
        >
          Nouveau projet
        </Typography>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ paddingTop: "1px" }}>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du projet"
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{
            fontFamily: "Open Sans, sans-serif",
            marginBottom: "16px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            color: "#333333",
          }}
        />
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel>Utilisateurs</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={handleUserChange}
            label="Utilisateurs"
            renderValue={(selected) => (
              <div>
                {selected.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  return (
                    user && (
                      <Chip
                        key={user.id}
                        label={`${user.name} (${user.email}, ${user.role})`}
                        sx={{
                          margin: 0.5,
                          backgroundColor: "#F0F0F0",
                          borderRadius: "16px",
                        }}
                      />
                    )
                  );
                })}
              </div>
            )}
            sx={{
              fontFamily: "Open Sans, sans-serif",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              color: "#333333",
            }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                <ListItemText primary={`${user.name} - ${user.email} (${user.role})`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Description"
          type="text"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          sx={{
            fontFamily: "Open Sans, sans-serif",
            marginTop: "16px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            color: "#333333",
          }}
        />
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ pb: 2 }}> {/* pb: 2 ajoute de l'espace en bas */}
  <Button
    onClick={() => alert("Projet ajouté !")}
    variant="contained"
    sx={{
      mr: 1,
      fontFamily: "Open Sans, sans-serif",
      fontWeight: "bold",
      background: "linear-gradient(135deg, #005B96, #00A676)",
      "&:hover": {
        background: "linear-gradient(135deg, #005B96, #00A676)",
      },
      padding: "10px 20px",
      borderRadius: "8px",
    }}
  >
    Ajouter
  </Button>
  <Button
    variant="outlined"
    onClick={handleClose}
    color="error"
    sx={{
      fontFamily: "Open Sans, sans-serif",
      fontWeight: "bold",
      borderColor: "#D32F2F",
      color: "#D32F2F",
      padding: "10px 20px",
      borderRadius: "8px",
      "&:hover": {
        borderColor: "#D32F2F",
        color: "#D32F2F",
      },
    }}
  >
    Annuler
  </Button>
</DialogActions>
    </Dialog>
  );
};

export default DialogAddProjects;
