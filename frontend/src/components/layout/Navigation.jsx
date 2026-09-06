import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  FolderOpen,
  Folder,
  Star,
  Share2,
  Trash2,
  Settings,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Files", url: "/files", icon: FolderOpen },
  { title: "Folders", url: "/folders", icon: Folder },
  { title: "Favorites", url: "/favorites", icon: Star },
  { title: "Shared", url: "/shared", icon: Share2 },
  { title: "Trash", url: "/trash", icon: Trash2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <SidebarGroup className="px-3 py-4">
      <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
        Workspace
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location.pathname === item.url || (item.url === "/folders" && location.pathname.startsWith("/folders/"))}
                tooltip={item.title}
                size="lg"
                className="rounded-xl px-3 text-[13px] font-medium data-active:bg-indigo-500/10 data-active:text-indigo-700 data-active:shadow-[inset_3px_0_0_rgb(79,70,229)] dark:data-active:text-indigo-300"
                render={
                  <NavLink to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </NavLink>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
