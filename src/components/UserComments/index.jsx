import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUserComments() {
      try {
        const userData = await models.userModel(userId);
        setUser(userData);
        
        // Get all photos to find ones with user's comments
        const photos = await models.photoOfUserModel(userId);
        let userComments = [];
        
        // Extract comments made by this user from all photos
        photos.forEach(photo => {
          const userCommentsOnPhoto = photo.comments.filter(
            comment => comment.user._id === userId
          ).map(comment => ({
            ...comment,
            photo: {
              _id: photo._id,
              file_name: photo.file_name,
              date_time: photo.date_time,
            }
          }));
          userComments = [...userComments, ...userCommentsOnPhoto];
        });

        setComments(userComments);
      } catch (error) {
        console.error("Error loading user comments:", error);
      }
    }

    loadUserComments();
  }, [userId]);

  const handlePhotoClick = () => {
    navigate(`/photos/${userId}`);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="user-comments">
      <Typography variant="h4" gutterBottom>
        Comments by {user.first_name} {user.last_name}
      </Typography>
      <Grid container spacing={3}>
        {comments.map((comment) => (
          <Grid item xs={12} sm={6} md={4} key={comment._id}>
            <Card>
              <CardActionArea onClick={() => handlePhotoClick()}>
                <CardMedia
                  component="img"
                  image={`/images/${comment.photo.file_name}`}
                  alt="Photo thumbnail"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    {comment.comment}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserComments;
