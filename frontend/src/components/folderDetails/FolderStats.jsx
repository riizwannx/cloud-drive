import {
  Files,
  HardDrive,
  Star,
  Trash2,
} from "lucide-react";

export default function FolderStats({
  files,
}) {
  const totalSize = files.reduce(
    (total, file) => total + file.fileSize,
    0
  );

  const favoriteFiles = files.filter(
    (file) => file.isFavorite
  ).length;

  const trashedFiles = files.filter(
    (file) => file.isTrashed
  ).length;

  const stats = [
    {
      title: "Files",
      value: files.length,
      icon: Files,
    },
    {
      title: "Storage",
      value: `${(totalSize / 1024).toFixed(2)} KB`,
      icon: HardDrive,
    },
    {
      title: "Favorites",
      value: favoriteFiles,
      icon: Star,
    },
    {
      title: "Trash",
      value: trashedFiles,
      icon: Trash2,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-card p-5 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {stat.value}
              </h3>

            </div>

            <stat.icon
              size={28}
              className="text-primary"
            />

          </div>

        </div>
      ))}

    </div>
  );
}