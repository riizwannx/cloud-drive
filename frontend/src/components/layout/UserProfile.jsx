import { ChevronUp, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "@/services/userService";

export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        if (response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const username =
    user?.username || "CloudDrive User";

  const isVIP = user?.isVIP === true;

  const handleUpgrade = () => {
    navigate("/upgrade");
  };

  return (
    <div className="border-t p-4">

      {/* ============================== */}
      {/* User Information */}
      {/* ============================== */}

      <div className="flex items-center gap-3">

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 overflow-hidden">

          <h3 className="truncate font-semibold">
            {loading
              ? "Loading..."
              : username}
          </h3>

          <p className="text-sm text-muted-foreground">
            {isVIP
              ? "VIP Plan"
              : "Free Plan"}
          </p>

        </div>

        <ChevronUp
          className="h-5 w-5 text-muted-foreground"
        />

      </div>

      {/* ============================== */}
      {/* Free Plan */}
      {/* ============================== */}

      {!isVIP && (
        <button
          type="button"
          onClick={handleUpgrade}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Crown className="h-4 w-4" />

          Upgrade Plan
        </button>
      )}

      {/* ============================== */}
      {/* VIP Plan */}
      {/* ============================== */}

      {isVIP && (
        <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          <Crown className="h-4 w-4" />

          VIP Member
        </div>
      )}

    </div>
  );
}