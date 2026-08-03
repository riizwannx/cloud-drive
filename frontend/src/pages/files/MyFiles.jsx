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

export default function MyFiles() {
  const {
    files,
    loading,
    error,
    refreshFiles,
  } = useFiles();

  const [search, setSearch] = useState("");

  const [renameOpen, setRenameOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const filteredFiles = files.filter((file) =>
    file.originalName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await deleteFile(id);
      await refreshFiles();
      alert("File deleted successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed.");
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
      alert(error.response?.data?.message || "Download failed.");
    }
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

      await refreshFiles();

      alert("File renamed successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Rename failed.");
    }
  };

  const handlePreview = (file) => {
    if (!file.filePath) {
      alert("Preview is unavailable for this file.");
      return;
  }

  const normalizedPath = file.filePath.replace(/\\/g, "/");

  const filename = normalizedPath.split("/").pop();

  window.open(
    `http://localhost:5000/uploads/${filename}`,
    "_blank"
  );
};

  if (loading) {
    return (
      <MainLayout>
        <h1 className="text-2xl font-bold">
          Loading files...
        </h1>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <h1 className="text-2xl text-red-500">
          {error}
        </h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold">
            My Files
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage all your uploaded files.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <FileToolbar
            search={search}
            setSearch={setSearch}
          />

          <UploadButton
            onSuccess={refreshFiles}
          />
        </div>

        <FileTable
          files={filteredFiles}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onRename={openRenameDialog}
          onDelete={handleDelete}
        />

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