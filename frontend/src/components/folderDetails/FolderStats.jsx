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
          className="surface-card rounded-2xl p-4 transition-shadow hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {stat.title}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {stat.value}
              </h3>

            </div>

            <stat.icon
              size={28}
              className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-300"
            />

          </div>

        </div>
      ))}

    </div>
  );
}
