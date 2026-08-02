import { DashboardProvider } from "@/context/DashboardContext";

import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function MainLayout({ children }) {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <Navbar />

          <main className="flex-1 p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  );
}