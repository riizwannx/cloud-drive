import { Card, CardContent } from "@/components/ui/card";
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

export default function StorageOverview() {
  const { dashboard, loading } = useDashboardContext();

  if (loading || !dashboard) {
    return null;
  }

  return (
    <Card className="surface-card rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-3 text-white shadow-lg shadow-indigo-500/20">
            <HardDrive size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">
              Storage Overview
            </h2>

            <p className="text-sm text-muted-foreground">
              Monitor your storage usage
            </p>
          </div>
        </div>

        <div className="mb-3 flex justify-between gap-4 text-sm">
          <span className="font-medium">
            {formatStorage(dashboard.storageUsed)} Used
          </span>

          <span className="text-muted-foreground">
            {formatStorage(dashboard.storageLimit)} Total
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-200/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-500"
            style={{
              width: `${dashboard.usagePercentage}%`,
            }}
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {dashboard.usagePercentage}% of your available storage is currently in use.
        </p>
      </CardContent>
    </Card>
  );
}
