import { Bell, Search, Moon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search files..."
          className="w-full rounded-xl bg-slate-900 py-3 pl-12 pr-4 text-white outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <Moon className="cursor-pointer" />

        <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          R
        </div>
      </div>
    </header>
  );
}