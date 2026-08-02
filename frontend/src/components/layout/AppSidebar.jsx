import Logo from "./Logo";
import Navigation from "./Navigation";
import StorageCard from "./StorageCard";
import UserProfile from "./UserProfile";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <Navigation />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <StorageCard />
        <UserProfile />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}