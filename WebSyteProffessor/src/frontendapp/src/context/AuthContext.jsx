import { createContext, useContext, useState } from "react";
import * as authApi from "../api/auth";
import { getUserIdFromToken } from "../utils/jwt";

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());

  function persistSession(response) {
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    const userId = getUserIdFromToken(response.accessToken);
    const userData = { id: userId, email: response.email, role: response.role };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  async function login(emailOrUserName, password) {
    const response = await authApi.login({ emailOrUserName, password });
    persistSession(response);
  }

  async function register(email, password, userName) {
    const response = await authApi.register({ email, password, userName });
    persistSession(response);
  }

  async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore network errors on logout, clear locally regardless
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
