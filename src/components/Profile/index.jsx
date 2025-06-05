import React from "react";
import { Button, Typography } from "@mui/material";
import "./styles.css";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { currentUser, logout } = useAuth();

  const handleDelete = async () => {
    try {
      await models.deleteUser(currentUser._id);
      logout();
    } catch (error) {
      console.error("Error delete user");
    }
  };
  return (
    <div>
      <Typography variant="body1">My Profile</Typography>
      <div className="action-wrapper">
        <Button variant="contained">Edit Profile</Button>
        <Button variant="contained" onClick={handleDelete}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default Profile;
