import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

/**
 * Requires a signed-in user. The attempted location is passed along so the login
 * page can send the user back where they were headed.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Requires the Admin role; non-admins are sent home rather than to login. */
export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

/** Keeps signed-in users away from /login and /register. */
export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
