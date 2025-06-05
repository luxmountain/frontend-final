import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";

function EditProfile() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    location: "",
    occupation: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!currentUser?._id) return;
      try {
        const data = await models.userModel(currentUser._id);
        setUser({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          location: data.location || "",
          occupation: data.occupation || "",
          description: data.description || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    }
    fetchUser();
  }, [currentUser]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await models.updateUser(currentUser._id, user);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div style={{ margin: "auto" }}>
      <Typography variant="h5" gutterBottom>Edit Profile</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        fullWidth
        margin="normal"
        label="First Name"
        name="first_name"
        value={user.first_name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Last Name"
        name="last_name"
        value={user.last_name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Location"
        name="location"
        value={user.location}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Occupation"
        name="occupation"
        value={user.occupation}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        multiline
        rows={4}
        value={user.description}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        sx={{ marginTop: 2 }}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export default EditProfile;
