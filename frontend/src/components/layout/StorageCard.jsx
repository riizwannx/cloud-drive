import { HardDrive } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";

function formatStorage(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function StorageCard() {
  const { dashboard, loading } = useDashboardContext();

  if (loading || !dashboard) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card p-4">

      <div className="mb-3 flex items-center gap-2">
        <HardDrive size={18} />

        <span className="font-semibold">
          Storage
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${Math.min(
              dashboard.usagePercentage,
              100
            )}%`,
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-sm text-muted-foreground">
        <span>
          {formatStorage(dashboard.storageUsed)}
        </span>

        <span>
          {formatStorage(dashboard.storageLimit)}
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {dashboard.usagePercentage}% of your storage is used.
      </p>

    </div>
  );
}