import { apiClient } from '@/lib/apiClient';
import { appendFile, toProgressHandler } from '@/lib/formData';

/** GET /api/projects -> ProjectDto[] */
export async function getProjects() {
  const { data } = await apiClient.get('/projects');
  return data;
}

/** GET /api/projects/{id} -> ProjectDto */
export async function getProject(projectId) {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
}

/** POST /api/projects (Admin, multipart/form-data) -> ProjectDto */
export async function createProject({ title, description, images = [] }, { onProgress } = {}) {
  const formData = new FormData();
  // Keys match the property names on CreateProjectDto.
  formData.append('Title', title.trim());
  formData.append('Description', description?.trim() ?? '');
  images.forEach((file) => appendFile(formData, 'Images', file));

  const { data } = await apiClient.post('/projects', formData, {
    onUploadProgress: toProgressHandler(onProgress),
  });
  return data;
}

/** DELETE /api/projects/{id} (Admin) -> 204 */
export async function deleteProject(projectId) {
  await apiClient.delete(`/projects/${projectId}`);
}
