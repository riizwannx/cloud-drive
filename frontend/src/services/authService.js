import api from "@/api/api";

export const loginUser = async (email, password) => {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (
  username,
  email,
  password,
  phone = "",
  bio = ""
) => {
  const response = await api.post("/users/register", {
    username,
    email,
    password,
    phone,
    bio,
  });

  return response.data;
};