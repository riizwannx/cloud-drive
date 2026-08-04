import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FolderActions({
  onRename,
  onDelete,
}) {
  return (
    <div className="mt-5 flex justify-end gap-2 border-t pt-4">

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          alert("Rename Clicked");
          onRename?.();
        }}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

    </div>
  );
}