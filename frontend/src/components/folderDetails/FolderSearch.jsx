import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function FolderSearch({
  search,
  setSearch,
}) {
  return (
    <div className="surface-card relative w-full rounded-2xl p-3">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search files..."
        className="h-10 rounded-xl border-transparent bg-secondary/70 pl-10 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
      />

    </div>
  );
}
