import { Bell, Moon, Search, LogOut, Sun, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || (
      savedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <SidebarTrigger className="rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground" />

        <div className="relative hidden w-72 lg:block xl:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search files..."
            className="h-10 rounded-xl border-transparent bg-secondary/70 pl-10 shadow-none transition focus-visible:border-indigo-400 focus-visible:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 lg:flex dark:border-indigo-400/15 dark:bg-indigo-400/10 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          Keep your work in sync
        </div>
        <Button variant="ghost" size="icon-sm" className="rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Notifications">
          <Bell size={18} />
        </Button>

        <Button variant="ghost" size="icon-sm" className="rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={toggleTheme} aria-label="Toggle color theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
        </Button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
          R
        </div>
      </div>
    </header>
  );
}
