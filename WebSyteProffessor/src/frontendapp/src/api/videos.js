import client from "./client";

export async function getAllVideos() {
  const response = await client.get("/videos");
  return response.data;
}

export async function getVideoById(videoId) {
  const response = await client.get(`/videos/${videoId}`);
  return response.data;
}

export async function getVideosByCategory(categoryId) {
  const response = await client.get(`/videos/category/${categoryId}`);
  return response.data;
}

export async function createVideo(payload) {
  const response = await client.post("/videos", payload);
  return response.data;
}

export async function updateVideo(videoId, payload) {
  await client.put(`/videos/${videoId}`, payload);
}

export async function deleteVideo(videoId) {
  await client.delete(`/videos/${videoId}`);
}
