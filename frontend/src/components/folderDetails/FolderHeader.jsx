import {
  ArrowLeft,
  Folder,
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
        className="h-9 rounded-xl px-3 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft size={18} />

        Back
      </Button>

      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <div className="surface-card flex flex-col gap-5 rounded-2xl p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-400/15 sm:size-20 dark:bg-amber-300/10">

            <Folder
              size={42}
              className="text-amber-500"
            />

          </div>

          <div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {folder.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
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
