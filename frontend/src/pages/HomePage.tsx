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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Gym Workouts
          </h1>
        </div>

        {/* Add button */}
        <div className="mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 sm:py-2.5 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors text-base sm:text-sm font-medium shadow-sm"
          >
            + Add Workout Set
          </button>
        </div>

        {/* Workout cards - Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {workouts.map((set) => (
            <div
              key={set.id}
              className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group"
            >
              {/* Edit and Delete buttons */}
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setWorkoutToEdit(set);
                  }}
                  className="px-3 py-1.5 bg-blue-500 text-white text-xs sm:text-sm rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    handleDelete(set.id);
                  }}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs sm:text-sm rounded-md hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>

              {/* Workout card clickable */}
              <div
                className="cursor-pointer p-4 sm:p-5 pr-3 sm:pr-5 hover:bg-gray-50 transition-colors"
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
          onCreated={handleUpdatedWorkout}
          workoutToEdit={workoutToEdit}
          setWorkoutToEdit={setWorkoutToEdit}
        />
      </div>
    </div>
  );
}
