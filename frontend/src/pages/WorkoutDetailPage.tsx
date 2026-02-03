import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { WorkoutSet } from "../services/workoutService";
import { getWorkoutSetById } from "../services/workoutService";
import WorkoutProgressRow from "../components/WorkoutProgressRow";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [workout, setWorkout] = useState<WorkoutSet | null>(
    location.state?.workout ?? null,
  );

  useEffect(() => {
    if (workout) return; // already have data

    getWorkoutSetById(Number(id)).then(setWorkout);
  }, [id, workout]);

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{workout.name}</h1>
        <ul className="space-y-6">
          {workout.exercises.map((ex) => (
            <div key={ex.id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-medium text-lg mb-3">{ex.name}</h4>
              <div className="flex flex-col gap-2">
                {Array.from({ length: ex.sets ?? 1 }).map((_, idx) => (
                  <WorkoutProgressRow key={`${ex.id}-${idx}`} exercise={ex} />
                ))}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
