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
} from "../services/exerciseService";
import toast from "react-hot-toast";
import LoadingPopup from "../components/LoadingPopup";
import DropdownMenu from "../components/DropdownMenu";
import EditTimerModal from "../components/EditTimerModal";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const handleOpenTimerModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsTimerModalOpen(true);
  };

  const handleCloseTimerModal = () => {
    setIsTimerModalOpen(false);
    setSelectedExercise(null);
  };

  const [workout, setWorkout] = useState<WorkoutSet | null>(
    location.state?.workout ?? null,
  );

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
    console.log(exerciseId, seconds);
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
    } catch (error) {
      console.error("Failed to update timer", error);
      toast.error("Failed to update timer");
      throw error;
    }
  };

  const handleRemoveExercise = (exerciseId: number) => {
    // Your remove exercise logic
  };

  const handleShowDescription = (exercise: Exercise) => {
    // Your show description logic
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {workout.exercises.map((ex) => {
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
              label: "Show Description",
              onClick: () => handleShowDescription(ex),
            },
          ];

          return (
            <div
              key={ex.id}
              className="bg-white p-4 md:p-6 rounded-lg shadow-md"
            >
              {/* Header with exercise name and menu */}
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-lg md:text-xl flex-1 pr-2">
                  {ex.name}
                </h4>
                <DropdownMenu options={dropdownOptions} />
              </div>

              {/* Exercise instances */}
              <div className="space-y-2 mb-4">
                {ex.instances?.map((instance) => (
                  <WorkoutProgressRow
                    key={instance.id}
                    exerciseInstance={instance}
                    restTime={ex.restTime}
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
          onClick={() => {
            /* TODO: Handle add exercise */
          }}
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

      <LoadingPopup isOpen={loading} />
    </>
  );
}
