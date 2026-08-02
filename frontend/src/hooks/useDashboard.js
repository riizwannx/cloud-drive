import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboardService";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data.dashboard);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
  };
}