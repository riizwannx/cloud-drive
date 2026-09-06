import { useState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/userService";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      alert("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card rounded-2xl p-6">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Lock size={21} />
          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Change Password
            </h2>

            <p className="text-sm text-muted-foreground">
              Update your CloudDrive account password.
            </p>

          </div>

        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-5"
      >

        {/* Current Password */}
        <div className="space-y-2">

          <label
            htmlFor="currentPassword"
            className="text-sm font-medium"
          >
            Current Password
          </label>

          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            placeholder="Enter your current password"
            className="h-11 rounded-xl border-transparent bg-secondary/70 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
          />

        </div>

        {/* New Password */}
        <div className="space-y-2">

          <label
            htmlFor="newPassword"
            className="text-sm font-medium"
          >
            New Password
          </label>

          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            placeholder="Enter your new password"
            className="h-11 rounded-xl border-transparent bg-secondary/70 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
          />

        </div>

        {/* Confirm Password */}
        <div className="space-y-2">

          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium"
          >
            Confirm New Password
          </label>

          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirm your new password"
            className="h-11 rounded-xl border-transparent bg-secondary/70 shadow-none focus-visible:border-indigo-400 focus-visible:bg-background"
          />

        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 shadow-md shadow-indigo-500/20"
        >
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </Button>

      </form>

    </div>
  );
}
