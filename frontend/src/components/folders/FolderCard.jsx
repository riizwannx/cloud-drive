import { Folder } from "lucide-react";
import FolderActions from "./FolderActions";

export default function FolderCard({
  folder,
  onRename,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition">
      <Folder
        size={42}
        className="mb-4 text-yellow-500"
      />

      <h3 className="text-lg font-semibold">
        {folder.name}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Created{" "}
        {new Date(folder.createdAt).toLocaleDateString()}
      </p>

      <FolderActions
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
}