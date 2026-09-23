import client from "./client";

export async function getAllCategories() {
  const response = await client.get("/categories");
  return response.data;
}

export async function getCategoryById(categoryId) {
  const response = await client.get(`/categories/${categoryId}`);
  return response.data;
}

export async function createCategory({ name, description, iconUrl }) {
  const response = await client.post("/categories", { name, description, iconUrl });
  return response.data;
}

export async function updateCategory(categoryId, { name, description, iconUrl }) {
  await client.put(`/categories/${categoryId}`, { name, description, iconUrl });
}

export async function deleteCategory(categoryId) {
  await client.delete(`/categories/${categoryId}`);
}
