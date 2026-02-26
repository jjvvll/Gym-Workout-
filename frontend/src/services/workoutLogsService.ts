import api from "../api/axios";
import type { WorkoutSession } from "../hooks/useWorkoutSession";

export type StoreLogResponse = {
  success: boolean;
  message: string;
  data?: object[];
};

export type VolumeLog = {
  performed_on: string;
  total_volume: number;
};

export type VolumeResponse = {
  success: boolean;
  data: VolumeLog[];
  meta: { year: number; month: number };
};

export const storeWorkoutLogs = async (
  session: WorkoutSession,
): Promise<StoreLogResponse> => {
  const response = await api.post(`/api/workout-logs`, {
    workout_set_id: session.workout_set_id,
    exercises: session.exercises,
  });
  return response.data;
};

export type MuscleVolumeData = {
  target_area: string;
  total_volume: number;
};

export type MuscleVolumeResponse = {
  success: boolean;
  data: MuscleVolumeData[];
  meta: { year: number; month: number };
};

export const getVolumeOverTime = async (
  year?: number,
  month?: number,
): Promise<VolumeResponse> => {
  const params = new URLSearchParams();
  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());
  const response = await api.get(`/api/workout-logs/volume?${params}`);
  return response.data;
};

export const getMuscleVolume = async (
  year?: number,
  month?: number,
): Promise<MuscleVolumeResponse> => {
  const params = new URLSearchParams();
  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());
  const response = await api.get(`/api/workout-logs/by-muscle?${params}`);
  return response.data;
};
