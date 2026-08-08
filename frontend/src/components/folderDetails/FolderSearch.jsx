import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function FolderSearch({
  search,
  setSearch,
}) {
  return (
    <div className="relative w-full">

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
        className="pl-10"
      />

    </div>
  );
}