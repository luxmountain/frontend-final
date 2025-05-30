import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserList({ showBadges = false }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUsers() {
      const data = await models.userListModel();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("userListModel returned non-array data:", data);
      }
    }
    loadUsers();
  }, []);

  if (!users.length) return <div>No users found.</div>;

  return (
    <div className="user-list">
      <List component="nav">
        {users.map((user) => (
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
    </div>
  );
}

export default UserList;
