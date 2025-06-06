import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Button,
  Box,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import TextField from "@mui/material/TextField";
import models from "../../modelData/models";
import { useAuth } from "../../context/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function PhotoStepper({ user, photos }) {
  const { photoId, userId } = useParams();
  const navigate = useNavigate();

  const initialIndex = photos.findIndex((p) => p._id === photoId);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [photoList, setPhotoList] = useState(photos);
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    const newIndex = photos.findIndex((p) => p._id === photoId);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  }, [photoId, photos]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPhotoId = photos[currentIndex - 1]._id;
      navigate(`/photos/${userId}/${prevPhotoId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhotoId = photos[currentIndex + 1]._id;
      navigate(`/photos/${userId}/${nextPhotoId}`);
    }
  };

  if (!photos.length || !photoList[currentIndex]) {
    return <Typography>Loading photos...</Typography>;
  }

  const photo = photoList[currentIndex];

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return alert("Comment cannot be empty");

    try {
      const updatedPhoto = await models.addCommentToPhoto(
        photo._id,
        trimmed,
        currentUser._id
      );

      const updated = [...photoList];
      updated[currentIndex] = updatedPhoto;
      setPhotoList(updated);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await models.deleteComment(photoId, commentId);
      alert("Deleted comment");

      const updatedPhotos = [...photoList];

      const updatedComments = updatedPhotos[currentIndex].comments.filter(
        (comment) => comment._id !== commentId
      );

      updatedPhotos[currentIndex] = {
        ...updatedPhotos[currentIndex],
        comments: updatedComments,
      };
      setPhotoList(updatedPhotos);
    } catch (error) {
      console.error("Error deleting comment");
    }
  };

  const handleDeletePost = async () => {
    try {
      await models.deletePhoto(photoId);
      alert("Deleted post successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error delete post");
    }
  };

  const handleToggleLike = async () => {
    const updated = [...photoList];
    const currentPhoto = updated[currentIndex];

    const hasLiked = currentPhoto.likes?.some(
      (like) => like.user_id === currentUser._id
    );

    try {
      if (hasLiked) {
        await models.unlikePhoto(currentPhoto._id, currentUser._id);
        currentPhoto.likes = currentPhoto.likes.filter(
          (like) => like.user_id !== currentUser._id
        );
      } else {
        await models.likePhoto(currentPhoto._id, currentUser._id);
        currentPhoto.likes = [
          ...(currentPhoto.likes || []),
          { user_id: currentUser._id },
        ];
      }

      updated[currentIndex] = { ...currentPhoto };
      setPhotoList(updated);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleEditComment = async (photoId, commentId) => {
    const newText = editingComments[commentId]?.trim();
    if (!newText) return alert("Comment cannot be empty");

    try {
      await models.editComment(photoId, commentId, newText);
      setPhotoList((prevPhotos) =>
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

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  return (
    <Box className="photo-stepper-container">
      <Typography variant="h5" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      <Card className="photo-stepper-card">
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
            onClick={handleToggleLike}
            sx={{ my: 2, textTransform: "none", minWidth: "6rem" }}
            startIcon={
              photo.likes?.some((like) => like.user_id === currentUser._id) ? (
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
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Posted on {new Date(photo.date_time).toLocaleString()}
            </Typography>
            {currentUser._id === photo.user_id && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeletePost()}
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
              photo.comments.map((comment) => (
                <Card key={comment._id} className="comment-card">
                  <div className="comment-wrapper">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="comment-date-user"
                    >
                      {new Date(comment.date_time).toLocaleString()} -{" "}
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

            {currentUser && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  multiline
                  label="Add a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={handleAddComment}
                >
                  Post
                </Button>
              </Box>
            )}
          </div>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentIndex === photos.length - 1}
        >
          Next
        </Button>
      </Box>
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center" }}
      >
        {currentIndex + 1} / {photos.length}
      </Typography>
    </Box>
  );
}

export default PhotoStepper;
