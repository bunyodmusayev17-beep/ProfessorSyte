import { apiClient } from '@/lib/apiClient';

// --- Comments -------------------------------------------------------------

/** GET /api/comments/video/{videoId} -> CommentDto[] */
export async function getComments(videoId) {
  const { data } = await apiClient.get(`/comments/video/${videoId}`);
  return data;
}

/** POST /api/comments -> the new comment's id */
export async function createComment({ videoId, text }) {
  const { data } = await apiClient.post('/comments', {
    videoId: Number(videoId),
    text: text.trim(),
  });
  return data;
}

/** PUT /api/comments/{id} -> 204 (author only) */
export async function updateComment(commentId, text) {
  await apiClient.put(`/comments/${commentId}`, { text: text.trim() });
}

/** DELETE /api/comments/{id} -> 204 (author or Admin) */
export async function deleteComment(commentId) {
  await apiClient.delete(`/comments/${commentId}`);
}

// --- Reactions ------------------------------------------------------------

/** POST /api/videos/{id}/reaction -> 204. `type` is a ReactionType value. */
export async function setReaction(videoId, type) {
  await apiClient.post(`/videos/${videoId}/reaction`, { type });
}

/** DELETE /api/videos/{id}/reaction -> 204 */
export async function removeReaction(videoId) {
  await apiClient.delete(`/videos/${videoId}/reaction`);
}

// --- Favorites ------------------------------------------------------------

/** POST /api/videos/{id}/favorite -> 204 */
export async function addFavorite(videoId) {
  await apiClient.post(`/videos/${videoId}/favorite`);
}

/** DELETE /api/videos/{id}/favorite -> 204 */
export async function removeFavorite(videoId) {
  await apiClient.delete(`/videos/${videoId}/favorite`);
}

/** GET /api/favorites/my -> { favoriteId, videoId, videoTitle, createdAt }[] */
export async function getMyFavorites() {
  const { data } = await apiClient.get('/favorites/my');
  return data;
}

// --- Watch progress -------------------------------------------------------

/** POST /api/videos/{id}/progress -> 204 */
export async function markAsWatched(videoId) {
  await apiClient.post(`/videos/${videoId}/progress`);
}

/** GET /api/progress/my -> { watchProgressId, videoId, videoTitle, isCompleted, lastWatchedAt }[] */
export async function getMyProgress() {
  const { data } = await apiClient.get('/progress/my');
  return data;
}
