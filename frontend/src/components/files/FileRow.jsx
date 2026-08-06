import FileActions from "@/components/files/FileActions";
import { formatFileSize, getFileType } from "@/lib/fileUtils";

export default function FileRow({
  file,
  onPreview,
  onDownload,
  onRename,
  onDelete,
  onFavorite,
}) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/30">

      <td className="max-w-xs truncate p-4 font-medium">
        {file.originalName}
      </td>

      <td className="p-4">
        {getFileType(file.fileType)}
      </td>

      <td className="p-4">
        {formatFileSize(file.fileSize)}
      </td>

      <td className="p-4">
        {new Date(file.createdAt).toLocaleDateString()}
      </td>

      <td className="p-4">

        <FileActions
          isFavorite={file.isFavorite}
          onFavorite={onFavorite}
          onPreview={onPreview}
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
        />

      </td>

    </tr>
  );
}