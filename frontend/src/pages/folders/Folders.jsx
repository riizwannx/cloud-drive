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

export default function Folders() {
  const {
    folders,
    loading,
    error,
    refreshFolders,
  } = useFolders();

  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);

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

const handleRenameFolder = async (folder) => {
  alert("handleRenameFolder called");

  const newName = prompt(
    "Enter new folder name:",
    folder.name
  );

  alert("New Name: " + newName);

  if (!newName || !newName.trim()) {
    return;
  }

    try {
    const result = await renameFolder(folder._id, newName.trim());

    console.log(result);

    alert("Rename Success");

    await refreshFolders();
    } catch (error) {
    console.error(error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Rename failed."
       );
    }
  };

  const handleDeleteFolder = async (folder) => {
    const confirmed = window.confirm(
      `Delete "${folder.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFolder(folder._id);

      await refreshFolders();

      alert("Folder deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete folder."
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
              Create your first folder.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {folders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onRename={() =>
                  handleRenameFolder(folder)
                }
                onDelete={() =>
                  handleDeleteFolder(folder)
                }
              />
            ))}

          </div>
        )}

      </div>
    </MainLayout>
  );
}