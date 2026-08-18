import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getFolders } from "@/services/folderService";

export default function useFolders(
  parentFolder = null
) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshFolders = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFolders(
          parentFolder
        );

        setFolders(
          response.folders || []
        );
      } catch (error) {
        console.error(
          "Failed to load folders:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load folders."
        );
      } finally {
        setLoading(false);
      }
    },
    [parentFolder]
  );

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