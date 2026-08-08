import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";

import { getProfile } from "@/services/userService";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      setUser(response.user);
    } catch (error) {
      console.error("Failed to load profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load account information."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-muted-foreground">
          Loading account information...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-red-500">
          Unable to load account information.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          View your CloudDrive account information.
        </p>
      </div>

      <div className="space-y-4">

        {/* Username */}
        <div className="flex items-center gap-4 rounded-xl border p-4">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <User size={20} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Username
            </p>

            <p className="font-medium">
              {user.username || "Not provided"}
            </p>
          </div>

        </div>

        {/* Email */}
        <div className="flex items-center gap-4 rounded-xl border p-4">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Mail size={20} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="font-medium break-all">
              {user.email || "Not provided"}
            </p>
          </div>

        </div>

        {/* Phone */}
        <div className="flex items-center gap-4 rounded-xl border p-4">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Phone size={20} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Phone
            </p>

            <p className="font-medium">
              {user.phone || "Not provided"}
            </p>
          </div>

        </div>

        {/* Account Created */}
        <div className="flex items-center gap-4 rounded-xl border p-4">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Calendar size={20} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Account Created
            </p>

            <p className="font-medium">
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}