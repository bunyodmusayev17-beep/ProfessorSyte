import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as authApi from '@/api/auth';
import { UserRole } from '@/constants';
import { readClaims } from '@/lib/jwt';
import { SESSION_EXPIRED_EVENT, tokenStorage } from '@/lib/tokenStorage';

import { AuthContext } from './AuthContext';

/**
 * Build the user object the UI works with. `AuthResponseDto` carries the email
 * and role; the user id only exists inside the access token's claims.
 */
function toUser(authResponse) {
  const claims = readClaims(authResponse.accessToken);
  return {
    id: claims?.id ?? null,
    email: authResponse.email || claims?.email || '',
    role: authResponse.role || claims?.role || UserRole.User,
  };
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(() => tokenStorage.getUser());

  const clearSession = useCallback(() => {
    setUser(null);
    // Drop every cached response so the next user never sees the previous one's data.
    queryClient.clear();
  }, [queryClient]);

  // The axios interceptor clears storage when a refresh fails; mirror that here.
  useEffect(() => {
    function handleSessionExpired() {
      clearSession();
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [clearSession]);

  // Keep tabs in sync: logging out in one tab logs out the others.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === null || event.key.startsWith('professor.')) {
        const storedUser = tokenStorage.getUser();
        setUser(storedUser);
        if (!storedUser) queryClient.clear();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [queryClient]);

  const startSession = useCallback((authResponse) => {
    tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);
    const nextUser = toUser(authResponse);
    tokenStorage.setUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(
    async (emailOrUserName, password) =>
      startSession(await authApi.login({ emailOrUserName, password })),
    [startSession]
  );

  const register = useCallback(
    async ({ email, userName, password }) =>
      startSession(await authApi.register({ email, userName, password })),
    [startSession]
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Revoking server-side is best effort; the local session goes either way.
    }
    tokenStorage.clear();
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === UserRole.Admin,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
