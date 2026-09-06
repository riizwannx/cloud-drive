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
    <Card className="surface-card rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg tracking-[-0.02em]">Recent files</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
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
                className="flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary/60"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-indigo-500/10 p-2.5">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  </div>

                  <div>
                    <p className="max-w-[12rem] truncate text-sm font-medium sm:max-w-xs">
                      {file.originalName}
                    </p>

                    <p className="max-w-[12rem] truncate text-xs text-muted-foreground sm:max-w-xs">
                      {file.fileType}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-muted-foreground">
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
