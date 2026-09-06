import { Cloud } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25">
        <Cloud className="h-6 w-6" />
      </div>

      <div className="group-data-[collapsible=icon]:hidden">
        <h2 className="text-base font-bold tracking-[-0.03em]">
          CloudDrive
        </h2>

        <p className="text-xs text-muted-foreground">
          Your files, everywhere
        </p>
      </div>
    </div>
  );
}
