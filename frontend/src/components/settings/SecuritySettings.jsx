import { useState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="rounded-2xl border bg-card p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
            <Lock size={22} />
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

          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            placeholder="Enter your current password"
            className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
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

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            placeholder="Enter your new password"
            className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
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

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirm your new password"
            className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />

        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </Button>

      </form>

    </div>
  );
}