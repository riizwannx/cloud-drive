import api from "@/api/api";

// ==============================
// Get Folders
// ==============================
export const getFolders = async (
  parentFolder = null
) => {
  const response = await api.get("/folders", {
    params: {
      parentFolder:
        parentFolder || undefined,
    },
  });

  return response.data;
};

// ==============================
// Create Folder
// ==============================
export const createFolder = async (
  name,
  parentFolder = null
) => {
  const response = await api.post(
    "/folders",
    {
      name,
      parentFolder,
    }
  );

  return response.data;
};

// ==============================
// Rename Folder
// ==============================
export const renameFolder = async (
  id,
  name
) => {
  const response = await api.patch(
    `/folders/${id}`,
    {
      name,
    }
  );

  return response.data;
};

// ==============================
// Delete Folder
// ==============================
export const deleteFolder = async (id) => {
  const response = await api.delete(
    `/folders/${id}`
  );

  return response.data;
};