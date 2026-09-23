import client from "./client";

export async function register({ email, password, userName }) {
  const response = await client.post("/auth/register", { email, password, userName });
  return response.data;
}

export async function login({ emailOrUserName, password }) {
  const response = await client.post("/auth/login", { emailOrUserName, password });
  return response.data;
}

export async function logout(refreshToken) {
  await client.post("/auth/logout", { refreshToken });
}
