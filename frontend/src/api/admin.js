import { apiClient } from '@/lib/apiClient';

/**
 * GET /api/admin/analytics (Admin)
 * -> { totalVideos, totalUsers, totalComments, mostViewedVideos[], mostLikedVideos[] }
 */
export async function getAnalytics() {
  const { data } = await apiClient.get('/admin/analytics');
  return data;
}

/** GET /api/users (Admin) -> { id, email, userName, role, createdAt }[] */
export async function getUsers() {
  const { data } = await apiClient.get('/users');
  return data;
}
