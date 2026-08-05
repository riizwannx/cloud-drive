import { useState } from "react";
import { FolderPlus } from "lucide-react";

import MainLayout from "@/layouts/MainLayout";
import useFolders from "@/hooks/useFolders";

import {
  createFolder,
  renameFolder,
  deleteFolder,
} from "@/services/folderService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import FolderCard from "@/components/folders/FolderCard";
import RenameFolderDialog from "@/components/folders/RenameFolderDialog";

export default function Folders() {
  const {
    folders,
    loading,
    error,
    refreshFolders,
  } = useFolders();

  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // ===========================
  // Create Folder
  // ===========================
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Please enter a folder name.");
      return;
    }

    try {
      setCreating(true);

      await createFolder(folderName);

      setFolderName("");

      await refreshFolders();

      alert("Folder created successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create folder."
      );
    } finally {
      setCreating(false);
    }
  };

  // ===========================
  // Open Rename Dialog
  // ===========================
  const openRenameDialog = (folder) => {
    setSelectedFolder(folder);
    setRenameOpen(true);
  };

  // ===========================
  // Rename Folder
  // ===========================
  const handleRename = async (newName) => {
    try {
      await renameFolder(
        selectedFolder._id,
        newName
      );

      setRenameOpen(false);
      setSelectedFolder(null);

      await refreshFolders();

      alert("Folder renamed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Rename failed."
      );
    }
  };

  // ===========================
  // Delete Folder
  // ===========================
  const handleDeleteFolder = async (folderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder?"
      )
    ) {
      return;
    }

    try {
      await deleteFolder(folderId);

      await refreshFolders();

      alert("Folder deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Delete failed."
      );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Folders
          </h1>

          <p className="mt-2 text-muted-foreground">
            Organize all your files into folders.
          </p>
        </div>

        <div className="flex gap-3">

          <Input
            value={folderName}
            onChange={(e) =>
              setFolderName(e.target.value)
            }
            placeholder="Enter folder name..."
          />

          <Button
            onClick={handleCreateFolder}
            disabled={creating}
          >
            <FolderPlus className="mr-2 h-4 w-4" />

            {creating
              ? "Creating..."
              : "Create Folder"}
          </Button>

        </div>

        {loading ? (
          <p>Loading folders...</p>
        ) : error ? (
          <p className="text-red-500">
            {error}
          </p>
        ) : folders.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">

            <h2 className="text-xl font-semibold">
              No folders yet
            </h2>

            <p className="mt-2 text-muted-foreground">
              Create your first folder to organize your files.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {folders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onRename={() =>
                  openRenameDialog(folder)
                }
                onDelete={() =>
                  handleDeleteFolder(folder._id)
                }
              />
            ))}

          </div>
        )}

        <RenameFolderDialog
          open={renameOpen}
          onOpenChange={setRenameOpen}
          folder={selectedFolder}
          onSave={handleRename}
        />

      </div>
    </MainLayout>
  );
}