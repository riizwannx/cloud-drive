import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  FolderOpen,
  FileText,
  Image,
  FileVideo,
  FileArchive,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

import MainLayout from "@/layouts/MainLayout";
import api from "@/api/api";

import { Button } from "@/components/ui/button";

import UploadButton from "@/components/files/UploadButton";

import { downloadFile } from "@/services/downloadFileService";
import { deleteFile } from "@/services/deleteFileService";

export default function FolderDetails() {
  const { folderId } = useParams();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await api.get(
        `/files/folder/${folderId}`
      );

      setFiles(response.data.files);
    } catch (error) {
      console.error(error);
      alert("Failed to load folder files.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file) => {
    if (!file.filePath) {
      alert("Preview is unavailable.");
      return;
    }

    const normalizedPath = file.filePath.replace(/\\/g, "/");

    const filename = normalizedPath.split("/").pop();

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
        "Are you sure you want to delete this file?"
      )
    ) {
      return;
    }

    try {
      await deleteFile(file._id);

      await loadFiles();

      alert("File deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const getFileIcon = (type) => {
    if (!type) {
      return <FileText size={28} />;
    }

    if (type.startsWith("image")) {
      return (
        <Image
          size={28}
          className="text-blue-500"
        />
      );
    }

    if (type.startsWith("video")) {
      return (
        <FileVideo
          size={28}
          className="text-red-500"
        />
      );
    }

    if (
      type.includes("zip") ||
      type.includes("rar")
    ) {
      return (
        <FileArchive
          size={28}
          className="text-orange-500"
        />
      );
    }

    return (
      <FileText
        size={28}
        className="text-green-600"
      />
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        <div className="flex items-center justify-between">

          <div>

            <Link
              to="/folders"
              className="text-blue-600 hover:underline"
            >
              ← Back to Folders
            </Link>

            <div className="mt-5 flex items-center gap-4">

              <div className="rounded-xl bg-yellow-100 p-4">
                <FolderOpen
                  size={40}
                  className="text-yellow-600"
                />
              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Folder Files
                </h1>

                <p className="text-muted-foreground">
                  {files.length} file(s)
                </p>

              </div>

            </div>

          </div>

          <UploadButton
            folderId={folderId}
            onSuccess={loadFiles}
          />

        </div>

        {loading ? (

          <p>Loading...</p>

        ) : files.length === 0 ? (

          <div className="rounded-xl border border-dashed p-12 text-center">

            <FolderOpen
              size={60}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-2xl font-semibold">
              Folder is empty
            </h2>

            <p className="mt-2 text-muted-foreground">
              Upload files into this folder.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {files.map((file) => (

              <div
                key={file._id}
                className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
              >

                <div className="flex items-center gap-4">

                  {getFileIcon(file.fileType)}

                  <div>

                    <h3 className="font-semibold">
                      {file.originalName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        file.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye size={16} className="mr-2" />
                    Preview
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </MainLayout>
  );
}