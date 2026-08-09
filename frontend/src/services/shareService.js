import api from "./api";

// ==============================
// Share File
// ==============================
export const shareFile = async (fileId) => {
  const response = await api.patch(
    `/files/share/${fileId}`
  );

  return response.data;
};

// ==============================
// Get My Shared Files
// ==============================
export const getSharedFiles = async () => {
  const response = await api.get(
    "/files/shared"
  );

  return response.data;
};

// ==============================
// Remove Share
// ==============================
export const removeShare = async (fileId) => {
  const response = await api.patch(
    `/files/share/remove/${fileId}`
  );

  return response.data;
};