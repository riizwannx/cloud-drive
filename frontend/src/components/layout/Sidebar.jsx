import {
  LayoutDashboard,
  FolderOpen,
  Folder,
  Star,
  Share2,
  Trash2,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Files", icon: FolderOpen },
  { name: "Folders", icon: Folder },
  { name: "Favorites", icon: Star },
  { name: "Shared", icon: Share2 },
  { name: "Trash", icon: Trash2 },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="h-20 flex items-center px-6">
        <h1 className="text-2xl font-bold text-blue-500">
          CloudDrive
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}