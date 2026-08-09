import {
  Eye,
  Download,
  Pencil,
  Trash2,
  Star,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FileActions({
  isFavorite,
  onFavorite,
  onPreview,
  onDownload,
  onRename,
  onDelete,
  onShare,
}) {
  return (
    <div className="flex items-center justify-center gap-1">

      {/* Favorite */}

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

      {/* Preview */}

      <Button
        variant="ghost"
        size="icon"
        onClick={onPreview}
        title="Preview"
      >
        <Eye size={18} />
      </Button>

      {/* Download */}

      <Button
        variant="ghost"
        size="icon"
        onClick={onDownload}
        title="Download"
      >
        <Download size={18} />
      </Button>

      {/* Share */}

      <Button
        variant="ghost"
        size="icon"
        onClick={onShare}
        title="Share"
      >
        <Share2 size={18} />
      </Button>

      {/* Rename */}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRename}
        title="Rename"
      >
        <Pencil size={18} />
      </Button>

      {/* Delete */}

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