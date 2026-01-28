import { useEffect, useState } from "react";
import { getWorkoutSets } from "../services/workoutService";
import type { WorkoutSet } from "../services/workoutService";
import WorkoutSetCard from "../components/WorkoutSetCard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getWorkoutSets()
      .then((data) => setWorkouts(data))
      .catch(() => setError("Failed to fetch workouts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-700">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gym Workouts</h1>
      <div className="space-y-4">
        {workouts.map((set) => (
          <div key={set.id} className="bg-white p-4 rounded-lg shadow-md">
            <WorkoutSetCard
              workoutSet={set}
              onClick={() =>
                navigate(`/workouts/${set.id}`, {
                  state: { workout: set },
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
