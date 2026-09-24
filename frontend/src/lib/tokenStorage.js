const ACCESS_TOKEN_KEY = 'professor.accessToken';
const REFRESH_TOKEN_KEY = 'professor.refreshToken';
const USER_KEY = 'professor.user';

/** Fires when the session is cleared from outside React (e.g. a failed refresh). */
export const SESSION_EXPIRED_EVENT = 'professor:session-expired';

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    // Private browsing / disabled storage: behave like a logged-out visitor.
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Nothing we can do; the session simply won't survive a reload.
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_TOKEN_KEY),
  getRefreshToken: () => read(REFRESH_TOKEN_KEY),

  getUser() {
    const raw = read(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      remove(USER_KEY);
      return null;
    }
  },

  setTokens(accessToken, refreshToken) {
    write(ACCESS_TOKEN_KEY, accessToken);
    write(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUser(user) {
    write(USER_KEY, JSON.stringify(user));
  },

  clear() {
    remove(ACCESS_TOKEN_KEY);
    remove(REFRESH_TOKEN_KEY);
    remove(USER_KEY);
  },

  /** Clear the session and let the React tree react without a full page reload. */
  clearAndNotify() {
    tokenStorage.clear();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  },
};
