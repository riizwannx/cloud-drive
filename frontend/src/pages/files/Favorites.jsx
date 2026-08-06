import { useEffect, useState } from "react";

import MainLayout from "@/layouts/MainLayout";

import FileTable from "@/components/files/FileTable";

import { getFavoriteFiles } from "@/services/favoriteService";
import { toggleFavorite } from "@/services/favoriteService";
import { downloadFile } from "@/services/downloadFileService";
import { deleteFile } from "@/services/deleteFileService";
import { renameFile } from "@/services/renameFileService";

import RenameDialog from "@/components/files/RenameDialog";

export default function Favorites() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [renameOpen, setRenameOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await getFavoriteFiles();
      setFiles(response.files);
    } catch (error) {
      console.error(error);
      alert("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (file) => {
    try {
      await toggleFavorite(file._id);
      await loadFavorites();
    } catch (error) {
      alert("Failed to update favorite.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) {
      return;
    }

    try {
      await deleteFile(id);
      await loadFavorites();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await downloadFile(file._id);

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = file.originalName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed.");
    }
  };

  const handlePreview = (file) => {
    const filename = file.filePath
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    window.open(
      `http://localhost:5000/uploads/${filename}`,
      "_blank"
    );
  };

  const openRenameDialog = (file) => {
    setSelectedFile(file);
    setRenameOpen(true);
  };

  const handleRename = async (newName) => {
    try {
      await renameFile(selectedFile._id, newName);

      setRenameOpen(false);
      setSelectedFile(null);

      await loadFavorites();
    } catch (error) {
      alert("Rename failed.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold">
            Favorites
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your favorite files.
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <FileTable
            files={files}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onRename={openRenameDialog}
            onDelete={handleDelete}
            onFavorite={handleFavorite}
          />
        )}

        <RenameDialog
          open={renameOpen}
          onOpenChange={setRenameOpen}
          file={selectedFile}
          onSave={handleRename}
        />

      </div>
    </MainLayout>
  );
}