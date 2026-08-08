import api from "@/api/api";

// ==============================
// Get Current User Profile
// ==============================
export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

// ==============================
// Change Password
// ==============================
export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const response = await api.patch(
    "/users/change-password",
    {
      currentPassword,
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};