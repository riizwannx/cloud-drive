import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==============================
// Authentication
// ==============================
import Login from "@/pages/auth/Login";

// ==============================
// Dashboard
// ==============================
import Dashboard from "@/pages/dashboard/Dashboard";

// ==============================
// Files
// ==============================
import MyFiles from "@/pages/files/MyFiles";
import Favorites from "@/pages/files/Favorites";
import Trash from "@/pages/files/Trash";
import Shared from "@/pages/files/Shared";

// ==============================
// Folders
// ==============================
import Folders from "@/pages/folders/Folders";
import FolderDetails from "@/pages/folders/FolderDetails";
import SharedFile from "@/pages/files/SharedFile";

// ==============================
// Settings
// ==============================
import Setting from "@/pages/settings/Setting";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================== */}
        {/* Login */}
        {/* ============================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ============================== */}
        {/* Dashboard */}
        {/* ============================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ============================== */}
        {/* My Files */}
        {/* ============================== */}

        <Route
          path="/files"
          element={<MyFiles />}
        />

        {/* ============================== */}
        {/* Favorites */}
        {/* ============================== */}

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* ============================== */}
        {/* Trash */}
        {/* ============================== */}

        <Route
          path="/trash"
          element={<Trash />}
        />

        {/* ============================== */}
        {/* Shared */}
        {/* ============================== */}

        <Route
          path="/shared"
          element={<Shared />}
        />

        {/* ============================== */}
        {/* Folders */}
        {/* ============================== */}

        <Route
          path="/folders"
          element={<Folders />}
        />

        {/* ============================== */}
        {/* Folder Details */}
        {/* ============================== */}

        <Route
          path="/folders/:folderId"
          element={<FolderDetails />}
        />

        {/* ============================== */}
        {/* Settings */}
        {/* ============================== */}

        <Route
          path="/settings"
          element={<Setting />}
        />

        {/* ============================== */}
        {/* Default Route */}
        {/* ============================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/share/:token"
          element={<SharedFile />}
        />

        {/* ============================== */}
        {/* Unknown Routes */}
        {/* ============================== */}

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