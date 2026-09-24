import { apiClient } from '@/lib/apiClient';

/** POST /api/auth/register -> AuthResponseDto */
export async function register({ email, userName, password }) {
  const { data } = await apiClient.post('/auth/register', { email, userName, password });
  return data;
}

/** POST /api/auth/login -> AuthResponseDto */
export async function login({ emailOrUserName, password }) {
  const { data } = await apiClient.post('/auth/login', { emailOrUserName, password });
  return data;
}

/** POST /api/auth/logout -> 204 */
export async function logout(refreshToken) {
  await apiClient.post('/auth/logout', { refreshToken });
}
