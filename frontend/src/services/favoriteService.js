import api from "@/api/api";

export const toggleFavorite = async (id) => {
  const response = await api.patch(
    `/files/favorite/${id}`
  );

  return response.data;
};

export const getFavoriteFiles = async () => {
  const response = await api.get(
    "/files/favorites"
  );

  return response.data;
};