import { useEffect, useState } from "react";
import { Download, FileText, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SharedFile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const token = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop();

  useEffect(() => {
    const loadSharedFile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5001/api/files/shared/${token}`
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.message ||
              "Shared file could not be accessed."
          );
        }

        const blob = await response.blob();

        const objectUrl =
          window.URL.createObjectURL(blob);

        setFile({
          name:
            response.headers.get(
              "content-disposition"
            ) || "Shared File",
          url: objectUrl,
        });
      } catch (error) {
        console.error(
          "Shared file error:",
          error
        );

        setError(
          error.message ||
            "Unable to access shared file."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadSharedFile();
    } else {
      setError("Invalid share link.");
      setLoading(false);
    }

    return () => {
      if (file?.url) {
        window.URL.revokeObjectURL(file.url);
      }
    };
  }, [token]);

  const handleDownload = () => {
    if (!file?.url) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = file.url;
    link.download = "shared-file";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10">
            <FileText
              size={26}
              className="text-primary"
            />
          </div>

          <p className="text-muted-foreground">
            Loading shared file...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">

        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">

          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
            <AlertCircle
              size={28}
              className="text-red-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            File Unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">

      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">

        <div className="mx-auto flex size-16 items-center justify-center rounded-xl bg-primary/10">
          <FileText
            size={30}
            className="text-primary"
          />
        </div>

        <h1 className="mt-5 text-2xl font-bold">
          Shared File
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Someone shared a file with you.
        </p>

        <Button
          className="mt-6"
          onClick={handleDownload}
        >
          <Download
            size={18}
            className="mr-2"
          />
          Download File
        </Button>

      </div>

    </div>
  );
}
