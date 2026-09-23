import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards";

import Home from "./pages/Home";
import AllVideos from "./pages/AllVideos";
import VideoDetail from "./pages/VideoDetail";
import Projects from "./pages/Projects";
import MyProgress from "./pages/MyProgress";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<AllVideos />} />
          <Route path="/videos/:videoId" element={<VideoDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/my-progress"
            element={
              <ProtectedRoute>
                <MyProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
