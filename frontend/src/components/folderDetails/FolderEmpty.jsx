import { FolderOpen } from "lucide-react";

export default function FolderEmpty() {
  return (
    <div className="rounded-2xl border border-dashed p-14 text-center">

      <FolderOpen
        size={70}
        className="mx-auto text-muted-foreground"
      />

      <h2 className="mt-5 text-2xl font-bold">
        Folder is Empty
      </h2>

      <p className="mt-2 text-muted-foreground">
        Upload files into this folder to get started.
      </p>

    </div>
  );
}