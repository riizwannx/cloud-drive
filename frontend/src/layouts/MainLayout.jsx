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

        <SidebarInset className="min-h-svh bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_30%),var(--background)]">
          <Navbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  );
}
