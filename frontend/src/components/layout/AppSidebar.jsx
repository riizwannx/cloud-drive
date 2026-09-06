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
    <Sidebar collapsible="icon" variant="inset" className="border-0">
      <SidebarHeader className="p-3">
        <Logo />
      </SidebarHeader>

      <SidebarSeparator className="mx-3" />

      <SidebarContent>
        <Navigation />
      </SidebarContent>

      <SidebarSeparator className="mx-3" />

      <SidebarFooter className="p-3">
        <StorageCard />
        <UserProfile />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
