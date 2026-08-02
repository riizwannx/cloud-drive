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
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3 text-white">
            <HardDrive size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Storage Overview
            </h2>

            <p className="text-sm text-muted-foreground">
              Monitor your storage usage
            </p>
          </div>
        </div>

        <div className="mb-3 flex justify-between">
          <span className="font-medium">
            {formatStorage(dashboard.storageUsed)} Used
          </span>

          <span className="text-muted-foreground">
            {formatStorage(dashboard.storageLimit)} Total
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
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