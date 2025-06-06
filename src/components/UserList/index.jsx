import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";

function UserList({ showBadges = false }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const data = await models.userListModel();
      if (Array.isArray(data)) {
        const sortedUsers = data.sort(
          (a, b) => (b.photoCount || 0) - (a.photoCount || 0)
        );
        setUsers(sortedUsers);
      } else {
        console.error("userListModel returned non-array data:", data);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUser?._id &&
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (!filteredUsers.length) return <div>No users found.</div>;

  return (
    <div className="user-list">
      {!showBadges && (
        <>
          <Box mb={2}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </Box>

          <Typography>
            There {filteredUsers.length === 1 ? "is" : "are"}{" "}
            <strong>{filteredUsers.length}</strong>{" "}
            {filteredUsers.length === 1 ? "user" : "users"}
          </Typography>
        </>
      )}
      <List component="nav">
        {filteredUsers.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding className="user-list-item">
              <ListItemButton onClick={() => navigate(`/users/${user._id}`)}>
                <Box
                  className="user-list-content"
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                >
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={user.occupation}
                  />
                  {showBadges && (
                    <Box className="user-list-badges" display="flex" gap={4}>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation(); // chặn click lan ra ngoài
                          navigate(`/photos/${user._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Badge
                          badgeContent={user.photoCount || 0}
                          color="success"
                        />
                      </Box>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comments/${user._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <Badge
                          badgeContent={user.commentCount || 0}
                          color="error"
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {showBadges && (
        <>
          <div className="show-list-btn">
            <Button variant="outlined" onClick={() => navigate("/users")}>
              User List
            </Button>
          </div>
          <div className="setting-btn">
            <Button variant="contained" onClick={() => navigate("/profile")}>
              Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserList;
