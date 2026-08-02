import { useState } from "react";

import MainLayout from "@/layouts/MainLayout";
import useFiles from "@/hooks/useFiles";

import FileToolbar from "@/components/files/FileToolbar";
import UploadButton from "@/components/files/UploadButton";
import FileRow from "@/components/files/FileRow";

import { deleteFile } from "@/services/deleteFileService";
import { downloadFile } from "@/services/downloadFileService";

export default function MyFiles() {
  const {
    files,
    loading,
    error,
    refreshFiles,
  } = useFiles();

  const [search, setSearch] = useState("");

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
      alert(
        error.response?.data?.message ||
          "Failed to delete file."
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

        <div className="overflow-hidden rounded-2xl border bg-card">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Size
                </th>

                <th className="p-4 text-left">
                  Uploaded
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredFiles.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No files found.
                  </td>
                </tr>

              ) : (

                filteredFiles.map((file) => (

                  <FileRow
                    key={file._id}
                    file={file}
                    onDownload={() =>
                      handleDownload(file)
                    }
                    onRename={() =>
                      alert("Rename feature coming next.")
                    }
                    onDelete={() =>
                      handleDelete(file._id)
                    }
                  />

                ))

              )}

            </tbody>
          </table>
        </div>

      </div>
    </MainLayout>
  );
}