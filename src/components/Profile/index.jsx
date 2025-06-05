import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import "./styles.css";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      if (!currentUser?._id) return;
      try {
        const data = await models.userModel(currentUser._id);
        setUser(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }

    fetchUser();
  }, [currentUser]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await models.deleteUser(currentUser._id);
      await logout();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  if (!user) return <Typography>Loading profile...</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1">
        <strong>Name:</strong> {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {user.description}
      </Typography>
      <div className="action-wrapper" style={{ marginTop: "1rem" }}>
        <Button variant="contained" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default Profile;
