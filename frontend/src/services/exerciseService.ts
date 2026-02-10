import api from "../api/axios"; // Axios instance
import type { ExerciseInstance, Exercise } from "./workoutService";

export type AddSetResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export type setUpdateExercise = {
  action: "weight" | "reps";
  weight?: number;
  reps?: number;
};

export type newExercise = {
  name: string;
  description?: string;
  restTime: number;
};

export const addExerciseInstance = async (
  exerciseId: number,
): Promise<AddSetResponse<ExerciseInstance>> => {
  const response = await api.post(`/api/exercises/${exerciseId}/instances`);
  return response.data;
};

export const removeLatestExerciseInstance = async (
  exerciseId: number,
): Promise<AddSetResponse<null>> => {
  const response = await api.delete(
    `/api/exercises/${exerciseId}/instances/latest`,
  );
  return response.data;
};

//update exercise (weight and reps)
export const updateExercise = async (
  id: number,
  payload: setUpdateExercise,
): Promise<AddSetResponse<Partial<ExerciseInstance>>> => {
  const response = await api.put(`/api/exercise/instances/${id}`, payload);
  return response.data;
};

//update timer of all instances
export const updateExerciseRestTime = async (
  exerciseId: number,
  restTime: number,
): Promise<AddSetResponse> => {
  const response = await api.put(`/api/exercises/${exerciseId}/rest-time`, {
    restTime,
  });
  return response.data;
};

export const addExercise = async (
  workoutSetId: number,
  payload: newExercise,
): Promise<AddSetResponse<Exercise>> => {
  const response = await api.post(
    `/api/workout-sets/${workoutSetId}/exercise`,
    payload,
  );
  return response.data;
};

export const deleteExercise = async (
  exerciseId: number,
): Promise<AddSetResponse> => {
  const response = await api.delete(`/api/exercises/${exerciseId}`);
  return response.data;
};
