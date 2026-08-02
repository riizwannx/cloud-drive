import { NavLink } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
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
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
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