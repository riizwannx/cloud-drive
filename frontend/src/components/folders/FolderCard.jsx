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
    <div className="surface-card group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">

      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={openFolder}
      >

        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 transition-transform group-hover:scale-105 dark:bg-amber-300/10">
          <Folder
            size={30}
            className="text-amber-500"
          />
        </div>

        <div className="min-w-0 flex-1">

          <h2
            className="truncate text-base font-semibold tracking-[-0.02em]"
            title={folder.name}
          >
            {folder.name}
          </h2>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
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
