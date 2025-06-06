import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import PhotoStepper from "../PhotoStepper";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const { currentUser } = useAuth();
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    async function fetchData() {
      const [userData, photoData] = await Promise.all([
        models.userModel(userId),
        models.photoOfUserModel(userId),
      ]);

      if (userData) setUser(userData);
      else console.error("User not found");

      if (Array.isArray(photoData)) {
        const sortedPhotos = photoData.sort(
          (a, b) => new Date(b.date_time) - new Date(a.date_time)
        );
        setPhotos(sortedPhotos);
      } else {
        console.error("Photos not found");
      }
    }

    fetchData();
  }, [userId]);

  const handleCommentChange = (photoId, value) => {
    setCommentTexts((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleAddComment = async (photoId) => {
    const text = commentTexts[photoId]?.trim();
    if (!text) return alert("Comment cannot be empty");

    try {
      const updatedPhoto = await models.addCommentToPhoto(
        photoId,
        text,
        currentUser._id
      );

      setPhotos((prevPhotos) =>
        prevPhotos.map((p) => (p._id === photoId ? updatedPhoto : p))
      );
      setCommentTexts((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  useEffect(() => {
    const storedValue =
      localStorage.getItem("advancedFeaturesEnabled") || "false";
    setAdvancedFeatures(storedValue === "true");
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePhotoClick = (photoId) => {
    if (advancedFeatures) {
      navigate(`/photos/${userId}/${photoId}`);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await models.deletePhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (photoId, commentId) => {
    try {
      await models.deleteComment(photoId, commentId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: photo.comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return photo;
        })
      );
    } catch (error) {
      console.error("Error delete comment");
    }
  };

  const handleToggleLike = async (photoId) => {
    const updatedPhotos = [...photos];
    const photoIndex = updatedPhotos.findIndex((p) => p._id === photoId);
    if (photoIndex === -1) return;

    const photo = updatedPhotos[photoIndex];
    const hasLiked = photo.likes?.some(
      (like) => like.user_id === currentUser._id
    );

    try {
      if (hasLiked) {
        await models.unlikePhoto(photoId, currentUser._id);
        photo.likes = photo.likes.filter(
          (like) => like.user_id !== currentUser._id
        );
      } else {
        await models.likePhoto(photoId, currentUser._id);
        photo.likes = [...(photo.likes || []), { user_id: currentUser._id }];
      }

      updatedPhotos[photoIndex] = { ...photo };
      setPhotos(updatedPhotos);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleEditComment = async (photoId, commentId) => {
    const newText = editingComments[commentId]?.trim();
    if (!newText) return alert("Comment cannot be empty");

    try {
      await models.editComment(
        photoId,
        commentId,
        newText
      );
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            const newComments = photo.comments.map((c) =>
              c._id === commentId ? { ...c, comment: newText } : c
            );
            return { ...photo, comments: newComments };
          }
          return photo;
        })
      );

      setEditingComments((prev) => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  if (!user || photos === null) {
    return <Typography variant="h4">Loading photos...</Typography>;
  }

  if (photos.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h5">
          {user.first_name} has not uploaded any photos yet.
        </Typography>
      </Box>
    );
  }

  if (advancedFeatures && photoId) {
    return <PhotoStepper user={user} photos={photos} />;
  }

  if (advancedFeatures && !photoId) {
    navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
    return null;
  }

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  return (
    <div className="photo-container">
      {photos.map((photo) => (
        <Card
          key={photo._id}
          className={`photo-card ${advancedFeatures ? "clickable" : ""}`}
          onClick={() => advancedFeatures && handlePhotoClick(photo._id)}
        >
          <CardMedia
            component="img"
            image={`${BACKEND_URL}/images/${photo.file_name}`}
            alt={`Photo by ${user.first_name}`}
            className="photo-image"
            loading="lazy"
          />
          <CardContent>
            <Button
              size="small"
              variant={
                photo.likes?.some((like) => like.user_id === currentUser._id)
                  ? "contained"
                  : "outlined"
              }
              color={
                photo.likes?.some((like) => like.user_id === currentUser._id)
                  ? "error"
                  : "primary"
              }
              onClick={() => handleToggleLike(photo._id)}
              sx={{ my: 2, textTransform: "none", minWidth: "6rem" }}
              startIcon={
                photo.likes?.some(
                  (like) => like.user_id === currentUser._id
                ) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
            >
              {photo.likes?.some((like) => like.user_id === currentUser._id)
                ? "Liked"
                : "Like"}{" "}
              ({photo.likes?.length || 0})
            </Button>
            <div className="justify-between">
              <Typography variant="body2" color="textSecondary">
                Posted on {formatDate(photo.date_time)}
              </Typography>
              {currentUser._id === photo.user_id && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(photo._id)}
                >
                  Delete Post
                </Button>
              )}
            </div>
            <div className="comment-section">
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>

              {photo.comments &&
                [...photo.comments]
                  .sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
                  .map((comment) => (
                    <Card key={comment._id} className="comment-card">
                      <div className="comment-wrapper">
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="comment-date-user"
                        >
                          {formatDate(comment.date_time)} -{" "}
                          <Link
                            component={RouterLink}
                            to={`/users/${comment.user._id}`}
                            color="primary"
                            className="comment-user-link"
                          >
                            {comment.user.first_name} {comment.user.last_name}
                          </Link>
                        </Typography>
                        {currentUser._id === comment.user._id && (
                          <div>
                            <Button
                              onClick={() =>
                                setEditingComments((prev) => ({
                                  ...prev,
                                  [comment._id]: comment.comment,
                                }))
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteComment(photo._id, comment._id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      {editingComments.hasOwnProperty(comment._id) ? (
                        <>
                          <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            value={editingComments[comment._id]}
                            onChange={(e) =>
                              setEditingComments((prev) => ({
                                ...prev,
                                [comment._id]: e.target.value,
                              }))
                            }
                            sx={{ mb: 1 }}
                          />
                          <Box display="flex" gap={1} justifyContent="flex-end">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleEditComment(photo._id, comment._id)
                              }
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                setEditingComments((prev) => {
                                  const newState = { ...prev };
                                  delete newState[comment._id];
                                  return newState;
                                })
                              }
                            >
                              Cancel
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <Typography variant="body1" className="comment-text">
                          {comment.comment}
                        </Typography>
                      )}
                    </Card>
                  ))}
            </div>

            {currentUser && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  multiline
                  label="Add a comment"
                  value={commentTexts[photo._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(photo._id, e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddComment(photo._id)}
                >
                  Post
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
