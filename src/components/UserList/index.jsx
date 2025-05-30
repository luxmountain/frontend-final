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
import { Link } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css"; // Đảm bảo có style phù hợp

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await models.userListModel(); // Trả về user + counts
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
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <Box className="user-list-content">
                  <Box>
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.occupation}
                    />
                  </Box>
                  <Box className="user-list-badges">
                    {" "}
                    <Link
                      to={`/photos/${user._id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ textDecoration: "none" }}
                    >
                      <Badge
                        badgeContent={user.photoCount || 0}
                        color="success"
                        sx={{ cursor: "pointer", mr: 1 }}
                      />
                    </Link>
                    <Link
                      to={`/comments/${user._id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ textDecoration: "none" }}
                    >
                      <Badge
                        badgeContent={user.commentCount || 0}
                        color="error"
                        sx={{ cursor: "pointer" }}
                      />
                    </Link>
                  </Box>
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
