import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    localStorage.setItem("theme", selectedTheme);
    setTheme(selectedTheme);
  };

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") || "system";
      setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const themes = [
    {
      id: "light",
      title: "Light",
      description: "Use the light appearance.",
      icon: Sun,
    },
    {
      id: "dark",
      title: "Dark",
      description: "Use the dark appearance.",
      icon: Moon,
    },
    {
      id: "system",
      title: "System",
      description:
        "Automatically follow your device preference.",
      icon: Monitor,
    },
  ];

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Appearance
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose how CloudDrive looks on your device.
        </p>
      </div>

      <div className="space-y-3">

        {themes.map((item) => {
          const Icon = item.icon;
          const selected = theme === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => applyTheme(item.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >

              <div className="flex items-center gap-4">

                <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
                  <Icon size={21} />
                </div>

                <div>
                  <p className="font-medium">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

              </div>

              {selected && (
                <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check size={16} />
                </div>
              )}

            </button>
          );
        })}

      </div>

    </div>
  );
}