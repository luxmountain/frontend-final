import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoUploadDialog from "../PhotoUploadDialog";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";
import { FormControlLabel, Checkbox } from "@mui/material";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [contextText, setContextText] = useState("");
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(() => {
    const saved = localStorage.getItem("advancedFeaturesEnabled");
    return saved === "true";
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!currentUser) {
        setContextText("Please Login");
        return;
      }

      const pathParts = location.pathname.split("/").filter(Boolean);

      if (
        (pathParts[0] === "users" || pathParts[0] === "photos") &&
        pathParts.length === 2
      ) {
        const userId = pathParts[1];
        try {
          const user = await models.userModel(userId);
          if (user) {
            if (pathParts[0] === "photos") {
              setContextText(`Photos of ${user.first_name} ${user.last_name}`);
            } else {
              setContextText(`${user.first_name} ${user.last_name}`);
            }
          } else {
            setContextText("");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setContextText("");
        }
      } else {
        setContextText(
          currentUser ? `Hi ${currentUser.first_name}` : "Please Login"
        );
      }
    }

    fetchUser();
  }, [location, currentUser]);

  const handleLogout = () => {
    logout();
  };

  const handlePhotoUploadSuccess = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.includes("photos")) {
      window.location.reload();
    } else if (currentUser && currentUser._id) {
      navigate(`/photos/${currentUser._id}`);
    }
  };

  const handleAdvancedFeaturesChange = (event) => {
    const checked = event.target.checked;
    setAdvancedFeaturesEnabled(checked);
    localStorage.setItem("advancedFeaturesEnabled", checked);

    const pathParts = location.pathname.split("/").filter(Boolean);

    if (pathParts[0] === "photos" && pathParts[1]) {
      const userId = pathParts[1];

      navigate(`/photos/${userId}`, { replace: true });
      window.location.reload();
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar className="appbar-toolbar">
        {currentUser && (
          <Box className="left-controls">
            <Typography variant="body1">Hi {currentUser.first_name}</Typography>
            <Button color="inherit" onClick={() => setUploadDialogOpen(true)}>
              Add Photo
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedFeaturesEnabled}
              onChange={handleAdvancedFeaturesChange}
              color="inherit"
            />
          }
          label="Enable Advanced Features"
          sx={{ color: "white", ml: 2 }}
        />
        <Typography variant="h6" component="div">
          {contextText}
        </Typography>
      </Toolbar>

      {currentUser && (
        <PhotoUploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onSuccess={handlePhotoUploadSuccess}
          userId={currentUser._id}
        />
      )}
    </AppBar>
  );
}

export default TopBar;
