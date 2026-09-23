import client from "./client";

export async function getAllUsers() {
  const response = await client.get("/users");
  return response.data;
}

export async function getAnalytics() {
  const response = await client.get("/admin/analytics");
  return response.data;
}
