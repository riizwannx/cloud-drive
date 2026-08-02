import api from "@/api/api";

export const downloadFile = async (id) => {
  const response = await api.get(`/files/download/${id}`, {
    responseType: "blob",
  });

  return response;
};