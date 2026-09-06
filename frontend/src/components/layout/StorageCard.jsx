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
    <div className="group-data-[collapsible=icon]:hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50 to-white p-4 dark:border-indigo-400/15 dark:from-indigo-500/10 dark:to-sidebar">

      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-600 dark:text-indigo-300">
          <HardDrive size={15} />
        </div>

        <span className="text-sm font-semibold">
          Storage
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-200/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
          style={{
            width: `${Math.min(
              dashboard.usagePercentage,
              100
            )}%`,
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
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
