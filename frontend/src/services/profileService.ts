import api from "../api/axios";

export type ProfileResponse = {
  success: boolean;
  message: string;
  data?: { email?: string };
};

export const updateEmail = async (
  email: string,
  password: string,
): Promise<ProfileResponse> => {
  const response = await api.put("/api/profile/email", { email, password });
  return response.data;
};

export const updatePassword = async (
  current_password: string,
  new_password: string,
  new_password_confirmation: string,
): Promise<ProfileResponse> => {
  const response = await api.put("/api/profile/password", {
    current_password,
    new_password,
    new_password_confirmation,
  });
  return response.data;
};
