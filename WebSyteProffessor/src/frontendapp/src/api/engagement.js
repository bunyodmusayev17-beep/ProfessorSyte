import client from "./client";

// Comments
export async function getCommentsByVideo(videoId) {
  const response = await client.get(`/comments/video/${videoId}`);
  return response.data;
}

export async function createComment({ videoId, text }) {
  const response = await client.post("/comments", { videoId, text });
  return response.data;
}

export async function updateComment(commentId, text) {
  await client.put(`/comments/${commentId}`, { text });
}

export async function deleteComment(commentId) {
  await client.delete(`/comments/${commentId}`);
}

// Reactions (type: 1 = Like, 2 = Dislike)
export async function setReaction(videoId, type) {
  await client.post(`/videos/${videoId}/reaction`, { type });
}

export async function removeReaction(videoId) {
  await client.delete(`/videos/${videoId}/reaction`);
}

// Favorites
export async function addFavorite(videoId) {
  await client.post(`/videos/${videoId}/favorite`);
}

export async function removeFavorite(videoId) {
  await client.delete(`/videos/${videoId}/favorite`);
}

export async function getMyFavorites() {
  const response = await client.get("/favorites/my");
  return response.data;
}

// Watch progress
export async function markAsWatched(videoId) {
  await client.post(`/videos/${videoId}/progress`);
}

export async function getMyProgress() {
  const response = await client.get("/progress/my");
  return response.data;
}
