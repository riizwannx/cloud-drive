import { useEffect, useState } from "react";

import {
  Share2,
  Download,
  Copy,
  Trash2,
  FileText,
} from "lucide-react";

import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

import {
  getSharedFiles,
  removeShare,
} from "@/services/shareService";

export default function Shared() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // Load Shared Files
  // ==============================

  const loadSharedFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSharedFiles();

      console.log(
        "SHARED API RESPONSE:",
        response
      );

      const sharedFiles = Array.isArray(
        response?.files
      )
        ? response.files
        : [];

      console.log(
        "SHARED FILES:",
        sharedFiles
      );

      setFiles(sharedFiles);
    } catch (error) {
      console.error(
        "Failed to load shared files:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load shared files."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedFiles();
  }, []);

  // ==============================
  // Copy Share Link
  // ==============================

  const handleCopyLink = async (file) => {
    try {
      const shareUrl =
        `${window.location.origin}/share/${file.shareToken}`;

      await navigator.clipboard.writeText(
        shareUrl
      );

      alert("Share link copied successfully.");
    } catch (error) {
      console.error(
        "Copy link failed:",
        error
      );

      alert("Failed to copy share link.");
    }
  };

  // ==============================
  // Open Shared File
  // ==============================

  const handleDownload = (file) => {
    const shareUrl =
      `${window.location.origin}/share/${file.shareToken}`;

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==============================
  // Remove Sharing
  // ==============================

  const handleRemoveShare = async (file) => {
    const confirmed = window.confirm(
      `Remove sharing for "${file.originalName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeShare(file._id);

      await loadSharedFiles();

      alert(
        "File sharing removed successfully."
      );
    } catch (error) {
      console.error(
        "Remove sharing failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove sharing."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <MainLayout>
        <div className="surface-card flex min-h-[400px] items-center justify-center rounded-2xl">
          <p className="text-muted-foreground">
            Loading shared files...
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
        <div className="page-shell">

          <div>
            <h1 className="page-heading">
              Shared
            </h1>

            <p className="page-description">
              Manage files you have shared.
            </p>
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            {error}
          </div>

        </div>
      </MainLayout>
    );
  }

  // ==============================
  // Main Page
  // ==============================

  return (
    <MainLayout>
      <div className="page-shell">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div>
          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Share2
                size={22}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>

            <div>
              <h1 className="page-heading">
                Shared
              </h1>

              <p className="page-description">
                Manage files you have shared
                with others.
              </p>
            </div>

          </div>
        </div>

        {/* ============================== */}
        {/* File Count */}
        {/* ============================== */}

        <div className="surface-card flex items-center justify-between rounded-2xl px-5 py-4">

          <div>
            <p className="font-semibold">
              Shared Files
            </p>

            <p className="text-sm text-muted-foreground">
              {files.length === 1
                ? "1 file is currently shared."
                : `${files.length} files are currently shared.`}
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 font-semibold text-indigo-600 dark:text-indigo-300">
            {files.length}
          </div>

        </div>

        {/* ============================== */}
        {/* Empty State */}
        {/* ============================== */}

        {files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200/80 bg-card p-12 text-center dark:border-indigo-400/25">

            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Share2
                size={28}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No shared files
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Files you share from My Files
              will appear here.
            </p>

          </div>
        ) : (

          /* ============================== */
          /* Shared Files */
          /* ============================== */

          <div className="surface-card overflow-hidden rounded-2xl">

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="border-b bg-secondary/50 text-xs uppercase tracking-[0.08em] text-muted-foreground">

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
                      Shared
                    </th>

                    <th className="p-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {files.map((file) => (

                    <tr
                      key={file._id}
                      className="border-b border-border/70 transition hover:bg-secondary/40 last:border-b-0"
                    >

                      {/* ============================== */}
                      {/* File Name */}
                      {/* ============================== */}

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">

                            <FileText
                              size={19}
                              className="text-indigo-600 dark:text-indigo-300"
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-xs truncate font-medium">
                              {file.originalName}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Shared file
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ============================== */}
                      {/* File Type */}
                      {/* ============================== */}

                      <td className="p-4 text-muted-foreground">
                        {file.fileType}
                      </td>

                      {/* ============================== */}
                      {/* File Size */}
                      {/* ============================== */}

                      <td className="p-4 text-muted-foreground">
                        {file.fileSize < 1024
                          ? `${file.fileSize} B`
                          : file.fileSize <
                              1024 * 1024
                            ? `${(
                                file.fileSize /
                                1024
                              ).toFixed(1)} KB`
                            : `${(
                                file.fileSize /
                                (1024 * 1024)
                              ).toFixed(1)} MB`}
                      </td>

                      {/* ============================== */}
                      {/* Shared Date */}
                      {/* ============================== */}

                      <td className="p-4 text-muted-foreground">
                        {new Date(
                          file.updatedAt
                        ).toLocaleDateString()}
                      </td>

                      {/* ============================== */}
                      {/* Actions */}
                      {/* ============================== */}

                      <td className="p-4">

                        <div className="flex items-center justify-center gap-1">

                          {/* Copy Link */}

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleCopyLink(
                                file
                              )
                            }
                            className="rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                            title="Copy share link"
                          >
                            <Copy size={18} />
                          </Button>

                          {/* Open Shared File */}

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleDownload(
                                file
                              )
                            }
                            className="rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                            title="Open shared file"
                          >
                            <Download
                              size={18}
                            />
                          </Button>

                          {/* Remove Share */}

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleRemoveShare(
                                file
                              )
                            }
                            className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Remove sharing"
                          >
                            <Trash2
                              size={18}
                            />
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>
    </MainLayout>
  );
}
