import api from "@/api/api";

export const deleteFile = async (id) => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};