// services/settingsService.ts
import api from "../api/axios";

export type Settings = {
  weight_unit?: "kg" | "lbs";
  [key: string]: string | undefined;
};

export type SettingsResponse = {
  success: boolean;
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
