import api from "../api/axios"; // Axios instance

export interface ExerciseInstance {
  id: number;
  exercise_id: number;
  weight: number | null;
  weight_unit: string;
  reps: number | null;
  sets: number | null;
}

// TypeScript types (optional)
export interface Exercise {
  id: number;
  name: string;
  target_area: string;
  description: string | null;
  is_bodyweight_exercise: boolean;
  restTime: number;
  memo: string | null;
  instances: ExerciseInstance[];
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

export type AnalysisResponse = {
  success: boolean;
  message: string;
};

export interface GenerateWorkoutPayload {
  experience: "beginner" | "intermediate" | "pro";
  goal: "fitness" | "build muscle" | "build strength";
  weight: number;
  height: number;
  maxEffort: boolean;
}

// Fetch all workout sets with exercises
export const getWorkoutSets = async (): Promise<WorkoutSet[]> => {
  const response = await api.get("/api/workout-sets");
  return response.data.data;
};

// Fetch a single workout set by ID
export const getWorkoutSetById = async (id: number): Promise<WorkoutSet> => {
  const response = await api.get(`/api/workout-sets/${id}`);
  return response.data;
};

// Store workoute set
export const storeWorkoutSet = async (
  payload: StoreWorkoutSetPayload,
): Promise<ApiResponse<WorkoutSet>> => {
  const response = await api.post("/api/workout-sets", payload);
  return response.data;
};

//update workout set
export const updateWorkoutSet = async (
  id: number,
  payload: StoreWorkoutSetPayload,
): Promise<ApiResponse<WorkoutSet>> => {
  const response = await api.put(`/api/workout-sets/${id}`, payload);
  return response.data;
};

export const deleteWorkoutSet = async (id: number): Promise<DeleteResponse> => {
  const response = await api.delete(`/api/workout-sets/${id}`);
  return response.data;
};

export const generateWorkout = async (
  payload: any,
): Promise<ApiResponse<WorkoutSet>> => {
  const response = await api.post("/api/generate-workout", payload);

  return response.data;
};

export const generateAnalysis = async (
  year?: number,
  month?: number,
): Promise<AnalysisResponse> => {
  const response = await api.post("/api/workout-logs/analysis", {
    year,
    month,
  });
  return response.data;
};
