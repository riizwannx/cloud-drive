import { Folder, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FolderActions from "./FolderActions";

export default function FolderCard({
  folder,
  onRename,
  onDelete,
}) {
  const navigate = useNavigate();

  const openFolder = () => {
    navigate(`/folders/${folder._id}`);
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">

      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={openFolder}
      >

        <div className="rounded-xl bg-yellow-100 p-3 flex-shrink-0">
          <Folder
            size={36}
            className="text-yellow-600"
          />
        </div>

        <div className="min-w-0 flex-1">

          <h2
            className="truncate text-lg font-semibold"
            title={folder.name}
          >
            {folder.name}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={14} />

            <span>
              {new Date(folder.createdAt).toLocaleDateString()}
            </span>

          </div>

        </div>

      </div>

      <FolderActions
        onRename={onRename}
        onDelete={onDelete}
      />

    </div>
  );
}