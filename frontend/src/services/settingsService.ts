// services/settingsService.ts
import api from "../api/axios";

export type Settings = {
  weight_unit?: "kg" | "lbs";
  notification_sound?: string; // file URL
  motivation_photo?: string; // file URL
  [key: string]: string | undefined;
};

export type SettingsResponse = {
  success: boolean;
  message?: string;
  data: Settings;
};

export const getAllSettings = async (): Promise<SettingsResponse> => {
  const response = await api.get("/api/settings");
  return response.data;
};

export const getSetting = async (key: string): Promise<SettingsResponse> => {
  const response = await api.get(`/api/settings/${key}`);
  return response.data;
};

export const upsertSetting = async (
  key: string,
  value: string,
): Promise<SettingsResponse> => {
  const response = await api.post("/api/settings", { key, value });
  return response.data;
};

export const uploadNotificationSound = async (
  file: File,
): Promise<SettingsResponse> => {
  const formData = new FormData();
  formData.append("sound", file);

  const response = await api.post("/api/settings/upload-sound", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getSoundUrl = (relativePath: string): string => {
  const base =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "http://192.168.1.8:8000";
  return `${base}/${relativePath}`;
};

export const uploadMotivationPhoto = async (
  file: File,
): Promise<SettingsResponse> => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.post("/api/settings/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getPhotoUrl = (relativePath: string): string => {
  const base =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "http://192.168.1.8:8000";
  return `${base}/${relativePath}`;
};
