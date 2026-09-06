import { FolderOpen } from "lucide-react";

export default function FolderEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200/80 bg-card p-14 text-center dark:border-indigo-400/25">

      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"><FolderOpen size={34} /></div>

      <h2 className="mt-5 text-2xl font-bold">
        Folder is Empty
      </h2>

      <p className="mt-2 text-muted-foreground">
        Upload files into this folder to get started.
      </p>

    </div>
  );
}
