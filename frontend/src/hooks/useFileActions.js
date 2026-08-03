import { deleteFile } from "@/services/deleteFileService";
import { downloadFile } from "@/services/downloadFileService";
import { renameFile } from "@/services/renameFileService";

export default function useFileActions(refreshFiles) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
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

  const handleRename = async (id, newName) => {
    try {
      await renameFile(id, newName);

      await refreshFiles();

      alert("File renamed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Rename failed."
      );
    }
  };

  return {
    handleDelete,
    handleDownload,
    handleRename,
  };
}