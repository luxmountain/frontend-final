import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoUploadDialog from "./PhotoUploadDialog";
import models from "../modelData/models";

import "./styles.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  // Loại bỏ useAuth
  // const { currentUser, logout } = useAuth();

  const [contextText, setContextText] = useState("");
  const [advancedFeatures, setAdvancedFeatures] = useState(() => {
    const stored = localStorage.getItem('advancedFeatures');
    return stored === 'true';
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Giả định currentUser _id để xử lý upload thành công
  // Nếu bạn có cách lấy currentUser từ ngoài thì thay thế lại
  const currentUser = null; // Hoặc lấy từ props

  useEffect(() => {
    async function fetchUser() {
      const pathParts = location.pathname.split("/");
      const userId = pathParts[pathParts.length - 1];

      if (pathParts.includes("photos")) {
        const user = await models.userModel(userId);
        if (user) {
          setContextText(`Photos of ${user.first_name} ${user.last_name}`);
        } else {
          setContextText("");
        }
      } else if (pathParts.includes("users")) {
        const user = await models.userModel(userId);
        if (user) {
          setContextText(`${user.first_name} ${user.last_name}`);
        } else {
          setContextText("");
        }
      } else {
        setContextText("Please Login"); // Vì không có currentUser
      }
    }

    fetchUser();
  }, [location]);

  const handleAdvancedFeaturesChange = (event) => {
    const newValue = event.target.checked;
    setAdvancedFeatures(newValue);
    localStorage.setItem('advancedFeatures', newValue);
    window.dispatchEvent(new Event('storage'));
  };

  // Xóa hàm logout
  // const handleLogout = async () => {
  //   await logout();
  //   navigate('/login');
  // };

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
              }
              label="Enable Advanced Features"
            />
            {/* <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button> */}
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
