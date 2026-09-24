import { apiClient } from '@/lib/apiClient';
import {
  appendBoolean,
  appendFile,
  appendIfPresent,
  appendList,
  toProgressHandler,
} from '@/lib/formData';

/** GET /api/videos -> VideoDto[] (newest first) */
export async function getVideos() {
  const { data } = await apiClient.get('/videos');
  return data;
}

/**
 * GET /api/videos/{id} -> VideoDto
 * Note: the backend increments ViewCount on every call to this endpoint, so
 * callers should avoid refetching it just to pick up a like/dislike count.
 */
export async function getVideo(videoId) {
  const { data } = await apiClient.get(`/videos/${videoId}`);
  return data;
}

/** GET /api/videos/category/{id} -> VideoDto[] */
export async function getVideosByCategory(categoryId) {
  const { data } = await apiClient.get(`/videos/category/${categoryId}`);
  return data;
}

/** Shared multipart body for CreateVideoDto and UpdateVideoDto. */
function toVideoFormData({
  title,
  description,
  youtubeUrl,
  categoryId,
  isExclusive = false,
  projectId = null,
  thumbnail = null,
  productLinks = [],
}) {
  const formData = new FormData();
  formData.append('Title', title.trim());
  formData.append('Description', description?.trim() ?? '');
  formData.append('YoutubeUrl', youtubeUrl.trim());
  formData.append('CategoryId', String(Number(categoryId)));
  appendBoolean(formData, 'IsExclusive', isExclusive);
  appendIfPresent(formData, 'ProjectId', projectId ? String(Number(projectId)) : null);
  appendFile(formData, 'Thumbnail', thumbnail);

  appendList(
    formData,
    'ProductLinks',
    productLinks
      .filter((link) => link.productName?.trim() && link.url?.trim())
      .map((link) => ({
        StoreName: link.storeName?.trim() ?? '',
        ProductName: link.productName.trim(),
        Url: link.url.trim(),
      }))
  );

  return formData;
}

/** POST /api/videos (Admin, multipart/form-data) -> VideoDto */
export async function createVideo(input, { onProgress } = {}) {
  const { data } = await apiClient.post('/videos', toVideoFormData(input), {
    onUploadProgress: toProgressHandler(onProgress),
  });
  return data;
}

/** PUT /api/videos/{id} (Admin, multipart/form-data) -> 204 */
export async function updateVideo(videoId, input, { onProgress } = {}) {
  const formData = toVideoFormData(input);
  appendBoolean(formData, 'RemoveThumbnail', Boolean(input.removeThumbnail));

  await apiClient.put(`/videos/${videoId}`, formData, {
    onUploadProgress: toProgressHandler(onProgress),
  });
}

/** DELETE /api/videos/{id} (Admin) -> 204 */
export async function deleteVideo(videoId) {
  await apiClient.delete(`/videos/${videoId}`);
}
