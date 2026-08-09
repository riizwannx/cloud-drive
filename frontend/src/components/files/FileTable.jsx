import FileRow from "./FileRow";

export default function FileTable({
  files,
  onPreview,
  onDownload,
  onRename,
  onDelete,
  onFavorite,
  onShare,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">

        <thead className="border-b bg-muted/40">
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
              Uploaded
            </th>

            <th className="p-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-muted-foreground"
              >
                No files found.
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <FileRow
                key={file._id}
                file={file}
                onPreview={() => onPreview(file)}
                onDownload={() => onDownload(file)}
                onRename={() => onRename(file)}
                onDelete={() => onDelete(file._id)}
                onFavorite={() => onFavorite(file)}
                onShare={() => onShare(file)}
              />
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}