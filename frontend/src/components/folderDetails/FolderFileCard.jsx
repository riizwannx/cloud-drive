import {
  FileText,
  Image,
  FileVideo,
  FileArchive,
} from "lucide-react";

import FileActions from "@/components/files/FileActions";

export default function FolderFileCard({
  file,
  onFavorite,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}) {
  const getFileIcon = (type) => {
    if (!type) {
      return <FileText size={30} />;
    }

    if (type.startsWith("image")) {
      return (
        <Image
          size={30}
          className="text-blue-500"
        />
      );
    }

    if (type.startsWith("video")) {
      return (
        <FileVideo
          size={30}
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
          size={30}
          className="text-orange-500"
        />
      );
    }

    return (
      <FileText
        size={30}
        className="text-green-600"
      />
    );
  };

  return (
    <div className="surface-card rounded-2xl p-4 transition-all hover:shadow-md">

      <div className="flex items-center justify-between">

        <div className="min-w-0 flex items-center gap-4">

          {getFileIcon(file.fileType)}

          <div className="min-w-0">

            <h3 className="truncate font-semibold" title={file.originalName}>
              {file.originalName}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {(file.fileSize / 1024).toFixed(2)} KB
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(
                file.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

        <FileActions
          isFavorite={file.isFavorite}
          onFavorite={() => onFavorite(file)}
          onPreview={() => onPreview(file)}
          onDownload={() => onDownload(file)}
          onRename={() => onRename(file)}
          onDelete={() => onDelete(file)}
        />

      </div>

    </div>
  );
}
