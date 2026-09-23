import client from "./client";

export async function getAllProjects() {
  const response = await client.get("/projects");
  return response.data;
}

export async function getProjectById(projectId) {
  const response = await client.get(`/projects/${projectId}`);
  return response.data;
}

export async function createProject({ title, description, images }) {
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("Description", description);
  images.forEach((file) => formData.append("Images", file));

  const response = await client.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProject(projectId) {
  await client.delete(`/projects/${projectId}`);
}
