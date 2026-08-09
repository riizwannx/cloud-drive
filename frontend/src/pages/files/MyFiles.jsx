import { useState } from "react";

import MainLayout from "@/layouts/MainLayout";
import useFiles from "@/hooks/useFiles";

import FileToolbar from "@/components/files/FileToolbar";
import UploadButton from "@/components/files/UploadButton";
import FileTable from "@/components/files/FileTable";
import RenameDialog from "@/components/files/RenameDialog";

import { deleteFile } from "@/services/deleteFileService";
import { downloadFile } from "@/services/downloadFileService";
import { renameFile } from "@/services/renameFileService";
import { toggleFavorite } from "@/services/favoriteService";
import { shareFile } from "@/services/shareService";

export default function MyFiles() {
  const {
    files,
    loading,
    error,
    refreshFiles,
  } = useFiles();

  const [search, setSearch] = useState("");

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const filteredFiles = files.filter((file) =>
    file.originalName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==============================
  // Delete
  // ==============================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this file?"
      )
    ) {
      return;
    }

    try {
      await deleteFile(id);

      await refreshFiles();

      alert("File deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  // ==============================
  // Download
  // ==============================

  const handleDownload = async (file) => {
    try {
      const response = await downloadFile(
        file._id
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.download = file.originalName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Download failed."
      );
    }
  };

  // ==============================
  // Rename
  // ==============================

  const openRenameDialog = (file) => {
    setSelectedFile(file);
    setRenameOpen(true);
  };

  const handleRename = async (newName) => {
    try {
      await renameFile(
        selectedFile._id,
        newName
      );

      setRenameOpen(false);
      setSelectedFile(null);

      await refreshFiles();

      alert("File renamed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Rename failed."
      );
    }
  };

  // ==============================
  // Favorite
  // ==============================

  const handleFavorite = async (file) => {
    try {
      await toggleFavorite(file._id);

      await refreshFiles();
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
        "Preview is unavailable for this file."
      );
      return;
    }

    const normalizedPath =
      file.filePath.replace(/\\/g, "/");

    const filename =
      normalizedPath.split("/").pop();

    window.open(
      `http://localhost:5001/uploads/${filename}`,
      "_blank"
    );
  };

  // ==============================
  // Share
  // ==============================

  const handleShare = async (file) => {
    try {
      const response = await shareFile(
        file._id
      );

      const token = response.shareToken;

      if (!token) {
        throw new Error(
          "Share token was not returned."
        );
      }

      const shareUrl =
        `${window.location.origin}/share/${token}`;

      await navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        `Share link copied!\n\n${shareUrl}`
      );

      await refreshFiles();
    } catch (error) {
      console.error(
        "Share failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to share file."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">
            Loading files...
          </p>
        </div>
      </MainLayout>
    );
  }

  // ==============================
  // Error
  // ==============================

  if (error) {
    return (
      <MainLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div>
          <h1 className="text-4xl font-bold">
            My Files
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage all your uploaded files.
          </p>
        </div>

        {/* ============================== */}
        {/* Toolbar */}
        {/* ============================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <FileToolbar
            search={search}
            setSearch={setSearch}
          />

          <UploadButton
            onSuccess={refreshFiles}
          />

        </div>

        {/* ============================== */}
        {/* File Table */}
        {/* ============================== */}

        <FileTable
          files={filteredFiles}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onRename={openRenameDialog}
          onDelete={handleDelete}
          onFavorite={handleFavorite}
          onShare={handleShare}
        />

        {/* ============================== */}
        {/* Rename Dialog */}
        {/* ============================== */}

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