import FileRow from "./FileRow";

export default function FileTable({
  files,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <table className="w-full">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Size</th>
            <th className="p-4 text-left">Uploaded</th>
            <th className="p-4 text-center">Actions</th>
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
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}