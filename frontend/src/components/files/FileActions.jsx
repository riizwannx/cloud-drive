import {
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FileActions({
  onDownload,
  onRename,
  onDelete,
}) {
  return (
    <div className="flex justify-center gap-2">

      <Button
        variant="ghost"
        size="icon"
        onClick={onDownload}
        title="Download"
      >
        <Download size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRename}
        title="Rename"
      >
        <Pencil size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2
          size={18}
          className="text-red-500"
        />
      </Button>

    </div>
  );
}