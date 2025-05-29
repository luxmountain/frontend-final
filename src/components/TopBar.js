import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoUploadDialog from "./PhotoUploadDialog";
import models from "../modelData/models";
import { useAuth } from "../context/AuthContext";

import "./styles.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [contextText, setContextText] = useState("");
  const [advancedFeatures, setAdvancedFeatures] = useState(() => {
    const stored = localStorage.getItem('advancedFeatures');
    return stored === 'true';
  });  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    useEffect(() => {
    async function fetchUser() {
      const pathParts = location.pathname.split("/");
      const userId = pathParts[pathParts.length - 1];

      console.log(userId);
      if (pathParts.includes("photos") || pathParts.includes("users")) {
        try {
          const user = await models.userModel(userId);
          if (user) {
            if (pathParts.includes("photos")) {
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
        // Set context text based on authentication state
        setContextText(currentUser ? `Welcome ${currentUser.first_name}` : "Please Login");
      }
    }

    fetchUser();
  }, [location, currentUser]);

  const handleAdvancedFeaturesChange = (event) => {
    const newValue = event.target.checked;
    setAdvancedFeatures(newValue);
    localStorage.setItem('advancedFeatures', newValue);
    window.dispatchEvent(new Event('storage'));
  };
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

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {contextText}
        </Typography>
        
        {/* Nếu không có currentUser thì ẩn toàn bộ phần user controls */}
        {/* Nếu muốn có thì truyền currentUser qua props và bỏ comment */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              Hi {currentUser.first_name}
            </Typography>
            <Button 
              color="inherit" 
              onClick={() => setUploadDialogOpen(true)}
            >
              Add Photo
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={advancedFeatures}
                  onChange={handleAdvancedFeaturesChange}
                />
              }              label="Enable Advanced Features"
            />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
      
      <PhotoUploadDialog 
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={handlePhotoUploadSuccess}
      />
    </AppBar>
  );
}

export default TopBar;
