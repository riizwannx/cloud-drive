import {
  Eye,
  Download,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FileActions({
  isFavorite,
  onFavorite,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}) {
  return (
    <div className="flex justify-center gap-2">

      <Button
        variant="ghost"
        size="icon"
        onClick={onFavorite}
        title={
          isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites"
        }
      >
        <Star
          size={18}
          className={
            isFavorite
              ? "fill-yellow-400 text-yellow-500"
              : "text-gray-500"
          }
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onPreview}
        title="Preview"
      >
        <Eye size={18} />
      </Button>

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