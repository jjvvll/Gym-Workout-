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
    <div className="p-6">
      <h1 className="text-2xl font-bold">{workout.name}</h1>

      <ul>
        {workout.exercises.map((ex) => (
          <div key={ex.id} className="mb-2">
            <h4 className="font-medium">{ex.name}</h4>
            <div className="flex flex-col gap-2">
              {Array.from({ length: ex.sets ?? 1 }).map((_, idx) => (
                <WorkoutProgressRow key={`${ex.id}-${idx}`} exercise={ex} />
              ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
