import axios from 'axios';

import { env } from './env';
import { tokenStorage } from './tokenStorage';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: { Accept: 'application/json' },
});

/** Bare instance for the refresh call, so it can never trigger its own interceptor. */
const refreshClient = axios.create({ baseURL: env.apiBaseUrl, timeout: 15_000 });

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * A single in-flight refresh shared by every request that got a 401, so a burst
 * of parallel requests produces one refresh call instead of N competing ones
 * (the backend revokes the old refresh token, so racing calls would log the
 * user out).
 */
let refreshPromise = null;

function refreshAccessToken() {
  refreshPromise ??= refreshClient
    .post('/auth/refresh', { refreshToken: tokenStorage.getRefreshToken() })
    .then(({ data }) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })
    .catch((error) => {
      tokenStorage.clearAndNotify();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isUnauthorized = error.response?.status === 401;

    // Only retry a genuine expired-token 401: once per request, and never for
    // the auth endpoints themselves (a wrong password must stay a wrong password).
    if (
      !isUnauthorized ||
      !request ||
      request._retried ||
      request.url?.startsWith('/auth/') ||
      !tokenStorage.getRefreshToken()
    ) {
      return Promise.reject(error);
    }

    request._retried = true;

    try {
      const accessToken = await refreshAccessToken();
      request.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(request);
    } catch {
      return Promise.reject(error);
    }
  }
);
