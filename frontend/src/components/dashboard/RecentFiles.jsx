import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FileText,
  Image,
  FileArchive,
} from "lucide-react";

function getFileIcon(fileType) {
  if (!fileType) return FileArchive;

  if (fileType.startsWith("image/")) {
    return Image;
  }

  if (fileType === "application/pdf") {
    return FileText;
  }

  return FileArchive;
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function RecentFiles({ files = [] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Recent Files</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {files.length === 0 ? (
          <p className="text-muted-foreground">
            No recent files found.
          </p>
        ) : (
          files.map((file) => {
            const Icon = getFileIcon(file.fileType);

            return (
              <div
                key={file._id}
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {file.originalName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {file.fileType}
                    </p>
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  <p>{formatFileSize(file.fileSize)}</p>

                  <p>
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}