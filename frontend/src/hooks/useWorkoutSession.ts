// hooks/useWorkoutSession.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

export interface InstanceProgress {
  instance_id: number;
  is_completed: boolean;
  weight: number | null;
  reps: number | null;
}

export interface WorkoutSession {
  workout_set_id: number;
  user_id: number;
  exercises: {
    [exerciseId: number]: {
      [instanceId: number]: InstanceProgress;
    };
  };
}

export const useWorkoutSession = (workoutId: number) => {
  // Get the currently logged-in user from AuthContext
  const { user } = useAuth();
  const userId = user?.id ?? 0;

  // Create a unique session key per user per workout
  // This ensures that if two different users use the same device,
  // they won't overwrite each other's progress
  const SESSION_KEY = `workout_session_user_${userId}_workout_${workoutId}`;

  // Initialize session state
  // We use a lazy initializer function so sessionStorage is only
  // read once on mount, not on every re-render
  const [session, setSession] = useState<WorkoutSession>(() => {
    // If workoutId or userId is not yet available (still loading),
    // return an empty session to avoid saving garbage data
    if (!workoutId || !userId) {
      return { workout_set_id: workoutId, user_id: userId, exercises: {} };
    }

    try {
      // Check if there is an existing session saved in sessionStorage
      const stored = sessionStorage.getItem(SESSION_KEY);

      if (stored) {
        const parsed: WorkoutSession = JSON.parse(stored);

        // Only restore the session if it belongs to the same user AND same workout
        // This prevents loading a session from a different workout or user
        if (parsed.workout_set_id === workoutId && parsed.user_id === userId) {
          return parsed;
        }
      }
    } catch {
      // If JSON.parse fails (corrupted data), we silently ignore it
      // and start with a fresh session instead of crashing
    }

    // No valid stored session found, start fresh
    return { workout_set_id: workoutId, user_id: userId, exercises: {} };
  });

  // Whenever the session state changes, automatically sync it to sessionStorage
  // This acts as an auto-save so progress is never lost on page refresh
  // sessionStorage is cleared automatically when the browser tab is closed
  useEffect(() => {
    // Don't save if workoutId or userId is not ready yet
    if (!workoutId || !userId) return;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, SESSION_KEY, workoutId, userId]);

  // Updates the progress of a specific exercise instance (a single set row)
  // exerciseId  - the parent exercise
  // instanceId  - the specific set/row being updated
  // data        - partial update e.g. { is_completed: true } or { weight: 50, reps: 10 }
  const updateInstanceProgress = (
    exerciseId: number,
    instanceId: number,
    data: Partial<InstanceProgress>,
  ) => {
    setSession((prev) => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        // Spread the existing exercise data and update only the target instance
        [exerciseId]: {
          ...prev.exercises[exerciseId],
          // Merge existing instance data with the new partial update
          [instanceId]: {
            ...prev.exercises[exerciseId]?.[instanceId],
            instance_id: instanceId,
            ...data, // new data overwrites old fields
          },
        },
      },
    }));
  };

  // Clears the session from sessionStorage and resets state to empty
  // Call this after successfully saving the workout to the database
  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession({ workout_set_id: workoutId, user_id: userId, exercises: {} });
  };

  // Returns the saved progress for a specific instance, or null if not yet tracked
  // Used by WorkoutProgressRow to pre-fill inputs with saved values
  const getInstanceProgress = (
    exerciseId: number,
    instanceId: number,
  ): InstanceProgress | null => {
    return session.exercises[exerciseId]?.[instanceId] ?? null;
  };

  return { session, updateInstanceProgress, clearSession, getInstanceProgress };
};
