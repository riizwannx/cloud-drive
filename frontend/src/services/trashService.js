import api from "@/api/api";

export const getTrashFiles = async () => {
  const response = await api.get("/files/trash");
  return response.data;
};

export const restoreFile = async (id) => {
  const response = await api.patch(`/files/restore/${id}`);
  return response.data;
};

export const permanentlyDeleteFile = async (id) => {
  const response = await api.delete(`/files/permanent/${id}`);
  return response.data;
};