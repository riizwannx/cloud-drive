import api from "@/api/api";

export const getFolders = async () => {
  const response = await api.get("/folders");
  return response.data;
};

export const createFolder = async (name, parentFolder = null) => {
  const response = await api.post("/folders", {
    name,
    parentFolder,
  });

  return response.data;
};

export const renameFolder = async (id, name) => {
  const response = await api.patch(`/folders/${id}`, {
    name,
  });

  return response.data;
};

export const deleteFolder = async (id) => {
  const response = await api.delete(`/folders/${id}`);
  return response.data;
};