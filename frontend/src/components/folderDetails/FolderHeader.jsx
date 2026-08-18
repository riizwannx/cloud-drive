import {
  ArrowLeft,
  Folder,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import UploadButton from "@/components/files/UploadButton";

export default function FolderHeader({
  folder,
  folderId,
  fileCount,
  totalSize,
  onUploadSuccess,
  onBack,
}) {
  if (!folder) {
    return null;
  }

  return (
    <div className="space-y-5">

      {/* ============================== */}
      {/* Back Button */}
      {/* ============================== */}

      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft size={18} />

        Back
      </Button>

      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex size-20 items-center justify-center rounded-2xl bg-yellow-100">

            <Folder
              size={42}
              className="text-yellow-600"
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold">
              {folder.name}
            </h1>

            <p className="mt-1 text-muted-foreground">
              {fileCount}{" "}
              {fileCount === 1
                ? "file"
                : "files"}{" "}
              •{" "}
              {(totalSize / 1024).toFixed(
                2
              )}{" "}
              KB
            </p>

          </div>

        </div>

        {/* ============================== */}
        {/* Upload */}
        {/* ============================== */}

        <UploadButton
          folderId={folderId}
          onSuccess={
            onUploadSuccess
          }
        />

      </div>

    </div>
  );
}