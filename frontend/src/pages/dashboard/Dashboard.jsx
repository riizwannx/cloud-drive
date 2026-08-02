import MainLayout from "@/layouts/MainLayout";

import StatCard from "@/components/dashboard/StatCard";
import StorageOverview from "@/components/dashboard/StorageOverview";
import RecentFiles from "@/components/dashboard/RecentFiles";
import QuickActions from "@/components/dashboard/QuickActions";

import useDashboard from "@/hooks/useDashboard";

import {
  HardDrive,
  FolderOpen,
  Folder,
  Share2,
} from "lucide-react";

function formatStorage(bytes) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function Dashboard() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-semibold">
            Loading Dashboard...
          </h2>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl text-red-500">
            {error}
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-muted-foreground">
            Here's your CloudDrive overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Storage"
            value={formatStorage(dashboard.storageUsed)}
            subtitle={`Limit ${formatStorage(
              dashboard.storageLimit
            )}`}
            icon={HardDrive}
            color="bg-blue-600"
          />

          <StatCard
            title="Files"
            value={dashboard.totalFiles}
            subtitle="Stored Files"
            icon={FolderOpen}
            color="bg-emerald-600"
          />

          <StatCard
            title="Folders"
            value={dashboard.totalFolders}
            subtitle="Folders"
            icon={Folder}
            color="bg-amber-500"
          />

          <StatCard
            title="Shared"
            value={dashboard.totalShared}
            subtitle="Shared Links"
            icon={Share2}
            color="bg-purple-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentFiles
              files={dashboard.recentFiles}
            />
          </div>

          <QuickActions />
        </div>

        <StorageOverview />
      </div>
    </MainLayout>
  );
}