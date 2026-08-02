import FileActions from "@/components/files/FileActions";
import { formatFileSize, getFileType } from "@/lib/fileUtils";

export default function FileRow({
  file,
  onDownload,
  onRename,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      <td className="p-4 font-medium">
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
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}