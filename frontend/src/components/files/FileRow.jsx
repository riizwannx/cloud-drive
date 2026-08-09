import FileActions from "@/components/files/FileActions";
import {
  formatFileSize,
  getFileType,
} from "@/lib/fileUtils";

export default function FileRow({
  file,
  onPreview,
  onDownload,
  onRename,
  onDelete,
  onFavorite,
  onShare,
}) {
  return (
    <tr>

      {/* File Name */}

      <td className="max-w-xs truncate p-4 font-medium">
        {file.originalName}
      </td>

      {/* File Type */}

      <td className="p-4">
        {getFileType(file.fileType)}
      </td>

      {/* File Size */}

      <td className="p-4">
        {formatFileSize(file.fileSize)}
      </td>

      {/* Uploaded Date */}

      <td className="p-4">
        {new Date(
          file.createdAt
        ).toLocaleDateString()}
      </td>

      {/* Actions */}

      <td className="p-4">

        <FileActions
          isFavorite={file.isFavorite}
          onFavorite={onFavorite}
          onPreview={onPreview}
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
          onShare={onShare}
        />

      </td>

    </tr>
  );
}