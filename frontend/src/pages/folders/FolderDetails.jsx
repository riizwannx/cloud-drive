import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FolderPlus,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "@/api/api";

import MainLayout from "@/layouts/MainLayout";

import FolderHeader from "@/components/folderDetails/FolderHeader";
import FolderStats from "@/components/folderDetails/FolderStats";
import FolderSearch from "@/components/folderDetails/FolderSearch";
import FolderFileCard from "@/components/folderDetails/FolderFileCard";
import FolderEmpty from "@/components/folderDetails/FolderEmpty";

import {
  createFolder,
  renameFolder,
  deleteFolder,
  getFolders,
} from "@/services/folderService";

import { downloadFile } from "@/services/downloadFileService";
import { deleteFile } from "@/services/deleteFileService";
import { toggleFavorite } from "@/services/favoriteService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import FolderCard from "@/components/folders/FolderCard";
import RenameFolderDialog from "@/components/folders/RenameFolderDialog";

export default function FolderDetails() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  // ==============================
  // Folder
  // ==============================

  const [folder, setFolder] = useState(null);

  const [subfolders, setSubfolders] = useState([]);

  // ==============================
  // Files
  // ==============================

  const [files, setFiles] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ==============================
  // Create Subfolder
  // ==============================

  const [folderName, setFolderName] = useState("");

  const [creatingFolder, setCreatingFolder] =
    useState(false);

  // ==============================
  // Rename Folder
  // ==============================

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [selectedFolder, setSelectedFolder] =
    useState(null);

  // ==============================
  // Load Data
  // ==============================

  useEffect(() => {
    loadFolder();
    loadSubfolders();
    loadFiles();
  }, [folderId]);

  // ==============================
  // Load Current Folder
  // ==============================

  const loadFolder = async () => {
    try {
      const response = await api.get(
        `/folders/${folderId}`
      );

      setFolder(response.data.folder);
    } catch (error) {
      console.error(
        "Failed to load folder:",
        error
      );
    }
  };

  // ==============================
  // Load Subfolders
  // ==============================

  const loadSubfolders = async () => {
    try {
      const response = await getFolders(
        folderId
      );

      setSubfolders(
        response.folders || []
      );
    } catch (error) {
      console.error(
        "Failed to load subfolders:",
        error
      );
    }
  };

  // ==============================
  // Load Files
  // ==============================

  const loadFiles = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/files/folder/${folderId}`
      );

      setFiles(
        response.data.files || []
      );
    } catch (error) {
      console.error(
        "Failed to load folder files:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load folder files."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Back To Parent Folder
  // ==============================

  const handleBack = () => {
    /*
      If this folder has a parent,
      go to that parent.

      If parentFolder is null,
      this is a root folder,
      so go back to /folders.
    */

    if (folder?.parentFolder) {
      navigate(
        `/folders/${folder.parentFolder}`
      );

      return;
    }

    navigate("/folders");
  };

  // ==============================
  // Refresh
  // ==============================

  const refreshFolder = async () => {
    await Promise.all([
      loadFolder(),
      loadSubfolders(),
      loadFiles(),
    ]);
  };

  // ==============================
  // Create Subfolder
  // ==============================

  const handleCreateFolder = async () => {
    const trimmedName =
      folderName.trim();

    if (!trimmedName) {
      alert(
        "Please enter a folder name."
      );

      return;
    }

    try {
      setCreatingFolder(true);

      await createFolder(
        trimmedName,
        folderId
      );

      setFolderName("");

      await loadSubfolders();

      alert(
        "Folder created successfully."
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create folder."
      );
    } finally {
      setCreatingFolder(false);
    }
  };

  // ==============================
  // Open Subfolder
  // ==============================

  const openFolder = (subfolder) => {
    navigate(
      `/folders/${subfolder._id}`
    );
  };

  // ==============================
  // Rename Dialog
  // ==============================

  const openRenameDialog = (folder) => {
    setSelectedFolder(folder);
    setRenameOpen(true);
  };

  // ==============================
  // Rename Folder
  // ==============================

  const handleRename = async (
    newName
  ) => {
    if (!selectedFolder) {
      return;
    }

    try {
      await renameFolder(
        selectedFolder._id,
        newName
      );

      setRenameOpen(false);
      setSelectedFolder(null);

      await loadSubfolders();

      alert(
        "Folder renamed successfully."
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Rename failed."
      );
    }
  };

  // ==============================
  // Delete Folder
  // ==============================

  const handleDeleteFolder = async (
    folderIdToDelete
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder?"
      )
    ) {
      return;
    }

    try {
      await deleteFolder(
        folderIdToDelete
      );

      await loadSubfolders();

      alert(
        "Folder deleted successfully."
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  // ==============================
  // Search Files
  // ==============================

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.originalName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [files, search]);

  // ==============================
  // Total Size
  // ==============================

  const totalSize = useMemo(() => {
    return files.reduce(
      (total, file) =>
        total + file.fileSize,
      0
    );
  }, [files]);

  // ==============================
  // Favorite
  // ==============================

  const handleFavorite = async (
    file
  ) => {
    try {
      await toggleFavorite(
        file._id
      );

      await loadFiles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update favorite."
      );
    }
  };

  // ==============================
  // Preview
  // ==============================

  const handlePreview = (file) => {
    if (!file.filePath) {
      alert(
        "Preview unavailable."
      );

      return;
    }

    const filename =
      file.filePath
        .replace(/\\/g, "/")
        .split("/")
        .pop();

    window.open(
      `http://localhost:5001/uploads/${filename}`,
      "_blank"
    );
  };

  // ==============================
  // Download
  // ==============================

  const handleDownload = async (
    file
  ) => {
    try {
      const response =
        await downloadFile(
          file._id
        );

      const url =
        window.URL.createObjectURL(
          new Blob([
            response.data,
          ])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        file.originalName;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Download failed."
      );
    }
  };

  // ==============================
  // Delete File
  // ==============================

  const handleDelete = async (
    file
  ) => {
    if (
      !window.confirm(
        "Delete this file?"
      )
    ) {
      return;
    }

    try {
      await deleteFile(
        file._id
      );

      await loadFiles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  // ==============================
  // Rename File
  // ==============================

  const handleFileRename = () => {
    alert(
      "Rename dialog will be connected next."
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (loading && !folder) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">
            Loading folder...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ==============================
  // Render
  // ==============================

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* ============================== */}
        {/* Folder Header */}
        {/* ============================== */}

        <FolderHeader
          folder={folder}
          folderId={folderId}
          fileCount={files.length}
          totalSize={totalSize}
          onUploadSuccess={loadFiles}
          onBack={handleBack}
        />

        {/* ============================== */}
        {/* Create Subfolder */}
        {/* ============================== */}

        <div className="rounded-2xl border bg-card p-5">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">

              <FolderPlus
                size={20}
                className="text-primary"
              />

            </div>

            <div>

              <h2 className="font-semibold">
                Create Subfolder
              </h2>

              <p className="text-sm text-muted-foreground">
                Organize files inside this folder.
              </p>

            </div>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Input
              value={folderName}
              onChange={(event) =>
                setFolderName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  handleCreateFolder();
                }
              }}
              placeholder="Enter folder name..."
            />

            <Button
              onClick={
                handleCreateFolder
              }
              disabled={
                creatingFolder
              }
            >

              <FolderPlus className="mr-2 h-4 w-4" />

              {creatingFolder
                ? "Creating..."
                : "Create Folder"}

            </Button>

          </div>

        </div>

        {/* ============================== */}
        {/* Subfolders */}
        {/* ============================== */}

        {subfolders.length > 0 && (
          <div className="space-y-4">

            <div>

              <h2 className="text-xl font-semibold">
                Folders
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Folders inside{" "}
                {folder?.name || "this folder"}.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {subfolders.map(
                (subfolder) => (
                  <FolderCard
                    key={
                      subfolder._id
                    }
                    folder={
                      subfolder
                    }
                    onRename={() =>
                      openRenameDialog(
                        subfolder
                      )
                    }
                    onDelete={() =>
                      handleDeleteFolder(
                        subfolder._id
                      )
                    }
                  />
                )
              )}

            </div>

          </div>
        )}

        {/* ============================== */}
        {/* File Stats */}
        {/* ============================== */}

        <FolderStats
          files={files}
        />

        {/* ============================== */}
        {/* Search */}
        {/* ============================== */}

        <FolderSearch
          search={search}
          setSearch={setSearch}
        />

        {/* ============================== */}
        {/* Files */}
        {/* ============================== */}

        {filteredFiles.length === 0 ? (
          <FolderEmpty />
        ) : (
          <div className="space-y-4">

            {filteredFiles.map(
              (file) => (
                <FolderFileCard
                  key={file._id}
                  file={file}
                  onFavorite={
                    handleFavorite
                  }
                  onPreview={
                    handlePreview
                  }
                  onDownload={
                    handleDownload
                  }
                  onRename={
                    handleFileRename
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}

          </div>
        )}

        {/* ============================== */}
        {/* Rename Folder */}
        {/* ============================== */}

        <RenameFolderDialog
          open={renameOpen}
          onOpenChange={
            setRenameOpen
          }
          folder={
            selectedFolder
          }
          onSave={
            handleRename
          }
        />

      </div>
    </MainLayout>
  );
}