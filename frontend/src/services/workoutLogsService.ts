import api from "../api/axios";
import type { WorkoutSession } from "../hooks/useWorkoutSession";

export type StoreLogResponse = {
  success: boolean;
  message: string;
  data?: object[];
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
