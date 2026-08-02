import { useCallback, useEffect, useState } from "react";
import { getFiles } from "@/services/fileService";

export default function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshFiles = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getFiles();

      setFiles(response.files || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load files."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return {
    files,
    loading,
    error,
    refreshFiles,
  };
}