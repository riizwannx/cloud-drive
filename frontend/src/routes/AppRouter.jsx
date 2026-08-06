import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import MyFiles from "@/pages/files/MyFiles";
import Favorites from "@/pages/files/Favorites";
import Folders from "@/pages/folders/Folders";
import FolderDetails from "@/pages/folders/FolderDetails";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* My Files */}
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <MyFiles />
            </ProtectedRoute>
          }
        />

        {/* Favorites */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Folders */}
        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <Folders />
            </ProtectedRoute>
          }
        />

        {/* Folder Details */}
        <Route
          path="/folders/:folderId"
          element={
            <ProtectedRoute>
              <FolderDetails />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}