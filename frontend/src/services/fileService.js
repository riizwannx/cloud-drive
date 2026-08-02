import api from "@/api/api";

export const getFiles = async () => {
  const response = await api.get("/files");
  return response.data;
};