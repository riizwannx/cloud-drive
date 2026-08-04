import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FolderActions({
  onRename,
  onDelete,
}) {
  return (
    <div className="mt-5 flex justify-end gap-2 border-t pt-4">

      <Button
        variant="outline"
        size="sm"
        onClick={onRename}
        className="gap-2"
      >
        <Pencil size={16} />
        Rename
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="gap-2"
      >
        <Trash2 size={16} />
        Delete
      </Button>

    </div>
  );
}