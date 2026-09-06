import { ChevronUp, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "@/services/userService";
import { Button } from "@/components/ui/button";

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
    <div className="rounded-2xl p-2 group-data-[collapsible=icon]:p-0">

      {/* ============================== */}
      {/* User Information */}
      {/* ============================== */}

      <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-semibold text-white shadow-sm dark:from-slate-200 dark:to-slate-400 dark:text-slate-900">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">

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

        <ChevronUp className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />

      </div>

      {/* ============================== */}
      {/* Free Plan */}
      {/* ============================== */}

      {!isVIP && (
        <Button
          onClick={handleUpgrade}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-xs shadow-md shadow-indigo-500/20 group-data-[collapsible=icon]:hidden"
        >
          <Crown className="h-4 w-4" />

          Upgrade Plan
        </Button>
      )}

      {/* ============================== */}
      {/* VIP Plan */}
      {/* ============================== */}

      {isVIP && (
        <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 group-data-[collapsible=icon]:hidden dark:bg-amber-950/30 dark:text-amber-400">
          <Crown className="h-4 w-4" />

          VIP Member
        </div>
      )}

    </div>
  );
}
