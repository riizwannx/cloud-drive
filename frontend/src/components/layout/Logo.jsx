import { Cloud } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
        <Cloud className="h-6 w-6" />
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight">
          CloudDrive
        </h2>

        <p className="text-sm text-muted-foreground">
          Personal Storage
        </p>
      </div>
    </div>
  );
}