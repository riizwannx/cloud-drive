import api from "@/api/api";

export const uploadFile = async (
  file,
  folderId = null
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId) {
    formData.append("folder", folderId);
  }

  const response = await api.post(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};