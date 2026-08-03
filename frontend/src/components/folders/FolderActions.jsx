import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FolderActions({
  onRename,
  onDelete,
}) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRename}
      >
        <Pencil size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
      >
        <Trash2
          size={18}
          className="text-red-500"
        />
      </Button>
    </div>
  );
}