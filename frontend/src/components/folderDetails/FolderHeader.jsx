import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

import UploadButton from "@/components/files/UploadButton";

export default function FolderHeader({
  folder,
  folderId,
  fileCount,
  totalSize,
  onUploadSuccess,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

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
              size={42}
              className="text-yellow-600"
            />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              {folder?.name || "Folder"}
            </h1>

            <p className="mt-1 text-muted-foreground">
              {fileCount} file(s) •{" "}
              {(totalSize / 1024).toFixed(2)} KB
            </p>

          </div>

        </div>

      </div>

      <UploadButton
        folderId={folderId}
        onSuccess={onUploadSuccess}
      />

    </div>
  );
}