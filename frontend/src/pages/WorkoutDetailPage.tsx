import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
  WorkoutSet,
  Exercise,
  ExerciseInstance,
} from "../services/workoutService";
import { getWorkoutSetById } from "../services/workoutService";
import WorkoutProgressRow from "../components/WorkoutProgressRow";
import {
  addExerciseInstance,
  removeLatestExerciseInstance,
  updateExerciseRestTime,
  addExercise,
  deleteExercise,
} from "../services/exerciseService";
import type { newExercise } from "../services/exerciseService";
import toast from "react-hot-toast";
import LoadingPopup from "../components/LoadingPopup";
import DropdownMenu from "../components/DropdownMenu";
import EditTimerModal from "../components/EditTimerModal";
import AddExerciseModal from "../components/AddExerciseModal";
import { FileText } from "lucide-react"; // memo icon
import SlideUpPanel from "../components/SlideUpPanel";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { storeWorkoutLogs } from "../services/workoutLogsService";
import { useNavigate } from "react-router-dom";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [showDescriptionId, setShowDescriptionId] = useState<number | null>(
    null,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [workout, setWorkout] = useState<WorkoutSet | null>(
    location.state?.workout ?? null,
  );

  const [memoPanel, setMemoPanel] = useState<{
    isOpen: boolean;
    exerciseId: number;
    content: string | null;
  }>({
    isOpen: false,
    exerciseId: 0,
    content: null,
  });

  const handleMemoUpdated = (updatedExercise: Exercise) => {
    setWorkout((prev) =>
      prev
        ? {
            ...prev,
            exercises: prev.exercises.map((ex) =>
              ex.id === updatedExercise.id ? updatedExercise : ex,
            ),
          }
        : prev,
    );
    // also update the panel content
    setMemoPanel((prev) => ({
      ...prev,
      content: updatedExercise.memo ?? null,
    }));
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleOpenTimerModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsTimerModalOpen(true);
  };

  const handleCloseTimerModal = () => {
    setIsTimerModalOpen(false);
    setSelectedExercise(null);
  };

  useEffect(() => {
    setWorkout(null); // clear old data immediately
    getWorkoutSetById(Number(id)).then(setWorkout);
  }, [id]);

  const modifySet = async (
    exerciseId: number,
    action: "increment" | "decrement",
  ) => {
    setLoading(true);
    try {
      if (action === "increment") {
        const res = await addExerciseInstance(exerciseId);
        if (res.success) {
          setWorkout((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              exercises: prev.exercises.map((ex) => {
                if (ex.id === res.data!.exercise_id) {
                  return {
                    ...ex,
                    instances: [...(ex.instances ?? []), res.data].filter(
                      (inst): inst is ExerciseInstance => inst !== undefined,
                    ),
                  };
                }
                return ex;
              }),
            };
          });
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } else if (action === "decrement") {
        const res = await removeLatestExerciseInstance(exerciseId);
        if (res.success) {
          setWorkout((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              exercises: prev.exercises.map((ex) => {
                if (ex.id === exerciseId) {
                  return {
                    ...ex,
                    instances: ex.instances?.slice(0, -1) ?? [], // remove last instance
                  };
                }
                return ex;
              }),
            };
          });
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action === "increment" ? "add" : "remove"} set`);
      setLoading(false);
    }
  };

  const handleSaveTimer = async (exerciseId: number, seconds: number) => {
    setLoading(true);

    try {
      const res = await updateExerciseRestTime(exerciseId, seconds);
      if (res.success) {
        toast.success(res.message);

        // Update local state for all instances
        setWorkout((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            exercises: prev.exercises.map((ex) => {
              if (ex.id === exerciseId) {
                return {
                  ...ex,
                  restTime: seconds,
                };
              }
              return ex;
            }),
          };
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to update timer", error);
      toast.error("Failed to update timer");
      throw error;
      setLoading(false);
    }
  };

  const handleShowDescription = (exerciseId: number) => {
    setShowDescriptionId((prev) => (prev === exerciseId ? null : exerciseId));
  };

  const handleRemoveExercise = async (exerciseId: number) => {
    setLoading(true);
    try {
      const response = await deleteExercise(exerciseId);

      if (response.success) {
        toast.success("Exercise deleted successfully");

        // Update local state - remove the exercise
        setWorkout((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
          };
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete exercise", error);
      toast.error("Failed to delete exercise");
      throw error;
      setLoading(false);
    }
  };

  const handleAddExercise = async (exercise: newExercise) => {
    setLoading(true);
    try {
      const response = await addExercise(Number(id), exercise);

      if (response.success && response.data) {
        toast.success("Exercise added successfully");
        // Update local state for all instances
        setWorkout((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            exercises: [...prev.exercises, response.data].filter(
              (ex): ex is Exercise => ex !== undefined,
            ),
          };
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to add exercise", error);
      toast.error("Failed to add exercise");
      setLoading(false);
      throw error; // Re-throw to keep modal open
    }
  };

  const { session, updateInstanceProgress, clearSession, getInstanceProgress } =
    useWorkoutSession(workout?.id ?? 0);

  const handleFinishWorkout = async () => {
    // Check if at least one instance is marked as completed
    const hasCompletedSets = Object.values(session.exercises).some(
      (instances) =>
        Object.values(instances).some((instance) => instance.is_completed),
    );

    if (!hasCompletedSets) {
      toast.error("Complete at least one set before finishing.");
      return;
    }

    try {
      console.log("exercises:", session.exercises);
      console.log("exercise count:", Object.keys(session.exercises).length);
      const response = await storeWorkoutLogs(session);
      if (response.success) {
        toast.success(response.message);
        clearSession(); // wipe sessionStorage
        navigate("/"); // navigates back to homepage
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to save workout log:", error);
    }
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <>
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {workout.name}
          </h1>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Timer Display */}
            <div className="text-right">
              <div className="text-xs text-gray-500 font-medium mb-0.5">
                Elapsed Time
              </div>
              <div className="text-lg sm:text-xl font-bold text-blue-600 font-mono">
                {formatElapsedTime(elapsedSeconds)}
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsTimerRunning((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 active:bg-blue-300 transition-colors"
              aria-label={isTimerRunning ? "Pause timer" : "Resume timer"}
            >
              {isTimerRunning ? (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Finish Workout Button */}
            <button
              onClick={handleFinishWorkout}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              Finish
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Overlay when timer is paused */}
        {!isTimerRunning && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-40 rounded-lg">
            <div className="sticky top-4 flex justify-center pt-4">
              <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span className="font-medium">Workout Paused</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workout.exercises.map((ex) => {
            const showDescription = showDescriptionId === ex.id;

            const dropdownOptions = [
              {
                label: "Edit Timer",
                onClick: () => handleOpenTimerModal(ex),
              },
              {
                label: "Remove Exercise",
                onClick: () => handleRemoveExercise(ex.id),
                variant: "danger" as const,
              },
              {
                label: showDescription
                  ? "Hide Description"
                  : "Show Description",
                onClick: () => handleShowDescription(ex.id),
              },
            ];

            return (
              <div
                key={ex.id}
                className="bg-white p-4 md:p-6 rounded-lg shadow-md"
              >
                {/* Header with exercise name and menu */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-1 pr-2">
                    <h4 className="font-semibold text-lg md:text-xl">
                      {ex.name}
                    </h4>
                    <button
                      onClick={() =>
                        setMemoPanel({
                          isOpen: true,
                          exerciseId: ex.id,
                          content: ex.memo ?? null,
                        })
                      }
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="View Memo"
                    >
                      📝
                    </button>
                  </div>
                  <DropdownMenu options={dropdownOptions} />
                </div>

                <SlideUpPanel
                  isOpen={memoPanel.isOpen}
                  onClose={() =>
                    setMemoPanel({
                      isOpen: false,
                      exerciseId: 0,
                      content: null,
                    })
                  }
                  content={memoPanel.content}
                  exerciseId={memoPanel.exerciseId}
                  onMemoUpdated={handleMemoUpdated}
                />

                {/* Sliding Description */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showDescription ? "max-h-96 mb-4" : "max-h-0"
                  }`}
                >
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      {ex.description || "No description available"}
                    </p>
                  </div>
                </div>

                {/* Exercise instances */}
                <div className="space-y-2 mb-4">
                  {ex.instances?.map((instance) => (
                    <WorkoutProgressRow
                      key={instance.id}
                      isBodyweightExercise={ex.is_bodyweight_exercise}
                      exerciseInstance={instance}
                      restTime={ex.restTime}
                      exerciseId={ex.id}
                      progress={getInstanceProgress(ex.id, instance.id)}
                      onProgressChange={(instanceId, data) =>
                        updateInstanceProgress(ex.id, instanceId, data)
                      }
                    />
                  ))}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => modifySet(ex.id, "increment")}
                    className="px-4 py-2.5 bg-green-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors shadow-sm"
                  >
                    Add Set
                  </button>
                  <button
                    onClick={() => modifySet(ex.id, "decrement")}
                    className="px-4 py-2.5 bg-red-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
                  >
                    Reduce Set
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Exercise Button - as a card in the grid */}
          <button
            onClick={() => setIsAddExerciseModalOpen(true)}
            className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all shadow-sm min-h-[200px] flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-gray-600 group-hover:text-blue-600 font-medium text-sm md:text-base transition-colors">
              Add Exercise
            </span>
          </button>
        </div>
      </div>

      {/* Single modal outside the loop */}
      {selectedExercise && (
        <EditTimerModal
          isOpen={isTimerModalOpen}
          onClose={handleCloseTimerModal}
          currentTime={selectedExercise.restTime}
          onSave={(seconds) => handleSaveTimer(selectedExercise.id, seconds)}
          exerciseName={selectedExercise.name}
        />
      )}

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onSave={handleAddExercise}
        workoutSetId={workout.id}
      />

      <LoadingPopup isOpen={loading} />
    </>
  );
}
