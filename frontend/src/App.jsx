import { lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/routing/ErrorBoundary';
import { AdminRoute, GuestRoute, ProtectedRoute } from '@/components/routing/RouteGuards';
import { ScrollToTop } from '@/components/routing/ScrollToTop';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import VideoDetailPage from './pages/VideoDetailPage';
import VideosPage from './pages/VideosPage';

// The admin area is a separate bundle: most visitors never open it.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const MyProgressPage = lazy(() => import('./pages/MyProgressPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <ScrollToTop />

            <Routes>
              {/* Auth screens carry their own full-page layout. */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/videos/:videoId" element={<VideoDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/my-progress" element={<MyProgressPage />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="videos" element={<AdminVideos />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route>
                </Route>

                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--color-raised)',
                  color: 'var(--color-fg)',
                  border: '1px solid var(--color-line)',
                  fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
                error: { iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
