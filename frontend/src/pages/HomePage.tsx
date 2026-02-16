import { useEffect, useState } from "react";
import {
  getWorkoutSets,
  deleteWorkoutSet,
  generateWorkout,
} from "../services/workoutService";
import type { WorkoutSet } from "../services/workoutService";
import WorkoutSetCard from "../components/WorkoutSetCard";
import { useNavigate } from "react-router-dom";
import { WorkoutSetModal } from "../components/WorkoutSetModal ";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import LoadingPopup from "../components/LoadingPopup";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<WorkoutSet[]>([]);
  const [workoutToEdit, setWorkoutToEdit] = useState<WorkoutSet | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState<string | undefined>(undefined);

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

  const handleOpenModalForNewWorkout = () => {
    setWorkoutToEdit(undefined); // clear old workout
    setModalOpen(true); // open modal
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    getWorkoutSets()
      .then((data) => setWorkouts(data))
      .catch(() => setError("Failed to fetch workouts"))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setMessage(
      "Generating custom workout using AI, this may take some time...",
    );

    try {
      const payload = {
        experience: "beginner",
        goal: "build muscle",
        weight: 70,
        height: 175,
        maxEffort: true,
      };

      const res = await generateWorkout(payload);

      setRefreshKey((prev) => prev + 1); //refresh the list of workout sets
      console.log("API Response:", res.data);
      // setResponse(res.data);
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with Welcome and Logout */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Gym Workouts
            </h1>
            {user && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-gray-800">{user.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Add button */}
        <div className="mb-6">
          <button
            onClick={handleOpenModalForNewWorkout}
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
                    handleOpenModalForNewWorkout();
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

      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading ? "Generating..." : "Generate Workout"}
        </button>
      </div>

      <LoadingPopup isOpen={loading} message={message} />
    </div>
  );
}
