import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import api from "@/api/api";

import MainLayout from "@/layouts/MainLayout";

import FolderHeader from "@/components/folderDetails/FolderHeader";
import FolderStats from "@/components/folderDetails/FolderStats";
import FolderSearch from "@/components/folderDetails/FolderSearch";
import FolderFileCard from "@/components/folderDetails/FolderFileCard";
import FolderEmpty from "@/components/folderDetails/FolderEmpty";

import { downloadFile } from "@/services/downloadFileService";
import { deleteFile } from "@/services/deleteFileService";
import { toggleFavorite } from "@/services/favoriteService";

export default function FolderDetails() {
  const { folderId } = useParams();

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolder();
    loadFiles();
  }, [folderId]);

  const loadFolder = async () => {
    try {
      const response = await api.get(`/folders/${folderId}`);
      setFolder(response.data.folder);
    } catch (error) {
      console.error(error);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await api.get(`/files/folder/${folderId}`);
      setFiles(response.data.files);
    } catch (error) {
      console.error(error);
      alert("Failed to load folder files.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.originalName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [files, search]);

  const totalSize = useMemo(() => {
    return files.reduce(
      (total, file) => total + file.fileSize,
      0
    );
  }, [files]);

  const handleFavorite = async (file) => {
    try {
      await toggleFavorite(file._id);
      loadFiles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update favorite."
      );
    }
  };

  const handlePreview = (file) => {
    if (!file.filePath) {
      alert("Preview unavailable.");
      return;
    }

    const filename = file.filePath
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    window.open(
      `http://localhost:5000/uploads/${filename}`,
      "_blank"
    );
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
      alert(
        error.response?.data?.message ||
          "Download failed."
      );
    }
  };

  const handleDelete = async (file) => {
    if (
      !window.confirm(
        "Delete this file?"
      )
    ) {
      return;
    }

    try {
      await deleteFile(file._id);
      loadFiles();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const handleRename = () => {
    alert(
      "Rename dialog will be connected next."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        <FolderHeader
          folder={folder}
          folderId={folderId}
          fileCount={files.length}
          totalSize={totalSize}
          onUploadSuccess={loadFiles}
        />

        <FolderStats files={files} />

        <FolderSearch
          search={search}
          setSearch={setSearch}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredFiles.length === 0 ? (
          <FolderEmpty />
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <FolderFileCard
                key={file._id}
                file={file}
                onFavorite={handleFavorite}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
}