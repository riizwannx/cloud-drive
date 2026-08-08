import { HardDrive, Crown } from "lucide-react";

import { useDashboardContext } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";

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

export default function StorageSettings() {
  const { dashboard, loading } = useDashboardContext();

  if (loading || !dashboard) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-muted-foreground">
          Loading storage information...
        </p>
      </div>
    );
  }

  const usagePercentage = Math.min(
    dashboard.usagePercentage || 0,
    100
  );

  return (
    <div className="space-y-6">

      {/* Storage Overview */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <HardDrive size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Storage Usage
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage your CloudDrive storage.
            </p>
          </div>

        </div>

        {/* Progress */}
        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">
              {formatStorage(dashboard.storageUsed)}
            </span>

            <span className="text-muted-foreground">
              {formatStorage(dashboard.storageLimit)}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">

            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${usagePercentage}%`,
              }}
            />

          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {usagePercentage}% of your storage is currently used.
          </p>

        </div>

      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <Crown size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Current Plan
              </h2>

              <p className="text-sm text-muted-foreground">
                Free Plan
              </p>
            </div>

          </div>

          <Button
            variant="outline"
            onClick={() =>
              alert("Upgrade plans will be available soon.")
            }
          >
            Upgrade
          </Button>

        </div>

        <div className="mt-5 rounded-xl bg-muted/50 p-4">

          <div className="flex justify-between text-sm">

            <span className="text-muted-foreground">
              Storage limit
            </span>

            <span className="font-medium">
              {formatStorage(dashboard.storageLimit)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}