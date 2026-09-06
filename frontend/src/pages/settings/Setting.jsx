import { useState } from "react";

import {
  User,
  Lock,
  Palette,
  HardDrive,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

import AccountSettings from "@/components/settings/AccountSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import StorageSettings from "@/components/settings/StorageSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";

export default function Settings() {
  const [activeSection, setActiveSection] = useState(null);

  const settingsSections = [
    {
      id: "account",
      title: "Account",
      description:
        "Manage your personal account information.",
      icon: User,
    },
    {
      id: "security",
      title: "Security",
      description:
        "Manage your password and account security.",
      icon: Lock,
    },
    {
      id: "appearance",
      title: "Appearance",
      description:
        "Customize how CloudDrive looks.",
      icon: Palette,
    },
    {
      id: "storage",
      title: "Storage",
      description:
        "View your storage usage and current plan.",
      icon: HardDrive,
    },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  return (
    <MainLayout>
      <div className="page-shell">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div>
          <p className="mb-3 text-sm font-medium text-indigo-600 dark:text-indigo-300">Personal workspace</p>
          <h1 className="page-heading">
            Settings
          </h1>

          <p className="page-description">
            Manage your CloudDrive account and preferences.
          </p>
        </div>

        {/* ============================== */}
        {/* Account Settings */}
        {/* ============================== */}

        {activeSection === "account" && (
          <div className="space-y-6">

            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft
                className="mr-2"
                size={18}
              />

              Back to Settings
            </Button>

            <AccountSettings />

          </div>
        )}

        {/* ============================== */}
        {/* Security Settings */}
        {/* ============================== */}

        {activeSection === "security" && (
          <div className="space-y-6">

            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft
                className="mr-2"
                size={18}
              />

              Back to Settings
            </Button>

            <SecuritySettings />

          </div>
        )}

        {/* ============================== */}
        {/* Appearance Settings */}
        {/* ============================== */}

        {activeSection === "appearance" && (
          <div className="space-y-6">

            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft
                className="mr-2"
                size={18}
              />

              Back to Settings
            </Button>

            <AppearanceSettings />

          </div>
        )}

        {/* ============================== */}
        {/* Storage Settings */}
        {/* ============================== */}

        {activeSection === "storage" && (
          <div className="space-y-6">

            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft
                className="mr-2"
                size={18}
              />

              Back to Settings
            </Button>

            <StorageSettings />

          </div>
        )}

        {/* ============================== */}
        {/* Main Settings List */}
        {/* ============================== */}

        {activeSection === null && (
          <>
            <div className="grid gap-3 lg:grid-cols-2">

              {settingsSections.map((section) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.id}
                    className="surface-card flex items-center justify-between rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >

                    {/* Section Information */}

                    <div className="flex items-center gap-4">

                      <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10">
                        <Icon
                          size={24}
                          className="text-indigo-600 dark:text-indigo-300"
                        />
                      </div>

                      <div>

                        <h2 className="text-lg font-semibold">
                          {section.title}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {section.description}
                        </p>

                      </div>

                    </div>

                    {/* Open Section */}

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
                      title={section.title}
                      onClick={() =>
                        setActiveSection(section.id)
                      }
                    >
                      <ChevronRight size={20} />
                    </Button>

                  </div>
                );
              })}

            </div>

            {/* ============================== */}
            {/* Logout */}
            {/* ============================== */}

            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 lg:col-span-2">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10">

                    <LogOut
                      size={24}
                      className="text-destructive"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      Logout
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign out of your CloudDrive account.
                    </p>

                  </div>

                </div>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="rounded-xl"
                >
                  Logout
                </Button>

              </div>

            </div>
          </>
        )}

      </div>
    </MainLayout>
  );
}
