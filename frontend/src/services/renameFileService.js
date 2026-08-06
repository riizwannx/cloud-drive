import api from "@/api/api";

export const renameFile = async (
  id,
  originalName
) => {
  const response = await api.put(
    `/files/${id}`,
    {
      originalName,
    }
  );

  return response.data;
};