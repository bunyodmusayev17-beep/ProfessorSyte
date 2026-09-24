import { apiClient } from '@/lib/apiClient';
import { appendBoolean, appendFile, appendIfPresent, toProgressHandler } from '@/lib/formData';

/** GET /api/categories -> CategoryDto[] */
export async function getCategories() {
  const { data } = await apiClient.get('/categories');
  return data;
}

/** GET /api/categories/{id} -> CategoryDto */
export async function getCategory(categoryId) {
  const { data } = await apiClient.get(`/categories/${categoryId}`);
  return data;
}

/**
 * Shared multipart body for create and update.
 * `iconKey` is a preset value like "preset:arduino"; `iconFile` overrides it.
 */
function toCategoryFormData({ name, description, iconKey, iconFile, coverImage }) {
  const formData = new FormData();
  formData.append('Name', name.trim());
  appendIfPresent(formData, 'Description', description?.trim());
  appendIfPresent(formData, 'IconKey', iconKey);
  appendFile(formData, 'IconFile', iconFile);
  appendFile(formData, 'CoverImage', coverImage);
  return formData;
}

/** POST /api/categories (Admin, multipart/form-data) -> CategoryDto */
export async function createCategory(input, { onProgress } = {}) {
  const { data } = await apiClient.post('/categories', toCategoryFormData(input), {
    onUploadProgress: toProgressHandler(onProgress),
  });
  return data;
}

/**
 * PUT /api/categories/{id} (Admin, multipart/form-data) -> 204
 * Images are left untouched unless a new file arrives or the matching
 * remove flag is set.
 */
export async function updateCategory(categoryId, input, { onProgress } = {}) {
  const formData = toCategoryFormData(input);
  appendBoolean(formData, 'RemoveIcon', Boolean(input.removeIcon));
  appendBoolean(formData, 'RemoveCoverImage', Boolean(input.removeCoverImage));

  await apiClient.put(`/categories/${categoryId}`, formData, {
    onUploadProgress: toProgressHandler(onProgress),
  });
}

/** DELETE /api/categories/{id} (Admin) -> 204 */
export async function deleteCategory(categoryId) {
  await apiClient.delete(`/categories/${categoryId}`);
}
