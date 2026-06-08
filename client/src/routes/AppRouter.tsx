import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import ProjectsPage from "../pages/ProjectsPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
        </Route>

        {/* default + fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
