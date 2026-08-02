import { ChevronUp, Crown } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="mx-3 mb-3 rounded-2xl border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          R
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="truncate font-semibold">
            Mohammed Rizwan
          </h3>

          <p className="text-sm text-muted-foreground">
            Free Plan
          </p>
        </div>

        <ChevronUp className="h-5 w-5 text-muted-foreground" />
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <Crown className="h-4 w-4" />
        Upgrade Plan
      </button>
    </div>
  );
}