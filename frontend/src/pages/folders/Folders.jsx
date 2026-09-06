import { useState } from "react";
import { FolderPlus, FolderOpen } from "lucide-react";

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
      <div className="page-shell">

        <div>
          <p className="mb-3 text-sm font-medium text-indigo-600 dark:text-indigo-300">File organization</p>
          <h1 className="page-heading">
            Folders
          </h1>

          <p className="page-description">
            Create a clear home for every project, document, and memory.
          </p>
        </div>

        <div className="surface-card rounded-2xl p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-300"><FolderPlus className="h-5 w-5" /></div>
            <div><h2 className="font-semibold">Create a folder</h2><p className="text-sm text-muted-foreground">Keep related files together from the start.</p></div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">

          <Input
            value={folderName}
            onChange={(e) =>
              setFolderName(e.target.value)
            }
            placeholder="Enter folder name..."
            className="h-11 rounded-xl border-transparent bg-secondary/70 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
          />

          <Button
            onClick={handleCreateFolder}
            disabled={creating}
            className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 shadow-md shadow-indigo-500/20"
          >
            <FolderPlus className="mr-2 h-4 w-4" />

            {creating
              ? "Creating..."
              : "Create Folder"}
          </Button>

          </div>
        </div>

        {loading ? (
          <div className="surface-card rounded-2xl p-10 text-center text-muted-foreground">Loading folders...</div>
        ) : error ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-destructive">
            {error}
          </p>
        ) : folders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200/80 bg-card p-12 text-center dark:border-indigo-400/25">

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"><FolderOpen className="h-7 w-7" /></div>

            <h2 className="mt-5 text-xl font-semibold">
              No folders yet
            </h2>

            <p className="mt-2 text-muted-foreground">
              Create your first folder to organize your files.
            </p>

          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

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
