import { useCallback, useEffect, useState } from "react";
import { getFolders } from "@/services/folderService";

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshFolders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getFolders();

      setFolders(response.folders || []);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load folders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFolders();
  }, [refreshFolders]);

  return {
    folders,
    loading,
    error,
    refreshFolders,
  };
}