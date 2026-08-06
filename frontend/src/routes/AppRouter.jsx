import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "@/pages/auth/Login";

import Dashboard from "@/pages/dashboard/Dashboard";

import MyFiles from "@/pages/files/MyFiles";
import Favorites from "@/pages/files/Favorites";
import Trash from "@/pages/files/Trash";

import Folders from "@/pages/folders/Folders";
import FolderDetails from "@/pages/folders/FolderDetails";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <MyFiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <Folders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders/:folderId"
          element={
            <ProtectedRoute>
              <FolderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}