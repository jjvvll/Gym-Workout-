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
