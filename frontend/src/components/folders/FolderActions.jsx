import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FolderActions({
  onRename,
  onDelete,
}) {
  return (
    <div className="mt-4 flex justify-end gap-2 border-t border-border/70 pt-3">

      <Button
        variant="outline"
        size="sm"
        onClick={onRename}
        className="h-8 rounded-lg border-border/80 text-xs shadow-none"
      >
        <Pencil size={16} />
        Rename
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="h-8 rounded-lg text-xs"
      >
        <Trash2 size={16} />
        Delete
      </Button>

    </div>
  );
}
