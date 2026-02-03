import api from "../api/axios"; // Axios instance

// TypeScript types (optional)
export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  restTime: number;
}

export interface WorkoutSet {
  id: number;
  name: string;
  description: string | null;
  exercises: Exercise[];
}

export type StoreWorkoutSetPayload = {
  name: string;
  description?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type DeleteResponse = {
  success: boolean;
  message: string;
};

// Fetch all workout sets with exercises
export const getWorkoutSets = async (): Promise<WorkoutSet[]> => {
  const response = await api.get("/workout-sets");
  return response.data.data;
};

// Fetch a single workout set by ID
export const getWorkoutSetById = async (id: number): Promise<WorkoutSet> => {
  const response = await api.get(`/workout-sets/${id}`);
  return response.data;
};

// Store workoute set
export const storeWorkoutSet = async (
  payload: StoreWorkoutSetPayload,
): Promise<ApiResponse<WorkoutSet>> => {
  const response = await api.post("/workout-sets", payload);
  return response.data;
};

//update workout set
export const updateWorkoutSet = async (
  id: number,
  payload: StoreWorkoutSetPayload,
): Promise<ApiResponse<WorkoutSet>> => {
  const response = await api.put(`/workout-sets/${id}`, payload);
  return response.data;
};

export const deleteWorkoutSet = async (id: number): Promise<DeleteResponse> => {
  const response = await api.delete(`/workout-sets/${id}`);
  return response.data;
};
