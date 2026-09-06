import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, RotateCcw, Trash2 } from "lucide-react";

import {
  getTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
} from "@/services/trashService";

export default function Trash() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrash = async () => {
    try {
      const response = await getTrashFiles();
      setFiles(response.files || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load trash.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreFile(id);
      loadTrash();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Restore failed."
      );
    }
  };

  const handlePermanentDelete = async (id) => {
    if (
      !window.confirm(
        "Permanently delete this file?"
      )
    ) {
      return;
    }

    try {
      await permanentlyDeleteFile(id);
      loadTrash();
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
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><Trash2 className="h-5 w-5" /></div>
          <h1 className="page-heading">
            Trash
          </h1>

          <p className="page-description">
            Restore files you still need, or permanently remove them when you are sure.
          </p>
        </div>

        {loading ? (
          <div className="surface-card rounded-2xl p-10 text-center text-muted-foreground">Loading trash...</div>
        ) : files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-destructive/25 bg-card p-12 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><Trash2 className="h-7 w-7" /></div>
            <h2 className="mt-5 text-xl font-semibold">
              Trash is Empty
            </h2>

            <p className="mt-2 text-muted-foreground">
              No deleted files.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file._id}
                className="surface-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"><FileText className="h-5 w-5" /></div>
                  <div className="min-w-0">
                  <h3 className="truncate font-semibold" title={file.originalName}>
                    {file.originalName}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {(file.fileSize / 1024).toFixed(2)} KB
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Deleted on{" "}
                    {new Date(
                      file.trashedAt
                    ).toLocaleString()}
                  </p>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-auto">

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleRestore(file._id)
                    }
                    className="h-9 rounded-xl border-border/80 text-xs shadow-none"
                  >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" /> Restore
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      handlePermanentDelete(
                        file._id
                      )
                    }
                    className="h-9 rounded-xl text-xs"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Forever
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
