export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function getFileType(type) {
  if (!type) return "Unknown";

  if (type.startsWith("image/")) return "Image";
  if (type === "application/pdf") return "PDF";
  if (type.includes("zip")) return "ZIP";
  if (type.includes("word")) return "Word";
  if (type.includes("excel")) return "Excel";

  return "File";
} 