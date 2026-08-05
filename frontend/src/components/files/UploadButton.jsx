import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/uploadService";

export default function UploadButton({
  onSuccess,
  folderId = null,
}) {
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      await uploadFile(file, folderId);

      alert("File uploaded successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Upload failed."
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleFileChange}
      />

      <Button
        onClick={handleClick}
        disabled={loading}
      >
        <Upload className="mr-2 h-4 w-4" />

        {loading
          ? "Uploading..."
          : "Upload File"}
      </Button>
    </>
  );
}