import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold">
            Trash
          </h1>

          <p className="text-muted-foreground mt-2">
            Deleted files appear here.
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : files.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-2xl font-semibold">
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
                className="flex items-center justify-between rounded-xl border p-5"
              >
                <div>
                  <h3 className="font-semibold">
                    {file.originalName}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {(file.fileSize / 1024).toFixed(2)} KB
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Deleted on{" "}
                    {new Date(
                      file.trashedAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleRestore(file._id)
                    }
                  >
                    Restore
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      handlePermanentDelete(
                        file._id
                      )
                    }
                  >
                    Delete Forever
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