import { useEffect, useState } from "react";
import { getWorkoutSets, deleteWorkoutSet } from "../services/workoutService";
import type { WorkoutSet } from "../services/workoutService";
import WorkoutSetCard from "../components/WorkoutSetCard";
import { useNavigate } from "react-router-dom";
import { WorkoutSetModal } from "../components/WorkoutSetModal ";
import toast from "react-hot-toast";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<WorkoutSet[]>([]);
  const [workoutToEdit, setWorkoutToEdit] = useState<WorkoutSet | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const handleUpdatedWorkout = (updatedWorkout: WorkoutSet) => {
    setWorkouts((prev) => {
      const exists = prev.some((ws) => ws.id === updatedWorkout.id);

      if (exists) {
        // replace the existing workout
        return prev.map((ws) =>
          ws.id === updatedWorkout.id ? updatedWorkout : ws,
        );
      } else {
        // append as new workout
        return [...prev, updatedWorkout];
      }
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteWorkoutSet(id);
      if (res.success) {
        // remove from local state
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete workout set");
    }
  };

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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gym Workouts</h1>
        <div className="p-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Workout Set
          </button>
        </div>

        <div className="space-y-4">
          {workouts.map((set) => (
            <div
              key={set.id}
              className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              {/* Edit and Delete buttons container */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setWorkoutToEdit(set);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    handleDelete(set.id);
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>

              {/* Workout card clickable */}
              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/workouts/${set.id}`, {
                    state: { workout: set },
                  })
                }
              >
                <WorkoutSetCard workoutSet={set} />
              </div>
            </div>
          ))}
        </div>

        <WorkoutSetModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={handleUpdatedWorkout} // can handle create or edit
          workoutToEdit={workoutToEdit}
          setWorkoutToEdit={setWorkoutToEdit}
        />
      </div>
    </div>
  );
}
