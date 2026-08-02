import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import MyFiles from "@/pages/files/MyFiles";

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

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected My Files */}
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <MyFiles />
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